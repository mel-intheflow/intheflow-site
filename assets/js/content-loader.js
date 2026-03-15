(async function () {
  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderMarkdownLight(input) {
    let s = escapeHtml(input).replace(/\r\n?/g, '\n');

    // [text](https://...)
    s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, text, url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    // **bold**
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // *italic*
    s = s.replace(/(^|[^*])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, '$1<em>$2</em>');
    // ==highlight==
    s = s.replace(/==(.+?)==/g, '<mark>$1</mark>');

    // New lines
    s = s.replace(/\n/g, '<br>');
    return s;
  }

  function setMd(el, value) {
    if (!el || !value) return;
    el.innerHTML = renderMarkdownLight(value);
  }

  try {
    const res = await fetch('content/home.json', { cache: 'no-store' });
    if (!res.ok) return;
    const c = await res.json();

    const brandSub = document.querySelector('.brand-copy span');
    if (brandSub && c.brand?.subtitle) brandSub.textContent = c.brand.subtitle;

    const hero = document.querySelector('section.hero .hero-copy');
    if (hero && c.hero) {
      const eyebrow = hero.querySelector('.eyebrow');
      const h1 = hero.querySelector('h1');
      const ps = hero.querySelectorAll('p');
      const ctaPrimary = hero.querySelector('.hero-actions .button');
      const ctaSecondary = hero.querySelector('.hero-actions .link-pill');
      if (eyebrow && c.hero.eyebrow) eyebrow.textContent = c.hero.eyebrow;
      if (h1 && c.hero.headline) h1.textContent = c.hero.headline;
      const heroTexts = Array.isArray(c.hero.paragraphs) && c.hero.paragraphs.length
        ? c.hero.paragraphs.filter(Boolean)
        : [c.hero.text1, c.hero.text2, c.hero.text3, c.hero.text4, c.hero.text5, c.hero.text6].filter(Boolean);
      const actions = hero.querySelector('.hero-actions');
      const heroParagraphs = Array.from(hero.querySelectorAll(':scope > p'));

      // Write all provided hero texts in order (Text1 -> erster Absatz, Text2 -> zweiter Absatz, ...)
      heroTexts.forEach((txt, i) => {
        if (heroParagraphs[i]) {
          setMd(heroParagraphs[i], txt);
        } else {
          const p = document.createElement('p');
          setMd(p, txt);
          hero.insertBefore(p, actions || null);
          heroParagraphs.push(p);
        }
      });

      // Remove stale extra paragraphs so old/double text cannot persist
      for (let i = heroTexts.length; i < heroParagraphs.length; i++) {
        heroParagraphs[i].remove();
      }
      if (ctaPrimary && c.hero.ctaPrimaryLabel) ctaPrimary.textContent = c.hero.ctaPrimaryLabel;
      if (ctaSecondary && c.hero.ctaSecondaryLabel) ctaSecondary.textContent = c.hero.ctaSecondaryLabel;
      const badge = document.querySelector('.hero-badge');
      if (badge && (c.hero.badgeTitle || c.hero.badgeText)) {
        const t = escapeHtml(c.hero.badgeTitle || '');
        const x = renderMarkdownLight(c.hero.badgeText || '');
        badge.innerHTML = `<strong>${t}</strong> ${x}`.trim();
      }
    }

    if (c.about) {
      const aboutLeftH2 = document.querySelector('.section-block .content-card .section-header h2');
      if (aboutLeftH2 && c.about.leftHeading) aboutLeftH2.textContent = c.about.leftHeading;
      const aboutLeftPs = document.querySelectorAll('.section-block .content-card p');
      (c.about.leftParagraphs || []).forEach((t, i) => {
        if (aboutLeftPs[i] && t) setMd(aboutLeftPs[i], t);
      });
      const aboutRightH2 = document.querySelector('.content-card.alt .section-header h2');
      if (aboutRightH2 && c.about.rightHeading) aboutRightH2.textContent = c.about.rightHeading;
      const certList = document.querySelector('.content-card.alt .cert-list');
      if (certList && Array.isArray(c.about.certificates) && c.about.certificates.length) {
        certList.innerHTML = c.about.certificates
          .filter(x => x?.title && x?.href)
          .map(x => `<li><a href="${escapeHtml(x.href)}">${escapeHtml(x.title)}</a></li>`)
          .join('');
      }
      const infoNote = document.querySelector('.content-card.alt .info-note');
      if (infoNote && c.about.infoNote) setMd(infoNote, c.about.infoNote);
    }

    if (c.approach) {
      const sec = document.getElementById('textvorlagen');
      if (sec) {
        const h2 = sec.querySelector('.section-header h2');
        const intro = sec.querySelector('.section-header p');
        if (h2 && c.approach.heading) h2.textContent = c.approach.heading;
        if (intro && c.approach.intro) setMd(intro, c.approach.intro);

        const grid = sec.querySelector('.template-grid');
        if (grid) {
          const legacyCards = Array.from(grid.querySelectorAll('.template-card'));
          const imageCard = legacyCards.find(card => card.querySelector('.template-image'));

          if (imageCard && c.approach.impressions) {
            const k = imageCard.querySelector('.card-kicker');
            const t = imageCard.querySelector('h3');
            if (k && c.approach.impressions.kicker) k.textContent = c.approach.impressions.kicker;
            if (t && c.approach.impressions.title) t.textContent = c.approach.impressions.title;
          }

          const legacyData = [
            {
              kicker: 'Zielgruppe',
              title: c.approach.zielgruppeTitle,
              paragraphs: [c.approach.zielgruppeText1, c.approach.zielgruppeText2].filter(Boolean)
            },
            {
              kicker: 'Arbeitsweise',
              title: c.approach.arbeitsweiseTitle,
              paragraphs: [c.approach.arbeitsweiseText1, c.approach.arbeitsweiseText2, c.approach.arbeitsweiseText3].filter(Boolean)
            },
            {
              kicker: 'Fastenbegleitung',
              title: c.approach.fastenTitle,
              paragraphs: [c.approach.fastenText1, c.approach.fastenText2, c.approach.fastenText3, c.approach.fastenText4].filter(Boolean)
            }
          ].filter(x => x.title);

          const dynamicCards = Array.isArray(c.approach.cards) && c.approach.cards.length ? c.approach.cards : legacyData;

          legacyCards.forEach(card => {
            if (card !== imageCard) card.remove();
          });

          const buildCard = (entry) => {
            const card = document.createElement('article');
            card.className = 'template-card';
            const kicker = entry.kicker || '';
            const title = entry.title || '';
            const paragraphs = Array.isArray(entry.paragraphs) ? entry.paragraphs.filter(Boolean) : [];
            card.innerHTML = `<span class="card-kicker">${escapeHtml(kicker)}</span><h3>${escapeHtml(title)}</h3>`;
            paragraphs.forEach(txt => {
              const p = document.createElement('p');
              setMd(p, txt);
              card.appendChild(p);
            });
            return card;
          };

          if (imageCard && dynamicCards.length) {
            const split = Math.max(dynamicCards.length - 1, 0);
            const beforeImage = dynamicCards.slice(0, split);
            const afterImage = dynamicCards.slice(split);

            beforeImage.forEach(entry => grid.insertBefore(buildCard(entry), imageCard));
            let anchor = imageCard.nextSibling;
            afterImage.forEach(entry => {
              const node = buildCard(entry);
              grid.insertBefore(node, anchor);
              anchor = node.nextSibling;
            });
          } else {
            dynamicCards.forEach(entry => grid.appendChild(buildCard(entry)));
          }
        }
      }
    }

    function patchSection(id, data) {
      const sec = document.getElementById(id);
      if (!sec || !data) return;
      const h2 = sec.querySelector('.section-header h2');
      const p = sec.querySelector('.section-header p');
      if (h2 && data.headline) h2.textContent = data.headline;
      if (p && data.intro) setMd(p, data.intro);
    }
    patchSection('angebot', c.angebot);
    patchSection('kurse', c.kurse);
    patchSection('veranstaltungen', c.veranstaltungen);

    if (Array.isArray(c.offerCards)) {
      const cards = document.querySelectorAll('#angebot .offer-card');
      c.offerCards.forEach((oc, i) => {
        const card = cards[i]; if (!card) return;
        const k = card.querySelector('.card-kicker'); const t = card.querySelector('h3');
        if (k && oc.kicker) k.textContent = oc.kicker;
        if (t && oc.title) t.textContent = oc.title;
        const ul = card.querySelector('.offer-list');
        const listItems = Array.isArray(oc.items) ? oc.items.filter(Boolean) : [];
        if (ul && listItems.length) {
          ul.innerHTML = listItems.map(x => `<li>${renderMarkdownLight(x)}</li>`).join('');
        }

        const textFields = [oc.text1, oc.text2, oc.text3, oc.text4].filter(Boolean);
        if (textFields.length) {
          ul?.remove();
          let copy = card.querySelector('.offer-copy');
          if (!copy) {
            copy = document.createElement('div');
            copy.className = 'offer-copy';
            card.appendChild(copy);
          }
          const combined = [...textFields, ...listItems];
          copy.innerHTML = combined.map(t => `<p>${renderMarkdownLight(t)}</p>`).join('');
        }
      });
    }

    if (c.hinweis) {
      const noteCard = document.querySelectorAll('#angebot .offer-card')[3];
      if (noteCard) {
        const h3 = noteCard.querySelector('h3');
        if (h3 && c.hinweis.title) h3.textContent = c.hinweis.title;

        const legacyPs = noteCard.querySelectorAll('p');
        const listItems = Array.isArray(c.hinweis.items) ? c.hinweis.items.filter(Boolean) : [];

        if (listItems.length) {
          legacyPs.forEach(p => p.remove());
          let ul = noteCard.querySelector('.offer-list');
          if (!ul) {
            ul = document.createElement('ul');
            ul.className = 'offer-list';
            noteCard.appendChild(ul);
          }
          ul.innerHTML = listItems.map(x => `<li>${renderMarkdownLight(x)}</li>`).join('');
        }
      }
    }

    if (Array.isArray(c.courseCards)) {
      const cards = document.querySelectorAll('#kurse .course-card');
      c.courseCards.forEach((cc, i) => {
        const card = cards[i]; if (!card) return;
        const k = card.querySelector('.card-kicker'); const t = card.querySelector('h3');
        if (k && cc.kicker) k.textContent = cc.kicker;
        if (t && cc.title) t.textContent = cc.title;
        const ul = card.querySelector('.meta-list');
        if (ul && Array.isArray(cc.rows)) ul.innerHTML = cc.rows.map(r => `<li>${renderMarkdownLight(r)}</li>`).join('');
      });
    }

    if (c.schnuppern) {
      const card = document.querySelectorAll('#kurse .course-card')[4];
      if (card) {
        const h3 = card.querySelector('h3'); const p = card.querySelector('p');
        if (h3 && c.schnuppern.title) h3.textContent = c.schnuppern.title;
        if (p && c.schnuppern.text) setMd(p, c.schnuppern.text);
      }
    }

    if (Array.isArray(c.events)) {
      const cards = document.querySelectorAll('#veranstaltungen .event-card');
      c.events.forEach((ev, i) => {
        const card = cards[i]; if (!card) return;
        const kicker = card.querySelector('.card-kicker'); const title = card.querySelector('h3');
        const li = card.querySelectorAll('.meta-list li');
        if (kicker && ev.kicker) kicker.textContent = ev.kicker;
        if (title && ev.title) title.textContent = ev.title;

        const eventTexts = [ev.text, ev.text2, ev.text3].filter(Boolean);
        const ps = card.querySelectorAll('p');
        if (eventTexts.length) {
          ps.forEach((node, idx) => {
            if (eventTexts[idx]) setMd(node, eventTexts[idx]);
          });
          for (let j = ps.length; j < eventTexts.length; j++) {
            const newP = document.createElement('p');
            setMd(newP, eventTexts[j]);
            const meta = card.querySelector('.meta-list');
            card.insertBefore(newP, meta || null);
          }
        }

        if (li[0] && ev.format) li[0].innerHTML = '<strong>Format</strong> ' + renderMarkdownLight(ev.format);
        if (li[1] && ev.haeufigkeit) li[1].innerHTML = '<strong>Häufigkeit</strong> ' + renderMarkdownLight(ev.haeufigkeit);
        if (li[2] && ev.termin) li[2].innerHTML = '<strong>Nächster Termin</strong> ' + renderMarkdownLight(ev.termin);
      });
    }

    if (c.kontakt) {
      const sec = document.getElementById('kontakt');
      if (sec) {
        const h2 = sec.querySelector('.contact-card h2'); const p = sec.querySelector('.contact-card p'); const wBtn = sec.querySelector('.contact-card .button');
        if (h2 && c.kontakt.headline) h2.textContent = c.kontakt.headline;
        if (p && c.kontakt.intro) setMd(p, c.kontakt.intro);
        if (wBtn && c.kontakt.whatsappLabel) wBtn.textContent = c.kontakt.whatsappLabel;
        const quote = sec.querySelector('.quote-card blockquote'); const quoteP = sec.querySelector('.quote-card p');
        if (quote && c.kontakt.quote) setMd(quote, c.kontakt.quote);
        if (quoteP && c.kontakt.quoteText) setMd(quoteP, c.kontakt.quoteText);
        const cards = sec.querySelectorAll('.template-grid .template-card');
        if (cards[0]) {
          cards[0].querySelector('h3').textContent = c.kontakt.statusTitle || '';
          const ps = cards[0].querySelectorAll('p');
          if (ps[0]) setMd(ps[0], c.kontakt.statusText1 || '');
          if (ps[1]) setMd(ps[1], c.kontakt.statusText2 || '');
        }
        if (cards[1]) {
          cards[1].querySelector('h3').textContent = c.kontakt.impulsTitle || '';
          const ps = cards[1].querySelectorAll('p');
          if (ps[0]) setMd(ps[0], c.kontakt.impulsText1 || '');
          if (ps[1]) setMd(ps[1], c.kontakt.impulsText2 || '');
        }
      }
    }

    const foot = document.querySelector('.footer .footer-inner > span');
    if (foot && c.footer?.copyright) foot.textContent = c.footer.copyright;
  } catch (e) {
    console.warn('content loader inactive', e);
  }
})();
