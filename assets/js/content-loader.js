(async function () {
  try {
    const res = await fetch('content/home.json', { cache: 'no-store' });
    if (!res.ok) return;
    const c = await res.json();

    const hero = document.querySelector('section.hero .hero-copy');
    if (hero && c.hero) {
      const h1 = hero.querySelector('h1');
      const ps = hero.querySelectorAll('p');
      if (h1 && c.hero.headline) h1.textContent = c.hero.headline;
      if (ps[1] && c.hero.text1) ps[1].textContent = c.hero.text1;
      if (ps[2] && c.hero.text2) ps[2].textContent = c.hero.text2;
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

    const kontakt = document.getElementById('kontakt');
    if (kontakt && c.kontakt) {
      const h2 = kontakt.querySelector('.contact-card h2');
      const p = kontakt.querySelector('.contact-card p');
      const wBtn = kontakt.querySelector('.contact-card .button');
      if (h2 && c.kontakt.headline) h2.textContent = c.kontakt.headline;
      if (p && c.kontakt.intro) p.textContent = c.kontakt.intro;
      if (wBtn && c.kontakt.whatsappLabel) wBtn.textContent = c.kontakt.whatsappLabel;
    }
  } catch (e) {
    console.warn('content loader inactive', e);
  }
})();
