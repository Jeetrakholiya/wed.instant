import './city-template.css';
import { cityWedding as wedding } from './city-wedding';
import { referenceFamilyGroups, referenceTahuko, referenceVenueDetails } from './gujarati-reference-details';

const cityAsset = (file: string) => `${import.meta.env.BASE_URL}assets/city/${file}`;
const asset = (name: string) => cityAsset(`${name}.webp`);
const escapeText = (value: string) =>
  value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);

const toGujaratiDigits = (num: number | string): string =>
  String(num).replace(/\d/g, d => '૦૧૨૩૪૫૬૭૮૯'[Number(d)]);

function triggerIcsDownload(eventTitle: string, description: string, venue: string, startIso: string, endIso: string) {
  const pad = (s: string) => s.replace(/[-:]/g, '');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WedInstant//City Wedding//GU',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `SUMMARY:${eventTitle} - ${wedding.couple.join(' & ')}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${venue}`,
    `DTSTART:${pad(startIso)}`,
    `DTEND:${pad(endIso)}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${eventTitle}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function renderCityTemplate(app: HTMLElement) {
  document.title = `${wedding.couple.join(' અને ')} · શાહી લગ્ન આમંત્રણ`;
  document.documentElement.lang = 'gu';

  const [first, second] = wedding.couple.map(escapeText);
  const eventArt = ['event-mehendi', 'event-sangeet', 'event-baraat', 'event-wedding', 'event-reception'] as const;

  const familyCards = [
    ...referenceVenueDetails.map(group => ({ title: group.title, lines: group.lines, side: 'both' })),
    ...referenceFamilyGroups.map(group => ({ title: group.title, lines: group.names, side: group.title.includes('વર') ? 'groom' : group.title.includes('કન્યા') ? 'bride' : 'both' })),
    { title: 'ટહુકો', lines: referenceTahuko, side: 'both' },
  ];

  app.innerHTML = `
  <main class="city-invite" lang="gu">
    <!-- Floating Header Controls -->
    <header class="city-top-bar" aria-label="મુખ્ય નેવિગેશન">
      <a class="city-home-btn" href="${import.meta.env.BASE_URL}gujarati/" aria-label="ગુજરાતી નમૂનાઓ પર પાછા જાઓ">⌂</a>
      <button class="city-music-btn" id="city-music-toggle" aria-label="સંગીત ચાલુ અથવા બંધ કરો" type="button">
        <span class="city-music-icon" aria-hidden="true">🎵</span>
        <span class="city-music-label">સંગીત</span>
      </button>
      <div class="city-demo-tag">નમૂના આમંત્રણ · કલ્પિત વિગતો</div>
    </header>

    <!-- Hidden Background Audio Player -->
    <audio id="city-bg-audio" preload="none" loop>
      <source src="${import.meta.env.BASE_URL}assets/vow-vine-original-wedding-loop.wav" type="audio/wav">
    </audio>

    <!-- Continuous Hero & Palace Tower Stage -->
    <section class="city-hero" aria-labelledby="city-title">
      <div class="city-intro-stage" aria-hidden="true">
        <div class="city-continuous-palace"></div>
        <div class="city-petals">
          ${Array.from({ length: 16 }, (_, i) => `<i style="--n:${i};--x:${(i * 37) % 100}%;--delay:-${(i * 1.7) % 11}s;--size:${[18, 27, 37, 24, 48, 31][i % 6]}px;--depth:${[.55, .8, 1, .68, 1.18, .9][i % 6]};--drift:${[28, -45, 76, -20, 105, 48][i % 6]}px"></i>`).join('')}
        </div>
      </div>

      <img class="city-hero-floral" src="${asset('bougainvillea-jasmine-corner')}" alt="" aria-hidden="true">
      <img class="city-birds" src="${asset('parakeet-pair')}" alt="" aria-hidden="true">

      <div class="city-hero-copy">
        <span class="city-kicker">${escapeText(wedding.greeting)}</span>
        <p class="city-hero-sub">સ્નેહભર્યું લગ્ન આમંત્રણ</p>
        <h1 id="city-title">${first}<span>અને</span>${second}</h1>
        <p class="city-date">${escapeText(wedding.date)}</p>
      </div>

      <div class="city-scroll-hint" aria-hidden="true">
        <span>આગળ જુઓ</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>
      </div>
    </section>

    <!-- Garden Transition Section -->
    <section class="city-garden" aria-label="કિલ્લા નીચેનો ફૂલોથી ભરેલો બગીચો">
      <span class="city-garden-caption">ઉજવણીના બગીચામાં આપનું સ્વાગત છે</span>
    </section>

    <!-- Royal Saffron Ceremony & Details -->
    <div class="city-details">
      <!-- Ceremony & Muhurat Announcement -->
      <section class="city-ceremony" aria-labelledby="city-ceremony-title">
        <div class="city-ceremony-inner">
          <p class="city-ceremony-prayer">${escapeText(wedding.greeting)}</p>
          <img class="city-ceremony-ganesh" src="${asset('ganesh-ornament')}" alt="ગણેશજીની મુદ્રા" loading="lazy">
          <p class="city-ceremony-family">${wedding.families.map(escapeText).join(' · ')}</p>
          <h2 id="city-ceremony-title">સ્નેહભર્યું આમંત્રણ</h2>
          <p class="city-ceremony-message">${escapeText(wedding.invitation)}</p>
          <p class="city-ceremony-names">${first}<span>અને</span>${second}</p>
          <p class="city-ceremony-date">${escapeText(wedding.date)}</p>

          <!-- Live Muhurat Countdown Timer -->
          <div class="city-countdown-card" aria-label="લગ્ન મુહૂર્ત સુધીનો સમય">
            <p class="city-countdown-title">મંગલ મુહૂર્ત સુધી</p>
            <div class="city-countdown-grid" id="city-countdown-timer">
              <div class="city-countdown-unit">
                <span class="city-countdown-val" id="cd-days">૦૦</span>
                <span class="city-countdown-lbl">દિવસો</span>
              </div>
              <span class="city-countdown-sep">:</span>
              <div class="city-countdown-unit">
                <span class="city-countdown-val" id="cd-hours">૦૦</span>
                <span class="city-countdown-lbl">કલાક</span>
              </div>
              <span class="city-countdown-sep">:</span>
              <div class="city-countdown-unit">
                <span class="city-countdown-val" id="cd-mins">૦૦</span>
                <span class="city-countdown-lbl">મિનિટ</span>
              </div>
              <span class="city-countdown-sep">:</span>
              <div class="city-countdown-unit">
                <span class="city-countdown-val" id="cd-secs">૦૦</span>
                <span class="city-countdown-lbl">સેકન્ડ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Wedding Events Schedule with Side Filter -->
      <section class="city-events" aria-labelledby="city-events-title">
        <p class="city-kicker">સાથે ઉજવીએ</p>
        <h2 id="city-events-title">ઉજવણીના પ્રસંગો</h2>
        <p class="city-events-intro">દરેક પ્રસંગમાં આપનું હાર્દિક સ્વાગત છે</p>

        <!-- Side Switcher Tabs -->
        <nav class="city-side-filter" aria-label="પ્રસંગોનું ફિલ્ટર">
          <button class="city-filter-btn is-active" data-side="all" type="button">બધા પ્રસંગો</button>
          <button class="city-filter-btn" data-side="groom" type="button">વરપક્ષ</button>
          <button class="city-filter-btn" data-side="bride" type="button">કન્યાપક્ષ</button>
        </nav>

        <div class="city-event-list" id="city-event-container">
          ${wedding.events.map((event, index) => `
            <article class="city-function" data-event-side="${event.side}" id="event-${event.id}">
              <span class="city-function-index">${toGujaratiDigits(index + 1)}</span>
              <img class="city-function-art" src="${asset(eventArt[index] ?? eventArt[0])}" alt="${escapeText(event.title)} પ્રસંગનું ચિત્ર" loading="lazy">
              <div class="city-function-copy">
                <div class="city-function-header">
                  <h3>${escapeText(event.title)}</h3>
                  <span class="city-side-badge">${event.side === 'groom' ? 'વરપક્ષ' : event.side === 'bride' ? 'કન્યાપક્ષ' : 'સહિયારો પ્રસંગ'}</span>
                </div>
                <p class="city-function-desc">${escapeText(event.description)}</p>
                <dl class="city-function-meta">
                  <div><dt>તારીખ</dt><dd>${escapeText(event.date)}</dd></div>
                  <div><dt>સમય</dt><dd>${escapeText(event.time)}</dd></div>
                  <div><dt>સ્થળ</dt><dd>${escapeText(event.venue)}</dd></div>
                </dl>
                <div class="city-dresscode-box">
                  <span class="city-dresscode-icon">✦</span>
                  <span class="city-dresscode-text"><strong>વસ્ત્રો / ડ્રેસ કોડ:</strong> ${escapeText(event.dressCode)}</span>
                </div>
                <div class="city-event-actions">
                  <a class="city-action-link" href="${escapeText(event.mapUrl)}" target="_blank" rel="noopener noreferrer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span>નકશામાં જુઓ</span>
                  </a>
                  <button class="city-action-btn city-cal-btn" type="button" data-event-idx="${index}">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>કેલેન્ડરમાં ઉમેરો</span>
                  </button>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>
    </div>

    <!-- Ocean Voyage & Family Section -->
    <div class="city-ocean">
      <section class="city-voyage" aria-labelledby="city-voyage-title">
        <div class="city-voyage-stage">
          <p class="city-voyage-kicker">આપણી ઉજવણી આગળ વધે છે</p>
          <h2 id="city-voyage-title">સ્નેહની સફર</h2>
          <p class="city-voyage-line">પરિવારના પ્રેમ અને આશીર્વાદ સાથે</p>
          <div class="city-voyage-approach">
            <img class="city-voyage-ship" src="${asset('royal-sailing-ship')}" alt="શાહી સફરનું વહાણ" loading="lazy">
          </div>
          <span class="city-voyage-water" aria-hidden="true"></span>
        </div>
      </section>

      <!-- Family Members Introduction -->
      <section class="city-family" aria-labelledby="city-family-title">
        <div class="city-family-heading">
          <p class="city-family-kicker">પરિવારના પ્રેમભર્યા પરિચય</p>
          <h2 id="city-family-title">અમારા સ્વજનો</h2>
          <p class="city-family-intro">આપનું સ્વાગત કરવા આતુર</p>
        </div>
        <div class="city-family-grid">
          ${familyCards.map((group, index) => `
            <article class="city-family-card${index === familyCards.length - 1 ? ' city-family-card--verse' : ''}">
              <span class="city-family-number">${toGujaratiDigits(index + 1)}</span>
              <h3>${escapeText(group.title)}</h3>
              <div class="city-family-rule" aria-hidden="true">✦</div>
              <div class="city-family-lines">
                ${group.lines.map(line => `<p>${escapeText(line)}</p>`).join('')}
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- Farewell & Personal Message -->
      <section class="city-farewell" aria-labelledby="city-close-title">
        <div class="city-farewell-stage">
          <div class="city-note">
            <p class="city-kicker">આપના માટે</p>
            <h2 id="city-note-title">અમારો સંદેશ</h2>
            <p>${escapeText(wedding.note)}</p>
            <strong>${first} અને ${second}</strong>
          </div>
          <img class="city-farewell-car" src="${cityAsset('farewell-couple-car-front.png')}" alt="મહેલના મુખ્ય દ્વારથી સીધી આગળ આવતી નવદંપતીની વિન્ટેજ કાર" loading="eager" decoding="async" fetchpriority="high">
          <div class="city-closing">
            <p class="city-kicker">${escapeText(wedding.date)}</p>
            <h2 id="city-close-title">મળીએ જલ્દી!</h2>
            <p>${escapeText(wedding.closing)}</p>
            <p class="city-families">${wedding.families.map(escapeText).join(' · ')}</p>

            <!-- Sharing & Direct RSVP in Closing -->
            <div class="city-closing-actions">
              <button class="city-share-btn" id="city-share-invite" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                <span>આમંત્રણ શેર કરો</span>
              </button>
              <button class="city-closing-rsvp-btn" id="city-trigger-rsvp-footer" type="button">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>હાજરીની નોંધ (RSVP)</span>
              </button>
            </div>
            <small>આ નમૂનાની તારીખ, સમય અને સ્થળ કલ્પિત છે.</small>
          </div>
        </div>
      </section>
    </div>

    <!-- Floating One-Tap WhatsApp RSVP Button -->
    <div class="city-rsvp-bar" id="city-rsvp-fab-container">
      <button class="city-rsvp-fab" id="city-rsvp-fab" type="button" aria-haspopup="dialog" aria-expanded="false">
        <span class="city-rsvp-fab-icon">✉</span>
        <span class="city-rsvp-fab-text">RSVP આપો</span>
      </button>
    </div>

    <!-- Royal WhatsApp RSVP Modal Dialog -->
    <div class="city-rsvp-modal" id="city-rsvp-modal" role="dialog" aria-modal="true" aria-labelledby="rsvp-modal-title" hidden>
      <div class="city-rsvp-backdrop" id="city-rsvp-backdrop"></div>
      <div class="city-rsvp-card">
        <button class="city-rsvp-close" id="city-rsvp-close" aria-label="બંધ કરો" type="button">✕</button>
        <div class="city-rsvp-header">
          <span class="city-kicker">॥ શ્રી ગણેશાય નમઃ ॥</span>
          <h3 id="rsvp-modal-title">હાજરીની નોંધ (RSVP)</h3>
          <p>આપની ઉપસ્થિતિ અમારા માટે આનંદ અને આશીર્વાદરૂપ છે.</p>
        </div>

        <form class="city-rsvp-form" id="city-rsvp-form" onsubmit="return false;">
          <div class="city-form-group">
            <label for="rsvp-guest-name">આપનું શુભ નામ</label>
            <input type="text" id="rsvp-guest-name" placeholder="દા.ત. શ્રી અશ્વિનભાઈ પટેલ" required autocomplete="name">
          </div>

          <div class="city-form-group">
            <label>આપની હાજરી</label>
            <div class="city-pill-options" role="radiogroup">
              <label class="city-pill-label is-checked">
                <input type="radio" name="rsvp-status" value="attending" checked>
                <span>હા, ચોક્કસ પધારીશું! 🎉</span>
              </label>
              <label class="city-pill-label">
                <input type="radio" name="rsvp-status" value="declined">
                <span>શુભેચ્છાઓ સાથે (નહીં આવી શકીએ)</span>
              </label>
            </div>
          </div>

          <div class="city-form-group" id="rsvp-headcount-group">
            <label>કેટલા સભ્યો પધારશો?</label>
            <div class="city-headcount-selector">
              <button type="button" class="city-count-btn is-active" data-count="1">૧</button>
              <button type="button" class="city-count-btn" data-count="2">૨</button>
              <button type="button" class="city-count-btn" data-count="3">૩</button>
              <button type="button" class="city-count-btn" data-count="4+">૪+ પરિવાર</button>
            </div>
          </div>

          <div class="city-form-group">
            <label>આપ કોના તરફથી છો?</label>
            <div class="city-pill-options">
              <label class="city-pill-label is-checked">
                <input type="radio" name="rsvp-side" value="વરપક્ષ તરફથી" checked>
                <span>વરપક્ષ તરફથી</span>
              </label>
              <label class="city-pill-label">
                <input type="radio" name="rsvp-side" value="કન્યાપક્ષ તરફથી">
                <span>કન્યાપક્ષ તરફથી</span>
              </label>
            </div>
          </div>

          <button class="city-whatsapp-send-btn" id="city-whatsapp-submit" type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.698.077-1.116-.062-.26-.086-.593-.197-1.025-.386-1.831-.796-3.036-2.658-3.128-2.78-.093-.122-.746-.992-.746-1.892 0-.9.472-1.342.64-1.524.168-.182.366-.228.488-.228.122 0 .244.001.351.006.114.006.267-.043.418.32.155.371.533 1.3.58 1.395.046.096.077.208.016.33-.062.122-.093.198-.184.305-.092.107-.193.24-.276.322-.092.092-.188.192-.081.376.107.184.476.787 1.021 1.272.702.626 1.294.819 1.477.91.184.092.29.077.397-.046.107-.123.457-.533.58-.716.122-.184.244-.153.412-.092.168.061 1.067.503 1.25.595.183.092.305.137.351.214.045.076.045.442-.099.847z"/></svg>
            <span>વોટ્સએપ પર RSVP મોકલો</span>
          </button>
        </form>
      </div>
    </div>
  </main>`;

  // ── 1. Scroll-Driven Dynamics ──────────────────────────────────────
  const hero = app.querySelector<HTMLElement>('.city-hero');
  const voyage = app.querySelector<HTMLElement>('.city-voyage');
  const farewell = app.querySelector<HTMLElement>('.city-farewell');
  const familyCardElements = Array.from(app.querySelectorAll<HTMLElement>('.city-family-card'));
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

  let frame = 0;
  const updateScroll = () => {
    frame = 0;
    if (hero) {
      const progress = Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight - innerHeight)));
      hero.style.setProperty('--intro-progress', String(reducedMotion.matches ? 1 : progress));
      hero.style.setProperty('--intro-pan-y', `${(reducedMotion.matches ? 0 : progress) * -100}svh`);
    }
    if (voyage) {
      const voyageProgress = Math.min(1, Math.max(0, (innerHeight - voyage.getBoundingClientRect().top) / (innerHeight * 1.2)));
      voyage.style.setProperty('--voyage-progress', String(reducedMotion.matches ? 1 : voyageProgress));
    }
    if (farewell) {
      const farewellRect = farewell.getBoundingClientRect();
      const farewellProgress = Math.min(1, Math.max(0, (innerHeight * 0.92 - farewellRect.top) / Math.max(1, innerHeight * 1.55)));
      farewell.style.setProperty('--farewell-progress', String(reducedMotion.matches ? 0.78 : farewellProgress));
      const carProgress = reducedMotion.matches ? 0.78 : farewellProgress;
      farewell.style.setProperty('--farewell-car-y', `calc(-50% + ${carProgress * 26}svh)`);
      farewell.style.setProperty('--farewell-car-scale', String(0.13 + carProgress * 0.99));
      farewell.style.setProperty('--farewell-shadow-y', `${5 + carProgress * 22}px`);
      farewell.style.setProperty('--farewell-shadow-blur', `${4 + carProgress * 16}px`);
      const noteExit = Math.min(1, Math.max(0, (farewellProgress - 0.5) / 0.22));
      farewell.style.setProperty('--farewell-note-opacity', String(reducedMotion.matches ? 0 : 1 - noteExit));
      farewell.style.setProperty('--farewell-note-rise', `${noteExit * -5}rem`);
    }
    familyCardElements.forEach(card => {
      const cardProgress = Math.min(1, Math.max(0, (innerHeight - card.getBoundingClientRect().top) / (innerHeight * 0.44)));
      card.style.setProperty('--family-card-progress', String(reducedMotion.matches ? 1 : cardProgress));
    });
  };

  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll, { passive: true });
  reducedMotion.addEventListener('change', onScroll);
  updateScroll();

  // ── 2. Background Audio Player Toggle ──────────────────────────────
  const audio = app.querySelector<HTMLAudioElement>('#city-bg-audio');
  const musicBtn = app.querySelector<HTMLButtonElement>('#city-music-toggle');
  let isPlaying = false;

  musicBtn?.addEventListener('click', async () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicBtn.classList.remove('is-playing');
      musicBtn.setAttribute('aria-label', 'સંગીત ચાલુ કરો');
    } else {
      try {
        await audio.play();
        isPlaying = true;
        musicBtn.classList.add('is-playing');
        musicBtn.setAttribute('aria-label', 'સંગીત બંધ કરો');
      } catch (err) {
        console.warn('Audio play restricted by browser policy:', err);
      }
    }
  });

  // ── 3. Live Muhurat Countdown Timer ───────────────────────────────
  const cdDays = app.querySelector('#cd-days');
  const cdHours = app.querySelector('#cd-hours');
  const cdMins = app.querySelector('#cd-mins');
  const cdSecs = app.querySelector('#cd-secs');

  const targetDate = new Date(wedding.weddingDateIso).getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, targetDate - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    const formatNum = (n: number) => toGujaratiDigits(String(n).padStart(2, '0'));

    if (cdDays) cdDays.textContent = formatNum(days);
    if (cdHours) cdHours.textContent = formatNum(hours);
    if (cdMins) cdMins.textContent = formatNum(mins);
    if (cdSecs) cdSecs.textContent = formatNum(secs);
  }

  updateCountdown();
  const countdownInterval = setInterval(updateCountdown, 1000);

  // ── 4. Family & Event Filter Switcher ──────────────────────────────
  const filterBtns = Array.from(app.querySelectorAll<HTMLButtonElement>('.city-filter-btn'));
  const eventCards = Array.from(app.querySelectorAll<HTMLElement>('.city-function'));

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const side = btn.dataset.side;
      eventCards.forEach(card => {
        const eventSide = card.dataset.eventSide;
        if (side === 'all' || eventSide === 'both' || eventSide === side) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ── 5. Add to Calendar Buttons ─────────────────────────────────────
  const calBtns = Array.from(app.querySelectorAll<HTMLButtonElement>('.city-cal-btn'));
  calBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.eventIdx);
      const ev = wedding.events[idx];
      if (ev) {
        triggerIcsDownload(ev.title, ev.description, ev.venue, ev.calendarStart, ev.calendarEnd);
      }
    });
  });

  // ── 6. WhatsApp RSVP Modal & Submission ────────────────────────────
  const rsvpModal = app.querySelector<HTMLElement>('#city-rsvp-modal');
  const rsvpFab = app.querySelector<HTMLButtonElement>('#city-rsvp-fab');
  const rsvpFooterTrigger = app.querySelector<HTMLButtonElement>('#city-trigger-rsvp-footer');
  const rsvpClose = app.querySelector<HTMLButtonElement>('#city-rsvp-close');
  const rsvpBackdrop = app.querySelector<HTMLElement>('#city-rsvp-backdrop');

  const openRsvp = () => {
    if (!rsvpModal) return;
    rsvpModal.hidden = false;
    rsvpModal.classList.add('is-open');
    rsvpFab?.setAttribute('aria-expanded', 'true');
    (app.querySelector('#rsvp-guest-name') as HTMLInputElement)?.focus();
  };

  const closeRsvp = () => {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('is-open');
    setTimeout(() => {
      rsvpModal.hidden = true;
      rsvpFab?.setAttribute('aria-expanded', 'false');
    }, 250);
  };

  rsvpFab?.addEventListener('click', openRsvp);
  rsvpFooterTrigger?.addEventListener('click', openRsvp);
  rsvpClose?.addEventListener('click', closeRsvp);
  rsvpBackdrop?.addEventListener('click', closeRsvp);

  // Pill option radio style updates
  const pillOptions = Array.from(app.querySelectorAll<HTMLInputElement>('.city-pill-options input[type="radio"]'));
  pillOptions.forEach(input => {
    input.addEventListener('change', () => {
      const name = input.name;
      app.querySelectorAll(`.city-pill-options input[name="${name}"]`).forEach(sibling => {
        sibling.closest('.city-pill-label')?.classList.toggle('is-checked', (sibling as HTMLInputElement).checked);
      });
      // Toggle headcount visibility if declining
      if (name === 'rsvp-status') {
        const countGroup = app.querySelector<HTMLElement>('#rsvp-headcount-group');
        if (countGroup) countGroup.style.display = input.value === 'declined' ? 'none' : 'block';
      }
    });
  });

  // Headcount selection
  let selectedCount = '૧';
  const countBtns = Array.from(app.querySelectorAll<HTMLButtonElement>('.city-count-btn'));
  countBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      countBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      selectedCount = btn.dataset.count ?? '૧';
    });
  });

  // Submit RSVP to WhatsApp
  const submitBtn = app.querySelector<HTMLButtonElement>('#city-whatsapp-submit');
  submitBtn?.addEventListener('click', () => {
    const nameInput = app.querySelector<HTMLInputElement>('#rsvp-guest-name');
    const guestName = (nameInput?.value ?? '').trim();
    if (!guestName) {
      nameInput?.focus();
      nameInput?.reportValidity();
      return;
    }

    const statusInput = app.querySelector<HTMLInputElement>('input[name="rsvp-status"]:checked');
    const sideInput = app.querySelector<HTMLInputElement>('input[name="rsvp-side"]:checked');
    const isAttending = statusInput?.value === 'attending';
    const guestSide = sideInput?.value ?? 'વરપક્ષ તરફથી';

    let message = '';
    if (isAttending) {
      message = `નમસ્તે! 🙏\nહું *${guestName}* (${guestSide}).\n\nઅમે *${selectedCount} વ્યક્તિ* ${wedding.couple.join(' અને ')}ના લગ્ન પ્રસંગે ચોક્કસ પધારીશું અને નવદંપતીને સ્નેહભર્યા આશીર્વાદ આપીશું. આનંદ સાથે હાજરીની નોંધ લેશોજી. ✨`;
    } else {
      message = `નમસ્તે! 🙏\nહું *${guestName}* (${guestSide}).\n\nઅનિવાર્ય કારણોસર હાજર નહીં રહી શકીએ, પરંતુ અમારા દિલથી આશીર્વાદ અને શુભેચ્છાઓ સદાય ${wedding.couple.join(' અને ')} સાથે છે. લગ્ન જીવન ખૂબ સુખી અને મંગલમય રહે! 🌸`;
    }

    const phoneClean = wedding.rsvpPhone.replace(/[^\d]/g, '');
    const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    closeRsvp();
  });

  // ── 7. Share Invitation Button ─────────────────────────────────────
  const shareBtn = app.querySelector<HTMLButtonElement>('#city-share-invite');
  shareBtn?.addEventListener('click', async () => {
    const shareText = `॥ શ્રી ગણેશાય નમઃ ॥\nસ્નેહભર્યું લગ્ન આમંત્રણ:\n${wedding.couple.join(' અને ')}ના મંગલ લગ્નોત્સવમાં પધારવા ભાવભર્યું નિમંત્રણ. આમંત્રણ જોવા નીચે આપેલી લિંક ખોલો:`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${wedding.couple.join(' અને ')} લગ્ન આમંત્રણ`,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch {
        // User dismissed share dialog, fallback to WhatsApp
      }
    }

    const waShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
    window.open(waShareUrl, '_blank', 'noopener,noreferrer');
  });

  // Cleanup on unmount (if replaced)
  window.addEventListener('beforeunload', () => {
    clearInterval(countdownInterval);
  });
}
