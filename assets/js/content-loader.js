(async function () {
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
      if (ps[1] && c.hero.text1) ps[1].textContent = c.hero.text1;
      if (ps[2] && c.hero.text2) ps[2].textContent = c.hero.text2;
      if (ctaPrimary && c.hero.ctaPrimaryLabel) ctaPrimary.textContent = c.hero.ctaPrimaryLabel;
      if (ctaSecondary && c.hero.ctaSecondaryLabel) ctaSecondary.textContent = c.hero.ctaSecondaryLabel;
      const badge = document.querySelector('.hero-badge');
      if (badge && (c.hero.badgeTitle || c.hero.badgeText)) {
        const t = c.hero.badgeTitle || '';
        const x = c.hero.badgeText || '';
        badge.innerHTML = `<strong>${t}</strong> ${x}`.trim();
      }
    }

    if (c.about) {
      const aboutLeftH2 = document.querySelector('.section-block .content-card .section-header h2');
      if (aboutLeftH2 && c.about.leftHeading) aboutLeftH2.textContent = c.about.leftHeading;
      const aboutLeftPs = document.querySelectorAll('.section-block .content-card p');
      (c.about.leftParagraphs || []).forEach((t, i) => {
        if (aboutLeftPs[i] && t) aboutLeftPs[i].textContent = t;
      });
      const aboutRightH2 = document.querySelector('.content-card.alt .section-header h2');
      if (aboutRightH2 && c.about.rightHeading) aboutRightH2.textContent = c.about.rightHeading;
      const infoNote = document.querySelector('.content-card.alt .info-note');
      if (infoNote && c.about.infoNote) infoNote.textContent = c.about.infoNote;
    }

    if (c.approach) {
      const sec = document.getElementById('textvorlagen');
      if (sec) {
        const h2 = sec.querySelector('.section-header h2');
        const intro = sec.querySelector('.section-header p');
        if (h2 && c.approach.heading) h2.textContent = c.approach.heading;
        if (intro && c.approach.intro) intro.textContent = c.approach.intro;
        const cards = sec.querySelectorAll('.template-card');
        if (cards[0]) { cards[0].querySelector('h3').textContent = c.approach.zielgruppeTitle || ''; const p=cards[0].querySelectorAll('p'); if(p[0]) p[0].textContent=c.approach.zielgruppeText1||''; if(p[1]) p[1].textContent=c.approach.zielgruppeText2||''; }
        if (cards[1]) { cards[1].querySelector('h3').textContent = c.approach.arbeitsweiseTitle || ''; const p=cards[1].querySelectorAll('p'); if(p[0]) p[0].textContent=c.approach.arbeitsweiseText1||''; if(p[1]) p[1].textContent=c.approach.arbeitsweiseText2||''; }
        if (cards[3]) { cards[3].querySelector('h3').textContent = c.approach.fastenTitle || ''; const p=cards[3].querySelectorAll('p'); if(p[0]) p[0].textContent=c.approach.fastenText1||''; if(p[1]) p[1].textContent=c.approach.fastenText2||''; }
      }
    }

    function patchSection(id, data) {
      const sec = document.getElementById(id);
      if (!sec || !data) return;
      const h2 = sec.querySelector('.section-header h2');
      const p = sec.querySelector('.section-header p');
      if (h2 && data.headline) h2.textContent = data.headline;
      if (p && data.intro) p.textContent = data.intro;
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
        if (ul && Array.isArray(oc.items)) {
          ul.innerHTML = oc.items.map(x => `<li>${x}</li>`).join('');
        }
      });
    }

    if (c.hinweis) {
      const noteCard = document.querySelectorAll('#angebot .offer-card')[3];
      if (noteCard) {
        const h3 = noteCard.querySelector('h3'); const ps = noteCard.querySelectorAll('p');
        if (h3 && c.hinweis.title) h3.textContent = c.hinweis.title;
        if (ps[0] && c.hinweis.text1) ps[0].textContent = c.hinweis.text1;
        if (ps[1] && c.hinweis.text2) ps[1].textContent = c.hinweis.text2;
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
        if (ul && Array.isArray(cc.rows)) ul.innerHTML = cc.rows.map(r => `<li>${r}</li>`).join('');
      });
    }

    if (c.schnuppern) {
      const card = document.querySelectorAll('#kurse .course-card')[4];
      if (card) {
        const h3 = card.querySelector('h3'); const p = card.querySelector('p');
        if (h3 && c.schnuppern.title) h3.textContent = c.schnuppern.title;
        if (p && c.schnuppern.text) p.textContent = c.schnuppern.text;
      }
    }

    if (Array.isArray(c.events)) {
      const cards = document.querySelectorAll('#veranstaltungen .event-card');
      c.events.forEach((ev, i) => {
        const card = cards[i]; if (!card) return;
        const kicker = card.querySelector('.card-kicker'); const title = card.querySelector('h3'); const text = card.querySelector('p');
        const li = card.querySelectorAll('.meta-list li');
        if (kicker && ev.kicker) kicker.textContent = ev.kicker;
        if (title && ev.title) title.textContent = ev.title;
        if (text && ev.text) text.textContent = ev.text;
        if (li[0] && ev.format) li[0].innerHTML = '<strong>Format</strong> ' + ev.format;
        if (li[1] && ev.haeufigkeit) li[1].innerHTML = '<strong>Häufigkeit</strong> ' + ev.haeufigkeit;
      });
    }

    if (c.kontakt) {
      const sec = document.getElementById('kontakt');
      if (sec) {
        const h2 = sec.querySelector('.contact-card h2'); const p = sec.querySelector('.contact-card p'); const wBtn = sec.querySelector('.contact-card .button');
        if (h2 && c.kontakt.headline) h2.textContent = c.kontakt.headline;
        if (p && c.kontakt.intro) p.textContent = c.kontakt.intro;
        if (wBtn && c.kontakt.whatsappLabel) wBtn.textContent = c.kontakt.whatsappLabel;
        const quote = sec.querySelector('.quote-card blockquote'); const quoteP = sec.querySelector('.quote-card p');
        if (quote && c.kontakt.quote) quote.textContent = c.kontakt.quote;
        if (quoteP && c.kontakt.quoteText) quoteP.textContent = c.kontakt.quoteText;
        const cards = sec.querySelectorAll('.template-grid .template-card');
        if (cards[0]) { cards[0].querySelector('h3').textContent = c.kontakt.statusTitle || ''; const ps=cards[0].querySelectorAll('p'); if(ps[0]) ps[0].textContent=c.kontakt.statusText1||''; if(ps[1]) ps[1].textContent=c.kontakt.statusText2||''; }
        if (cards[1]) { cards[1].querySelector('h3').textContent = c.kontakt.impulsTitle || ''; const ps=cards[1].querySelectorAll('p'); if(ps[0]) ps[0].textContent=c.kontakt.impulsText1||''; if(ps[1]) ps[1].textContent=c.kontakt.impulsText2||''; }
      }
    }

    const foot = document.querySelector('.footer .footer-inner > span');
    if (foot && c.footer?.copyright) foot.textContent = c.footer.copyright;
  } catch (e) {
    console.warn('content loader inactive', e);
  }
})();
