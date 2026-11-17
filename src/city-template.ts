const pagesAssets = import.meta.env.BASE_URL + 'assets/';
import './city-template.css';
import { cityWedding as wedding } from './city-wedding';

const asset = (name: string) => `${pagesAssets}city/${name}.webp`;
const escapeText = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

export function renderCityTemplate(app: HTMLElement) {
  document.title = 'નમૂના · ગુલાબી શહેરનું આમંત્રણ';
  document.documentElement.lang = 'gu';
  const [first, second] = wedding.couple.map(escapeText);
  app.innerHTML = `<main class="city-invite" lang="gu">
    <a class="city-home" href="/gujarati/" aria-label="ગુજરાતી નમૂનાઓ પર પાછા જાઓ">⌂</a>
    <p class="city-demo">નમૂના આમંત્રણ · બધી વિગતો કલ્પિત છે</p>
    <section class="city-hero" aria-labelledby="city-title">
      <img class="city-hero-floral" src="${asset('bougainvillea-jasmine-corner')}" alt="" aria-hidden="true">
      <img class="city-birds" src="${asset('parakeet-pair')}" alt="" aria-hidden="true">
      <div class="city-hero-copy"><span class="city-kicker">${escapeText(wedding.greeting)}</span><p>સ્નેહભર્યું લગ્ન આમંત્રણ</p><h1 id="city-title">${first}<span>અને</span>${second}</h1><p class="city-date">${escapeText(wedding.date)}</p></div>
      <div class="city-scroll-hint">આગળ જુઓ ↓</div>
    </section>
    <section class="city-invitation" aria-labelledby="city-invite-title">
      <div class="city-invitation-art"><img src="${asset('mobile-floral-sandstone-arch')}" alt="" loading="lazy" aria-hidden="true"><div class="city-invitation-copy"><span>${escapeText(wedding.greeting)}</span><h2 id="city-invite-title">આપને હાર્દિક<br>આમંત્રણ</h2><p>${escapeText(wedding.invitation)}</p><strong>${first} <i>અને</i> ${second}</strong><small>${escapeText(wedding.date)}</small></div></div>
    </section>
    <section class="city-events" aria-labelledby="city-events-title"><p class="city-kicker">સાથે ઉજવીએ</p><h2 id="city-events-title">ઉજવણીના પ્રસંગો</h2><p class="city-events-intro">દરેક પ્રસંગમાં આપનું સ્વાગત છે</p><div class="city-event-list">${wedding.events.map((event, index) => `<article class="city-event city-event-${event.motif}"><span class="city-event-index">${String(index + 1).replace(/\d/g, digit => '૦૧૨૩૪૫૬૭૮૯'[Number(digit)])}</span><img src="${asset(({flowers:'bougainvillea-jasmine-corner',lanterns:'lantern-festoon',car:'vintage-wedding-car',arch:'sandstone-jharokha'} as const)[event.motif])}" alt="" loading="lazy" aria-hidden="true"><div class="city-event-copy"><h3>${escapeText(event.title)}</h3><p>${escapeText(event.description)}</p><dl><div><dt>તારીખ</dt><dd>${escapeText(event.date)}</dd></div><div><dt>સમય</dt><dd>${escapeText(event.time)}</dd></div><div><dt>સ્થળ</dt><dd>${escapeText(event.venue)}</dd></div></dl></div></article>`).join('')}</div></section>
    <section class="city-note" aria-labelledby="city-note-title"><img src="${asset('lantern-festoon')}" alt="" loading="lazy" aria-hidden="true"><div><p class="city-kicker">આપના માટે</p><h2 id="city-note-title">અમારો સંદેશ</h2><p>${escapeText(wedding.note)}</p><strong>${first} અને ${second}</strong></div></section>
    <section class="city-closing" aria-labelledby="city-close-title"><img src="${asset('vintage-wedding-car')}" alt="" loading="lazy" aria-hidden="true"><p class="city-kicker">${escapeText(wedding.date)}</p><h2 id="city-close-title">મળીએ જલ્દી!</h2><p>${escapeText(wedding.closing)}</p><p class="city-families">${wedding.families.map(escapeText).join(' · ')}</p><small>આ નમૂનાની તારીખ, સમય અને સ્થળ કલ્પિત છે.</small></section>
  </main>`;
}
