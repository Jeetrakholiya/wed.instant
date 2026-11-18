import './city-template.css';
import { cityWedding as wedding } from './city-wedding';
import { referenceFamilyGroups, referenceTahuko, referenceVenueDetails } from './gujarati-reference-details';

const cityAsset = (file: string) => `${import.meta.env.BASE_URL}assets/city/${file}`;
const asset = (name: string) => cityAsset(`${name}.webp`);
const escapeText = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

export function renderCityTemplate(app: HTMLElement) {
  document.title = 'નમૂના · ગુલાબી શહેરનું આમંત્રણ';
  document.documentElement.lang = 'gu';
  const [first, second] = wedding.couple.map(escapeText);
  const eventArt = ['event-mehendi', 'event-sangeet', 'event-baraat', 'event-wedding', 'event-reception'] as const;
  const familyCards = [
    ...referenceVenueDetails.map(group => ({ title: group.title, lines: group.lines })),
    ...referenceFamilyGroups.map(group => ({ title: group.title, lines: group.names })),
    { title: 'ટહુકો', lines: referenceTahuko },
  ];
  app.innerHTML = `<main class="city-invite" lang="gu">
    <a class="city-home" href="${import.meta.env.BASE_URL}gujarati/" aria-label="ગુજરાતી નમૂનાઓ પર પાછા જાઓ">⌂</a>
    <p class="city-demo">નમૂના આમંત્રણ · બધી વિગતો કલ્પિત છે</p>
    <section class="city-hero" aria-labelledby="city-title">
      <div class="city-intro-scene" aria-hidden="true"><div class="city-intro-sky"></div><img class="city-intro-painting" src="${cityAsset('painted-fort-couple.png')}" alt=""><div class="city-petals">${Array.from({ length: 16 }, (_, index) => `<i style="--n:${index};--x:${(index * 37) % 100}%;--delay:-${(index * 1.7) % 11}s;--size:${[18, 27, 37, 24, 48, 31][index % 6]}px;--depth:${[.55, .8, 1, .68, 1.18, .9][index % 6]};--drift:${[28, -45, 76, -20, 105, 48][index % 6]}px"></i>`).join('')}</div></div>
      <img class="city-hero-floral" src="${asset('bougainvillea-jasmine-corner')}" alt="" aria-hidden="true">
      <img class="city-birds" src="${asset('parakeet-pair')}" alt="" aria-hidden="true">
      <div class="city-hero-copy"><span class="city-kicker">${escapeText(wedding.greeting)}</span><p>સ્નેહભર્યું લગ્ન આમંત્રણ</p><h1 id="city-title">${first}<span>અને</span>${second}</h1><p class="city-date">${escapeText(wedding.date)}</p></div>
      <div class="city-scroll-hint">આગળ જુઓ ↓</div>
    </section>
    <section class="city-garden" aria-label="કિલ્લા નીચેનો ફૂલોથી ભરેલો બગીચો"><span class="city-garden-caption">ઉજવણીના બગીચામાં આપનું સ્વાગત છે</span></section>
    <div class="city-details">
    <section class="city-ceremony" aria-labelledby="city-ceremony-title"><div class="city-ceremony-inner"><p class="city-ceremony-prayer">${escapeText(wedding.greeting)}</p><img class="city-ceremony-ganesh" src="${asset('ganesh-ornament')}" alt="" loading="lazy"><p class="city-ceremony-family">${wedding.families.map(escapeText).join(' · ')}</p><h2 id="city-ceremony-title">સ્નેહભર્યું આમંત્રણ</h2><p class="city-ceremony-message">${escapeText(wedding.invitation)}</p><p class="city-ceremony-names">${first}<span>અને</span>${second}</p><p class="city-ceremony-date">${escapeText(wedding.date)}</p></div></section>
    <section class="city-events" aria-labelledby="city-events-title"><p class="city-kicker">સાથે ઉજવીએ</p><h2 id="city-events-title">ઉજવણીના પ્રસંગો</h2><p class="city-events-intro">દરેક પ્રસંગમાં આપનું સ્વાગત છે</p><div class="city-event-list">${wedding.events.map((event, index) => `<article class="city-function"><span class="city-function-index">${String(index + 1).replace(/\d/g, digit => '૦૧૨૩૪૫૬૭૮૯'[Number(digit)])}</span><img class="city-function-art" src="${asset(eventArt[index] ?? eventArt[0])}" alt="${escapeText(event.title)} પ્રસંગનું ચિત્ર" loading="lazy"><div class="city-function-copy"><h3>${escapeText(event.title)}</h3><p>${escapeText(event.description)}</p><dl><div><dt>તારીખ</dt><dd>${escapeText(event.date)}</dd></div><div><dt>સમય</dt><dd>${escapeText(event.time)}</dd></div><div><dt>સ્થળ</dt><dd>${escapeText(event.venue)}</dd></div></dl></div></article>`).join('')}</div></section>
    </div>
    <div class="city-ocean">
      <section class="city-voyage" aria-labelledby="city-voyage-title"><div class="city-voyage-stage"><p class="city-voyage-kicker">આપણી ઉજવણી આગળ વધે છે</p><h2 id="city-voyage-title">સ્નેહની સફર</h2><p class="city-voyage-line">પરિવારના પ્રેમ અને આશીર્વાદ સાથે</p><div class="city-voyage-approach"><img class="city-voyage-ship" src="${asset('royal-sailing-ship')}" alt="" loading="lazy"></div><span class="city-voyage-water" aria-hidden="true"></span></div></section>
      <section class="city-family" aria-labelledby="city-family-title"><div class="city-family-heading"><p class="city-family-kicker">પરિવારના પ્રેમભર્યા પરિચય</p><h2 id="city-family-title">અમારા સ્વજનો</h2><p class="city-family-intro">આપનું સ્વાગત કરવા આતુર</p></div><div class="city-family-grid">${familyCards.map((group, index) => `<article class="city-family-card${index === familyCards.length - 1 ? ' city-family-card--verse' : ''}"><span class="city-family-number">${String(index + 1).replace(/\d/g, digit => '૦૧૨૩૪૫૬૭૮૯'[Number(digit)])}</span><h3>${escapeText(group.title)}</h3><div class="city-family-rule" aria-hidden="true">✦</div><div class="city-family-lines">${group.lines.map(line => `<p>${escapeText(line)}</p>`).join('')}</div></article>`).join('')}</div></section>
      <section class="city-farewell" aria-labelledby="city-close-title">
      <div class="city-farewell-stage">
        <div class="city-note"><p class="city-kicker">આપના માટે</p><h2 id="city-note-title">અમારો સંદેશ</h2><p>${escapeText(wedding.note)}</p><strong>${first} અને ${second}</strong></div>
        <img class="city-farewell-car" src="${cityAsset('farewell-couple-car-front.png')}" alt="મહેલના મુખ્ય દ્વારથી સીધી આગળ આવતી નવદંપતીની વિન્ટેજ કાર" loading="eager" decoding="async" fetchpriority="high">
        <div class="city-closing"><p class="city-kicker">${escapeText(wedding.date)}</p><h2 id="city-close-title">મળીએ જલ્દી!</h2><p>${escapeText(wedding.closing)}</p><p class="city-families">${wedding.families.map(escapeText).join(' · ')}</p><small>આ નમૂનાની તારીખ, સમય અને સ્થળ કલ્પિત છે.</small></div>
      </div>
      </section>
    </div>
  </main>`;
  const hero = app.querySelector<HTMLElement>('.city-hero');
  const voyage = app.querySelector<HTMLElement>('.city-voyage');
  const farewell = app.querySelector<HTMLElement>('.city-farewell');
  const familyCardElements = Array.from(app.querySelectorAll<HTMLElement>('.city-family-card'));
  if (!hero) return;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  const update = () => {
    frame = 0;
    const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - innerHeight * .2)));
    hero.style.setProperty('--intro-progress', String(reducedMotion.matches ? 1 : progress));
    if (voyage) {
      const voyageProgress = Math.min(1, Math.max(0, (innerHeight - voyage.getBoundingClientRect().top) / (innerHeight * 1.2)));
      voyage.style.setProperty('--voyage-progress', String(reducedMotion.matches ? 1 : voyageProgress));
    }
    if (farewell) {
      const farewellRect = farewell.getBoundingClientRect();
      // Begin the drive while the palace is entering the viewport, not only after
      // the whole farewell section reaches the top. This makes the car visibly
      // travel from the doorway along the road instead of appearing to scale in place.
      const farewellProgress = Math.min(1, Math.max(0,
        (innerHeight * .92 - farewellRect.top) / Math.max(1, innerHeight * 1.55),
      ));
      farewell.style.setProperty('--farewell-progress', String(reducedMotion.matches ? .78 : farewellProgress));
      const carProgress = reducedMotion.matches ? .78 : farewellProgress;
      farewell.style.setProperty('--farewell-car-y', `calc(-50% + ${carProgress * 26}svh)`);
      farewell.style.setProperty('--farewell-car-scale', String(.13 + carProgress * .99));
      farewell.style.setProperty('--farewell-shadow-y', `${5 + carProgress * 22}px`);
      farewell.style.setProperty('--farewell-shadow-blur', `${4 + carProgress * 16}px`);
      const noteExit = Math.min(1, Math.max(0, (farewellProgress - .5) / .22));
      farewell.style.setProperty('--farewell-note-opacity', String(reducedMotion.matches ? 0 : 1 - noteExit));
      farewell.style.setProperty('--farewell-note-rise', `${noteExit * -5}rem`);
    }
    familyCardElements.forEach(card => {
      const cardProgress = Math.min(1, Math.max(0, (innerHeight - card.getBoundingClientRect().top) / (innerHeight * .44)));
      card.style.setProperty('--family-card-progress', String(reducedMotion.matches ? 1 : cardProgress));
    });
  };
  const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  reducedMotion.addEventListener('change', onScroll);
  update();
}
