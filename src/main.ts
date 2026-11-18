import './style.css';
import './premium.css';
import './depth.css';
import './polish.css';
import './entrance.css';
import './corrections.css';
import './restored.css';
import './cover-reveal.css';
import './redesign.css';
import './entrance-overhaul.css';
import './scroll-motion.css';
import './materials.css';
import './typography.css';
import './event-stack.css';
import './countdown-refine.css';
import './baraat.css';
import './letter-stationery.css';
import './gujarati.css';
import { mountGujaratiBackgrounds } from './gujarati-backgrounds';
import { mountRoyalEntrance } from './royal-entrance';
import { wedding as weddingEnglish, setActiveWedding } from './wedding';
import type { Wedding } from './wedding';
import { weddingGujarati } from './wedding-gu';
import { referenceFamilyGroups, referenceTahuko, referenceVenueDetails } from './gujarati-reference-details';
import { gujaratiUi } from './gujarati-ui';
import { bootCustomerRoute } from './customer';
const siteBase = import.meta.env.BASE_URL;
const routePath = location.pathname.startsWith(siteBase)
  ? `/${location.pathname.slice(siteBase.length)}`
  : location.pathname;
let isGujarati = routePath.startsWith('/gujarati');
let wedding = isGujarati ? weddingGujarati : weddingEnglish;
const englishUi = {
  demo: 'DEMO CONTENT — REPLACE BEFORE SHARING', coverKicker: 'AN INVITATION TO CELEBRATE',
  openPrompt: 'TAP THE SEAL TO OPEN', skip: 'Skip opening ↗', invitation: 'THE INVITATION',
  playMusic: '♪ Play music', musicOff: 'Music off', musicOn: '♫ Music on', musicUnavailable: 'Music unavailable',
  weddingOf: 'THE WEDDING OF', scroll: 'SCROLL TO DISCOVER ↓', story: 'A story of us', courtyard: 'Palace courtyard at dusk',
  invited: 'YOU ARE INVITED', finer: 'THE FINER POINTS', details: 'The Details', when: 'WHEN', where: 'WHERE', attire: 'ATTIRE',
  everyMoment: 'JOIN US FOR EVERY MOMENT', celebrations: 'The Celebrations', countdown: 'THE GOLDEN HOUR', countdownTitle: 'A little closer to forever',
  countdownZone: 'Countdown follows', calendar: 'Save this date to calendar ↗', calendarLabel: 'Add wedding date to your calendar',
  addDate: 'Add a valid wedding date and timezone', celebrationNow: 'The celebration is here!', note: 'A note from us',
  blessings: 'With the blessings of', reopen: 'Seal the envelope again ↑', map: 'Open in maps ↗',
  mapMissing: 'Map available when venue is added', eventDay: 'DAYS', eventHours: 'HOURS', eventMinutes: 'MINUTES', eventSeconds: 'SECONDS'
};
let ui: typeof englishUi | typeof gujaratiUi = isGujarati ? gujaratiUi : englishUi;
document.documentElement.lang = isGujarati ? 'gu' : 'en';
const app = document.querySelector<HTMLDivElement>('#app')!;
let coupleConnector = isGujarati ? 'અને' : '&';
type GujaratiScrollScene = { setProgress(value:number):void; cleanup():void };
let gujaratiScrollScene: GujaratiScrollScene | undefined;

let names = `${wedding.personOne} ${coupleConnector} ${wedding.personTwo}`;
let demo = wedding.isDemo ? `<span class="demo">${ui.demo}</span>` : '';
const photoPlaceholder = () => `<div class="photo-placeholder"><span>✧</span><small>${isGujarati ? 'અહીં તમારો ફોટો ઉમેરો' : 'YOUR PHOTO HERE'}</small></div>`;
const photo = (i:number, label:string) => {
  const asset=wedding.photos[i];
  return asset?.src ? `<img data-guest-photo src="${asset.src}" ${asset.srcSet ? `srcset="${asset.srcSet}" sizes="(max-width: 700px) 90vw, 550px"` : ''} alt="${asset.alt || label}" loading="${i <= 3 ? 'eager' : 'lazy'}" decoding="async" ${i === 0 ? 'fetchpriority="high"' : ''}>` : photoPlaceholder();
};
const map = (url?:string) => {
  try {
    if(url && new URL(url).protocol === 'https:') return `<a href="${url}" target="_blank" rel="noopener noreferrer">${ui.map}</a>`;
  } catch {}
  return `<span class="map-disabled">${ui.mapMissing}</span>`;
};
function weddingTimestamp(): number | null {
  const match=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(wedding.dateLocal);
  if(!match)return null;
  const [year,month,day,hour,minute,second]=match.slice(1).map(Number);
  const wall=Date.UTC(year,month-1,day,hour,minute,second||0);
  try {
    const formatter=new Intl.DateTimeFormat('en-US',{timeZone:wedding.timezone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
    let result=wall;
    for(let i=0;i<3;i++){
      const parts=Object.fromEntries(formatter.formatToParts(new Date(result)).map(part=>[part.type,Number(part.value)]));
      const shown=Date.UTC(parts.year,parts.month-1,parts.day,parts.hour,parts.minute,parts.second);
      result+=wall-shown;
    }
    return result;
  } catch { return null; }
}
function home(){ app.innerHTML = `<main class="home"><nav class="home-nav"><a class="brand" href="/">wed.instant</a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="home-menu" aria-label="Open navigation">☰</button><div class="nav-links" id="home-menu"><a href="#experience">The experience</a><a href="#preview">The template</a><a class="nav-cta" href="/invitation/">Open invitation <span>↗</span></a></div></nav><section class="home-hero"><div class="home-copy"><span class="eyebrow">DIGITAL WEDDING INVITATIONS · BEAUTIFULLY UNFOLDED</span><h1>An invitation as <em>unforgettable</em> as your day.</h1><p>A little anticipation. A beautiful reveal. A story your guests can explore, one scroll at a time.</p><div class="home-actions"><a class="button" href="/invitation/">Open the invitation <span>↗</span></a><a class="text-link" href="#experience">Discover the experience <span>↓</span></a></div><div class="home-note"><span class="tiny-star">✦</span> A PERSONALIZABLE WEDDING INVITATION DEMO</div></div><div class="home-art" aria-label="Illustrated invitation envelope"><div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div><div class="art-spark spark-one">✦</div><div class="art-spark spark-two">✧</div><div class="art-spark spark-three">✦</div><div class="art-envelope"><div class="art-flap"></div><div class="art-seal">V<br><small>${coupleConnector}</small><br>V</div></div><span class="art-caption">The beginning of forever</span></div></section><div class="home-ribbon"><span>✦ A MOMENT TO REMEMBER</span><span>✦ MADE TO BE SHARED</span><span>✦ DESIGNED TO DELIGHT</span></div><section class="home-experience" id="experience"><div class="experience-heading"><span class="eyebrow">MORE THAN AN INVITATION</span><h2>A story that <em>unfolds.</em></h2><p>From the first tap to the final detail, every part of the invitation gives your guests another reason to smile.</p></div><div class="experience-grid"><article><span class="step-icon">01 <b>✉</b></span><h3>Tap to open</h3><p>Begin with a sealed envelope and the anticipation of what is inside.</p></article><article><span class="step-icon">02 <b>✧</b></span><h3>Scroll through the story</h3><p>Reveal photographs, a personal note, and the moments that brought you here.</p></article><article><span class="step-icon">03 <b>◈</b></span><h3>Find every detail</h3><p>Keep the celebrations, venue, and countdown together in one graceful place.</p></article></div></section><section class="home-preview" id="preview"><div class="preview-copy"><span class="eyebrow">${ui.invitation} TEMPLATE</span><h2>Classic details.<br><em>A modern reveal.</em></h2><p>Inspired by the warmth of wedding stationery, the template pairs textured paper, antique gold, burgundy, and delicate motion.</p><ul><li>Opening envelope and wax seal</li><li>Portraits, celebrations, and a personal note</li><li>Countdown and venue details</li></ul><a class="button" href="/invitation/">Explore the full template <span>↗</span></a><small>Preview uses clearly marked demo content.</small></div><a class="preview-stage" href="/invitation/" aria-label="Open wedding invitation template preview"><div class="preview-device"><div class="preview-device-top">✦ &nbsp; ${ui.weddingOf} &nbsp; ✦</div><div class="preview-monogram">N <span>${coupleConnector}</span> N</div><div class="preview-divider">❦</div><div class="preview-names">${wedding.personOne}<br><span>${coupleConnector}</span><br>${wedding.personTwo}</div><div class="preview-date">${wedding.dateLabel}</div><div class="preview-paper">TOGETHER WITH THEIR FAMILIES<br><strong>${ui.invited}</strong></div></div><span class="preview-label">TAP TO VIEW ${ui.invitation} ↗</span></a></section><section class="home-final"><span class="eyebrow">A BEAUTIFUL WAY TO BEGIN</span><h2>Let the celebration<br><em>start here.</em></h2><p>Take a look at the invitation, then make the story your own.</p><a class="button" href="/invitation/">Open the invitation <span>↗</span></a></section><footer class="home-footer"><a class="brand" href="/">wed.instant</a><span>A digital wedding invitation demo</span><a href="/invitation/">View template ↗</a></footer></main>`; const toggle=document.querySelector<HTMLButtonElement>(".menu-toggle")!; const menu=document.querySelector<HTMLElement>("#home-menu")!; toggle.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")!=="true";toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");menu.classList.toggle("is-open",open)}); menu.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{menu.classList.remove("is-open");toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Open navigation")})); }
function localizeInvite(){ if(!isGujarati)return; const set=(selector:string,value:string)=>{const el=app.querySelector<HTMLElement>(selector);if(el)el.textContent=value}; const seal=app.querySelector<HTMLButtonElement>('#open');if(seal)seal.setAttribute('aria-label','આમંત્રણ ખોલો');const home=app.querySelector<HTMLAnchorElement>('.invite-top > a');if(home)home.setAttribute('aria-label','મુખ્ય પૃષ્ઠ');set('.cover-paper-kicker',ui.coverKicker);set('.cover-prompt',ui.openPrompt);set('#skip',ui.skip);set('.invite-top > span',ui.invitation);set('#music',ui.playMusic);const music=app.querySelector<HTMLButtonElement>('#music');if(music){music.title=ui.playMusic;music.setAttribute('aria-label',ui.playMusic)}set('.music-unavailable',ui.musicOff);set('.hero-content .eyebrow',ui.weddingOf);set('.scroll-cue',ui.scroll);set('.collage .section-kicker',ui.story);const interlude=app.querySelector('.photo-interlude');if(interlude)interlude.setAttribute('aria-label',ui.courtyard);set('.letter-section > .eyebrow',ui.invited);set('.details .section-kicker',ui.finer);set('.details h2',ui.details);const dts=app.querySelectorAll('.gujarati-detail-page dt');[ui.when,ui.where,ui.attire].forEach((value,i)=>{if(dts[i])dts[i].textContent=value});set('.events > .section-kicker',ui.everyMoment);set('.events > h2',ui.celebrations);set('.countdown > .section-kicker',ui.countdown);set('.countdown > h2',ui.countdownTitle);app.querySelectorAll<HTMLElement>('.count-grid small').forEach((el,i)=>el.textContent=[ui.eventDay,ui.eventHours,ui.eventMinutes,ui.eventSeconds][i]);set('.note-paper h2',ui.note);set('.blessings h2',ui.blessings);set('#reopen',ui.reopen);const closing=app.querySelector<HTMLElement>('.closing');if(closing&&!closing.querySelector('.gu-catalog-return')){const back=document.createElement('a');back.className='gu-catalog-return';back.href='/gujarati/';back.lang='gu';back.textContent='ગુજરાતી નમૂનાઓ જુઓ ↗';closing.append(back)}app.querySelectorAll<HTMLElement>('.map-disabled').forEach(el=>el.textContent=ui.mapMissing)}
function positionGujaratiScroll(section: HTMLElement, wrap: HTMLElement, reduced=false) {
  const box = section.getBoundingClientRect(), vh = window.innerHeight;
  const t = reduced ? 1 : Math.max(0, Math.min(1, (.20*vh-box.top)/Math.max(1,box.height-vh)));
  const smooth=(x:number)=>{const v=Math.max(0,Math.min(1,x));return v*v*(3-2*v)};
  const twoPage=section.classList.contains('gujarati-two-page-scroll');
  const second=twoPage && t>=.52;
  const open = !twoPage ? smooth(t) : t<.30 ? smooth(t/.30) : t<.52 ? 1-smooth((t-.30)/.22) : t<.78 ? smooth((t-.52)/.26) : 1;
  if(twoPage){wrap.classList.toggle('gujarati-second-active',second);const first=wrap.querySelector<HTMLElement>('.letter');const detail=wrap.querySelector<HTMLElement>('.gujarati-detail-page');if(first&&detail){first.setAttribute('aria-hidden',String(second));detail.setAttribute('aria-hidden',String(!second));}}
  const resting = .62*vh-34;
  const reading = Math.max(48,(vh-wrap.offsetHeight)/2);
  const screenTop = resting+(reading-resting)*open;
  const local = Math.max(72,Math.min(box.height-wrap.offsetHeight-20,screenTop-box.top));
  wrap.style.setProperty('--scroll-seat',local+'px');
  return open;
}
function invite(data: Wedding = wedding){ gujaratiScrollScene?.cleanup(); gujaratiScrollScene=undefined; const escapeCustomer=(v:string)=>v.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!)); const safeData=structuredClone(data); const escapeValues=(o:any):any=>Array.isArray(o)?o.map(escapeValues):o&&typeof o==='object'?Object.fromEntries(Object.entries(o).map(([k,v])=>[k,escapeValues(v)])):typeof o==='string'?escapeCustomer(o):o; wedding=escapeValues(safeData); setActiveWedding(data); isGujarati=wedding.locale==='gu' || location.pathname.startsWith('/gujarati'); ui=isGujarati?gujaratiUi:englishUi; coupleConnector=isGujarati?'અને':'&'; names=`${wedding.personOne} ${coupleConnector} ${wedding.personTwo}`; demo=wedding.isDemo ? `<span class="demo">${ui.demo}</span>` : ''; document.documentElement.lang=isGujarati?'gu':'en'; document.title=isGujarati?'ગુજરાતી લગ્ન આમંત્રણ — wed.instant':'Wedding invitation — wed.instant'; app.innerHTML = `<div class="invite" data-template="${wedding.templateId}" data-locale="${isGujarati ? 'gu' : 'en'}"><div class="cover" id="cover"><div class="cover-pattern"></div><div class="cover-paper"><div class="cover-paper-inner"><span class="cover-paper-kicker">${ui.coverKicker}</span><span class="cover-paper-names">${wedding.personOne}<i>${coupleConnector}</i>${wedding.personTwo}</span><span class="cover-paper-date">${wedding.dateLabel}</span></div></div><img class="cover-garland" data-decorative src="/assets/jasmine-festoon.webp" alt="" aria-hidden="true"><div class="peacock-pair" aria-hidden="true"><img class="peacock peacock-left" data-decorative src="/assets/peacock-left.webp" alt=""><img class="peacock peacock-right" data-decorative src="/assets/peacock-right.webp" alt=""></div><div class="cover-flap left"></div><div class="cover-flap right"></div><button class="seal" id="open" aria-label="Open the invitation">${wedding.personOne[0]}<small>${coupleConnector}</small>${wedding.personTwo[0]}</button><div class="cover-prompt">${ui.openPrompt}</div><button class="skip" id="skip">${ui.skip}</button></div><header class="invite-top"><a href="/" aria-label="Home">⌂</a><span>${wedding.isDemo ? 'DEMO INVITATION' : '${ui.invitation}'}</span>${wedding.musicUrl ? '<button id="music" type="button" aria-pressed="false" title="Play music">${ui.playMusic}</button>' : '<span class="music-unavailable" aria-label="${ui.musicUnavailable}">${ui.musicOff}</span>'}</header><main><section class="hero"><div class="hero-halo"></div><img class="hero-festoon ornament" data-decorative src="/assets/jasmine-festoon.webp" alt="" aria-hidden="true"><div class="hero-photo">${photo(0,'Couple portrait')}</div><div class="hero-content">${demo}<p class="eyebrow">${ui.weddingOf}</p><h1>${wedding.personOne}<span>${coupleConnector}</span>${wedding.personTwo}</h1><div class="rule"></div><p class="eyebrow">${wedding.dateLabel}</p><p class="scroll-cue">${ui.scroll}</p></div></section><div class="section-join join-piping" aria-hidden="true"></div><section class="collage"><img class="collage-floral ornament" data-decorative src="/assets/floral-corner.webp" alt="" aria-hidden="true"><div class="section-kicker">${ui.story}</div><div class="photo-stack"><div class="photo-frame frame-one">${photo(1,'Couple photo one')}</div><div class="photo-frame frame-two">${photo(2,'Couple photo two')}</div><div class="photo-frame frame-three">${photo(3,'Couple photo three')}</div></div><h2>${names}</h2><p>${wedding.dateLabel}</p></section><div class="section-join join-piping" aria-hidden="true"></div><section class="photo-interlude" aria-label="${ui.courtyard}"><img src="/assets/palace-lanterns.webp" alt="${ui.courtyard}" loading="lazy" decoding="async"><div class="interlude-shade"></div><p>${wedding.interludeText}</p></section><div class="section-join join-piping" aria-hidden="true"></div><section class="letter-section"><p class="eyebrow">${ui.invited}</p><div class="letter-wrap"><img class="letter-floral ornament" data-decorative src="/assets/floral-corner.webp" alt="" aria-hidden="true"><div class="letter"><div class="letter-inner"><span class="flower" aria-hidden="true"></span><p>${wedding.invitationIntro}</p><h2>${wedding.personOne}<span>${coupleConnector}</span>${wedding.personTwo}</h2><p>${wedding.invitationMessage}</p><div class="letter-date">${wedding.dateLabel}<br>${wedding.ceremonyTime}</div><strong>${wedding.venue}</strong><small>${wedding.address}</small>${map(wedding.mapUrl)}</div></div><div class="letter-envelope"></div></div></section><div class="section-join join-piping" aria-hidden="true"></div><section class="details"><div class="paper-panel"><span class="flower">✧</span><p class="section-kicker">${ui.finer}</p><h2>${ui.details}</h2><dl><dt>${ui.when}</dt><dd>${wedding.dateLabel} · ${wedding.ceremonyTime}</dd><dt>${ui.where}</dt><dd>${wedding.venue}<br>${wedding.address}</dd><dt>${ui.attire}</dt><dd>${wedding.attire}</dd></dl></div></section><div class="section-join join-lace" aria-hidden="true"></div><section class="events"><p class="section-kicker">${ui.everyMoment}</p><h2>${ui.celebrations}</h2><img class="events-festoon ornament" data-decorative src="/assets/jasmine-festoon.webp" alt="" aria-hidden="true"><div class="event-list">${wedding.events.map((e,i)=>`<article class="event-card event-${i}"><img class="event-floral ornament" data-decorative src="/assets/floral-corner.webp" alt="" aria-hidden="true"><span class="event-icon">${e.icon}</span><h3>${e.name}</h3><div class="event-divider">✦</div><p>${e.dateLabel}<br>${e.time}</p><small>${e.venue}</small>${map(e.mapUrl)}</article>`).join('')}</div></section><div class="section-join join-piping" aria-hidden="true"></div><section class="countdown"><p class="section-kicker">${ui.countdown}</p><div class="count-grid" id="countdown"><div><strong>--</strong><small>${ui.eventDay}</small></div><div><strong>--</strong><small>${ui.eventHours}</small></div><div><strong>--</strong><small>${ui.eventMinutes}</small></div><div><strong>--</strong><small>${ui.eventSeconds}</small></div></div><h2>${ui.countdownTitle}</h2><p>${wedding.dateLabel} · ${wedding.timezone}</p></section><div class="section-join join-lace" aria-hidden="true"></div><section class="note"><div class="note-photos"><div>${photo(1,'Couple memory')}</div><div>${photo(2,'Couple memory')}</div></div><div class="note-paper"><img class="note-floral ornament" data-decorative src="/assets/floral-corner.webp" alt="" aria-hidden="true"><span class="flower">❦</span><h2>${ui.note}</h2><p>${wedding.note}</p><span>${wedding.noteSignoff}</span><strong>${names}</strong></div></section><div class="section-join join-piping" aria-hidden="true"></div><section class="blessings"><div class="paper-panel"><img class="blessing-festoon ornament" data-decorative src="/assets/jasmine-festoon.webp" alt="" aria-hidden="true"><span class="flower">✧</span><h2>${ui.blessings}</h2>${wedding.blessings.map(n=>`<p>${n}</p>`).join('')}</div></section><div class="section-join join-lace" aria-hidden="true"></div><section class="closing"><img class="closing-floral ornament" data-decorative src="/assets/floral-corner.webp" alt="" aria-hidden="true"><div class="mandala">✺<span>${wedding.personOne[0]} & ${wedding.personTwo[0]}</span></div><p>${wedding.closingMessage}</p><h2>${names}</h2><button id="reopen">${ui.reopen}</button>${demo}</section></main></div>`;
 if(isGujarati){
   const coverInner=app.querySelector<HTMLElement>('.cover-paper-inner');
   if(coverInner){const ganesh=document.createElement('span');ganesh.className='gujarati-ganesh';ganesh.lang='gu';ganesh.textContent=wedding.ganeshInvocation||'॥ શ્રી ગણેશાય નમઃ ॥';coverInner.prepend(ganesh)}
   const scrollWrap=app.querySelector<HTMLElement>('.letter-wrap');
   const scrollPaper=scrollWrap?.querySelector<HTMLElement>('.letter');
   if(scrollWrap&&scrollPaper){
     scrollWrap.classList.add('gujarati-scroll-wrap');scrollPaper.classList.add('gujarati-scroll-paper');
     scrollWrap.querySelector('.letter-envelope')?.remove();
     scrollWrap.classList.add('gujarati-scroll-pending');
     const loadScrollScene=()=>void import('./gujarati-scroll-3d').then(({mountGujaratiScroll3d})=>{
       if(!scrollWrap.isConnected)return;
       scrollWrap.classList.remove('gujarati-scroll-pending');
       gujaratiScrollScene=mountGujaratiScroll3d(scrollWrap);
       const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
       const section=app.querySelector<HTMLElement>('.letter-section')!;
       const open=positionGujaratiScroll(section,scrollWrap,reduced);
       gujaratiScrollScene.setProgress(open);
       section.style.setProperty('--gu-scroll-clip',`${((1-open)*100).toFixed(2)}%`);
     }).catch(()=>{scrollWrap.classList.remove('gujarati-scroll-pending');scrollWrap.classList.add('gujarati-scroll-fallback')});
     if('IntersectionObserver' in window){const loaderObserver=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){loaderObserver.disconnect();loadScrollScene()}},{rootMargin:'700px 0px'});loaderObserver.observe(scrollWrap)}else loadScrollScene();
   }
   const mainContent=app.querySelector<HTMLElement>('.invite > main');
   const closing=app.querySelector<HTMLElement>('.closing');
   if(mainContent&&closing){
     const panel=document.createElement('section');panel.className='gujarati-family-card';panel.lang='gu';
     const frame=document.createElement('div');frame.className='gujarati-family-frame';
     const address=document.createElement('p');address.className='gujarati-family-address';address.textContent=wedding.invitationAddress||wedding.address;
     const heading=document.createElement('h2');heading.textContent='સ્નેહાધીન';
     const portrait=document.createElement('img');portrait.className='gujarati-couple-portrait';portrait.src=wedding.portraitPhoto?.src||wedding.photos[0]?.src||'';portrait.alt=wedding.portraitPhoto?.alt||'લગ્નનું દંપતી';portrait.loading='lazy';
     const names=document.createElement('p');names.className='gujarati-family-names';names.textContent=`${wedding.personOne} અને ${wedding.personTwo}`;
     const contacts=document.createElement('div');contacts.className='gujarati-family-contacts';
     (wedding.familyContacts||[]).forEach(contact=>{const row=document.createElement('p');const who=document.createElement('strong');who.textContent=contact.name;const role=document.createElement('span');role.textContent=contact.relation||'';const phone=document.createElement('a');phone.textContent=contact.phone;phone.href=`tel:${contact.phone.replace(/[૦-૯]/g,d=>String('૦૧૨૩૪૫૬૭૮૯'.indexOf(d))).replace(/[^+0-9]/g,'')}`;row.append(who,role,phone);contacts.append(row)});
     frame.append(address,heading,portrait,names,contacts);panel.append(frame);mainContent.insertBefore(panel,closing);
     if(wedding.isDemo && wedding.personOne.includes('તરુણ')){
       const canvas=document.createElement('section');canvas.className='gujarati-reference-canvas';canvas.lang='gu';
       const title=document.createElement('h2');title.textContent='રૂડકિયા પરિવારનું મંગલ આમંત્રણ';canvas.append(title);
       const intro=document.createElement('p');intro.className='gujarati-reference-intro';intro.textContent='॥ શ્રી ગણેશાય નમઃ ॥  ·  ॥ શ્રી સુરાપુરાદાદાયે નમઃ ॥';canvas.append(intro);
       const portal=document.createElement('div');portal.className='gujarati-reference-portal';portal.setAttribute('aria-hidden','true');
       const portalArt=document.createElement('img');portalArt.src='/assets/gujarati-family-portal.png';portalArt.alt='';portalArt.loading='lazy';portalArt.decoding='async';portal.append(portalArt);canvas.append(portal);
       const grid=document.createElement('div');grid.className='gujarati-reference-grid';
       const addFolio=(kind:string,titleText:string,lines:string[])=>{const article=document.createElement('article');article.className=`gujarati-reference-card gujarati-folio-${kind}`;article.dataset.seq=String(grid.children.length+1).padStart(2,'0').replace(/\d/g,d=>'૦૧૨૩૪૫૬૭૮૯'[Number(d)]);const h=document.createElement('h3');h.textContent=titleText;article.append(h);for(const line of lines){const p=document.createElement('p');p.textContent=line;article.append(p)}grid.append(article)};
       for(const detail of referenceVenueDetails)addFolio('lineage',detail.title,detail.lines);
       for(const group of referenceFamilyGroups)addFolio('family',group.title,group.names);
       const verse=document.createElement('article');verse.className='gujarati-reference-card gujarati-reference-verse';
       verse.dataset.seq='૧૦';
       const verseTitle=document.createElement('h3');verseTitle.textContent='ટહુકો';verse.append(verseTitle);
       for(const line of referenceTahuko){const p=document.createElement('p');p.textContent=line;verse.append(p)}grid.append(verse);
       canvas.append(grid);mainContent.insertBefore(canvas,closing);
     }
   }
 }
 mountRoyalEntrance(wedding,isGujarati);
 localizeInvite();
 if(isGujarati){
   const closing=app.querySelector<HTMLElement>('.closing')!;
   const content=document.createElement('div');content.className='gu-closing-content';
   const overline=document.createElement('span');overline.className='gu-closing-overline';overline.textContent='॥ શુભ લગ્ન ॥';
   const crest=document.createElement('span');crest.className='gu-closing-crest';crest.setAttribute('aria-hidden','true');crest.textContent='❈';
   const message=document.createElement('p');message.className='gu-closing-message';message.textContent=wedding.closingMessage;
   const couple=document.createElement('h2');couple.textContent=names;
   const date=document.createElement('p');date.className='gu-closing-date';date.textContent=wedding.dateLabel;
   const returnButton=document.createElement('button');returnButton.id='reopen';returnButton.type='button';returnButton.textContent=ui.reopen;
   const catalog=document.createElement('a');catalog.className='gu-catalog-return';catalog.href='/gujarati/';catalog.textContent='ગુજરાતી નમૂનાઓ જુઓ ↗';
   content.append(overline,crest,message,couple,date,returnButton,catalog);
   if(wedding.isDemo){const badge=document.createElement('small');badge.className='gu-closing-demo';badge.textContent=ui.demo;content.append(badge)}
   closing.replaceChildren(content);
 }
 if(isGujarati){
   const section=app.querySelector<HTMLElement>('.letter-section')!;
   const wrap=section.querySelector<HTMLElement>('.gujarati-scroll-wrap')!;
   const detailSection=app.querySelector<HTMLElement>('.details')!;
   const detailPanel=detailSection.querySelector<HTMLElement>('.paper-panel')!;
   detailPanel.classList.add('gujarati-scroll-paper','gujarati-detail-page');
   detailPanel.setAttribute('aria-hidden','true');
   wrap.append(detailPanel);
   section.classList.add('gujarati-two-page-scroll');
   const leaves=document.createElement('div');leaves.className='gujarati-gold-leaves';leaves.setAttribute('aria-hidden','true');
   for(let i=0;i<28;i++){const leaf=document.createElement('span');leaf.style.setProperty('--leaf-x',`${[3,10,88,95,5,92,13,84,2,97,8,90,17,81][i%14]}%`);leaf.style.setProperty('--leaf-y',`${4+i*3.4}%`);leaf.style.setProperty('--leaf-delay',`${-i*1.35}s`);leaf.style.setProperty('--leaf-duration',`${14+i%6*1.5}s`);leaf.style.setProperty('--leaf-size',`${16+i%4*5}px`);leaves.append(leaf)}
   section.insertBefore(leaves,wrap);
   detailSection.remove();
 }

 if(isGujarati && wedding.attire.includes('PDFમાં')){
   const terms=app.querySelectorAll('.gujarati-detail-page dt');
   terms[2]?.nextElementSibling?.remove();terms[2]?.remove();
 }
 if(isGujarati && wedding.address===wedding.venue){
   app.querySelector('.letter-inner > small')?.remove();
   const venueTerm=app.querySelectorAll('.gujarati-detail-page dt')[1];
   if(venueTerm?.nextElementSibling)venueTerm.nextElementSibling.textContent=wedding.venue;
 }
 document.querySelectorAll<HTMLElement>('.event-card').forEach((card,index)=>{
   card.style.setProperty('--event-index',String(index));
   card.style.setProperty('--event-stack-top',`${72 + index * 15}px`);
   card.style.zIndex=String(index+1);
   card.querySelector('.event-floral')?.remove();
   const event=wedding.events[index];
   if(event?.cardArt){
     card.classList.add(`event-art-${event.cardArt}`);
     const artwork=document.createElement(event.cardArt==='sangeet'||event.cardArt==='reception'?'div':'img');
     artwork.className='event-art';
     artwork.setAttribute('aria-hidden','true');
     artwork.setAttribute('data-decorative','');
     if(artwork instanceof HTMLImageElement){
       artwork.src=`/assets/event-card-${event.cardArt}.webp`;
       artwork.alt='';
       artwork.loading='lazy';
       artwork.decoding='async';
     }
     card.prepend(artwork);
   }
   card.querySelector<HTMLElement>('a, .map-disabled')?.classList.add('event-map');
 });
 const baraat=document.querySelector<HTMLElement>('.photo-interlude')!;
 baraat.classList.add('baraat-scene');
 baraat.setAttribute('aria-label',isGujarati?'વરરાજાની આનંદમય જાન':'The Baraat: a joyful wedding procession');
 const courtyard=baraat.querySelector<HTMLImageElement>(':scope > img')!;
 courtyard.className='baraat-backdrop';
 courtyard.src='/assets/baraat-palace.webp';
 courtyard.alt=isGujarati?'લગ્નની જાન માટે સજાવેલું મહેલનું આંગણું':'Warmly lit rose-sandstone palace courtyard prepared for the wedding procession';
 courtyard.setAttribute('data-decorative','');
 const shade=baraat.querySelector<HTMLElement>('.interlude-shade')!;
 const cavalcade=document.createElement('div');
 cavalcade.className='baraat-cavalcade';
 cavalcade.setAttribute('aria-hidden','true');
 const elephant=document.createElement('img');
 elephant.className='baraat-elephant';
 elephant.src='/assets/baraat-elephant-groom.webp';
 elephant.alt='';
 elephant.loading='lazy';
 elephant.decoding='async';
 elephant.setAttribute('data-decorative','');
 cavalcade.append(elephant);
 const marchers=document.createElement('div');
 marchers.className='baraati-line';
 for(let i=1;i<=5;i++){
   const marcher=document.createElement('img');
   marcher.className=`baraati baraati-${i}`;
   marcher.src=`/assets/baraati-${i}.webp`;
   marcher.alt='';
   marcher.loading='lazy';
   marcher.decoding='async';
   marcher.setAttribute('data-decorative','');
   marcher.style.setProperty('--marcher-index',String(i-1));
   marchers.append(marcher);
 }
 cavalcade.append(marchers);
 baraat.insertBefore(cavalcade,shade);
 const messagePanel=document.createElement('div');
 messagePanel.className='baraat-message scroll-copy';
 const baraatKicker=document.createElement('span');
 baraatKicker.className='baraat-kicker';
 baraatKicker.textContent=isGujarati?'વરઘોડો':'THE BARAAT';
 const baraatTitle=document.createElement('h2');
 baraatTitle.className='baraat-title';
 baraatTitle.textContent=isGujarati?'વરરાજાનું આગમન':'The groom’s arrival';
 const baraatCaption=baraat.querySelector<HTMLElement>(':scope > p')!;
 baraatCaption.classList.add('baraat-caption');
 messagePanel.append(baraatKicker,baraatTitle,baraatCaption);
 baraat.insertBefore(messagePanel,cavalcade);
 const petals=document.createElement('div');
 petals.className='baraat-petals';
 petals.setAttribute('aria-hidden','true');
 for(let i=0;i<8;i++){
   const petal=document.createElement('span');
   petal.className='baraat-petal';
   petal.style.setProperty('--petal-x',`${8 + ((i*37)%84)}%`);
   petal.style.setProperty('--petal-drift',`${((i%2===0)?1:-1)*(18+(i%4)*9)}px`);
   petal.style.setProperty('--petal-duration',`${8+(i%3)*2}s`);
   petal.style.setProperty('--petal-delay',`${-i*1.7}s`);
   petals.append(petal);
 }
 baraat.append(petals);
 const countdownSection=document.querySelector<HTMLElement>('.countdown')!;
 const countdownKicker=countdownSection.querySelector<HTMLElement>(':scope > .section-kicker')!;
 const countdownGrid=countdownSection.querySelector<HTMLElement>(':scope > .count-grid')!;
 const countdownHeading=countdownSection.querySelector<HTMLElement>(':scope > h2')!;
 const countdownDate=[...countdownSection.querySelectorAll<HTMLElement>(':scope > p')].find(el=>!el.classList.contains('section-kicker'))!;
 const countdownStage=document.createElement('div');
 countdownStage.className='countdown-stage';
 countdownKicker.textContent=ui.countdown;
 countdownHeading.textContent=ui.countdownTitle;
 countdownDate.className='countdown-date';
 countdownDate.textContent=`${wedding.dateLabel} · ${wedding.ceremonyTime}`;
 const countdownZone=document.createElement('small');
 countdownZone.className='countdown-zone';
 countdownZone.textContent=`${ui.countdownZone} · ${wedding.timezone}`;
 const calendarLink=document.createElement('a');
 calendarLink.className='countdown-calendar';
 calendarLink.textContent=ui.calendar;
 calendarLink.setAttribute('aria-label',`${ui.calendarLabel}: ${wedding.dateLabel}`);
 const calendarStart=weddingTimestamp();
 if(calendarStart!==null){
   const escapeCalendar=(value:string)=>value.replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/([,;])/g,'\\$1');
   const calendarStamp=(date:Date)=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
   const calendarLines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Vow and Vine//Wedding Invitation//EN','CALSCALE:GREGORIAN','BEGIN:VEVENT',`UID:${calendarStart}-wedding@vowandvine.local`,`DTSTAMP:${calendarStamp(new Date())}`,`DTSTART:${calendarStamp(new Date(calendarStart))}`,`SUMMARY:${escapeCalendar(`${names} — wedding celebration`)}`,`DESCRIPTION:${escapeCalendar(`${wedding.invitationMessage} ${wedding.dateLabel} · ${wedding.ceremonyTime} · ${wedding.timezone}`)}`,`LOCATION:${escapeCalendar([wedding.venue,wedding.address].filter(Boolean).join(', '))}`,'END:VEVENT','END:VCALENDAR'];
   calendarLink.href=`data:text/calendar;charset=utf-8,${encodeURIComponent(calendarLines.join('\r\n'))}`;
   calendarLink.download='wedding-invitation.ics';
 }else{
   calendarLink.removeAttribute('href');
   calendarLink.setAttribute('aria-disabled','true');
 }
 const dayDial=countdownGrid.firstElementChild as HTMLElement;
 dayDial.classList.add('countdown-days');
 const dialArtwork=document.createElement('img');
 dialArtwork.className='countdown-dial-art';
 dialArtwork.src='/assets/countdown-zari-orbit.webp';
 dialArtwork.alt='';
 dialArtwork.setAttribute('aria-hidden','true');
 dialArtwork.setAttribute('data-decorative','');
 dialArtwork.loading='lazy';
 dialArtwork.decoding='async';
 dayDial.prepend(dialArtwork);
 countdownStage.append(countdownKicker,countdownHeading,countdownGrid,countdownDate,countdownZone,calendarLink);
 countdownSection.replaceChildren(countdownStage);
 if(isGujarati){
   const main=app.querySelector<HTMLElement>('.invite > main')!;
   mountGujaratiBackgrounds(main);
 }
 document.querySelectorAll<HTMLElement>('.hero-content h1,.collage h2,.letter-inner > p,.letter-inner h2,.details h2,.events > h2,.event-card h3,.countdown h2,.note-paper h2,.blessings h2,.closing h2').forEach(el=>el.classList.add('scroll-copy'));
 const cover=document.querySelector<HTMLElement>('#cover')!;
 const seal=document.querySelector<HTMLButtonElement>('#open')!;
 const heroHeading=document.querySelector<HTMLElement>('.hero h1')!;
 const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 let openingTimer=0;
 const sessionKey=`royal-entrance-v3-${isGujarati?'gu':'en'}`;
 const background=[...document.querySelectorAll<HTMLElement>('.invite > main,.invite > header')];
 const lockBackground=(locked:boolean)=>background.forEach(el=>el.inert=locked);
 const remember=(value:boolean)=>{try{if(value)sessionStorage.setItem(sessionKey,'1');else sessionStorage.removeItem(sessionKey)}catch{}};
 heroHeading.tabIndex=-1;
 const finishOpening=()=>{
   cover.classList.remove('is-opening');
   cover.classList.add('opened');
   document.body.classList.remove('cover-active');
   lockBackground(false);
   remember(true);
   heroHeading.focus({preventScroll:true});
 };
 const open=(instant=false)=>{
   if(cover.classList.contains('opened') || (!instant && cover.classList.contains('is-opening')))return;
   clearTimeout(openingTimer);
   if(instant || reduceMotion){finishOpening();return}
   seal.disabled=true;
   cover.classList.add('is-opening');
   openingTimer=window.setTimeout(finishOpening,3200);
 };
 const skip=document.querySelector<HTMLButtonElement>('#skip')!;
 seal.addEventListener('click',()=>open());
 skip.addEventListener('click',()=>open(true));
 cover.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();open(true)}
   if(event.key==='Tab'){
     const buttons=seal.disabled?[skip]:[seal,skip];
     const index=buttons.indexOf(document.activeElement as HTMLButtonElement);
     event.preventDefault();buttons[(index+(event.shiftKey?-1:1)+buttons.length)%buttons.length].focus();
   }
 });
 document.querySelector('#reopen')?.addEventListener('click',()=>{
   clearTimeout(openingTimer);
   window.scrollTo({top:0,behavior:'instant'});
   cover.classList.remove('is-opening','opened');
   seal.disabled=false;
   document.body.classList.add('cover-active');
   lockBackground(true);remember(false);
   seal.focus({preventScroll:true});
 });
 let hasOpened=false;try{hasOpened=sessionStorage.getItem(sessionKey)==='1'}catch{}
 if(hasOpened)cover.classList.add('opened');
 else{document.body.classList.add('cover-active');lockBackground(true);if(!new URLSearchParams(location.search).has('editorPreview'))seal.focus({preventScroll:true})}
 const target=weddingTimestamp();
 const tick=()=>{
   const el=document.querySelector('#countdown');
   if(!el)return;
   if(target===null){el.innerHTML=`<p class="celebrate">${ui.addDate}</p>`;return}
   const diff=target-Date.now();
   if(diff<=0){el.innerHTML=`<p class="celebrate">${ui.celebrationNow}</p>`;return}
   const parts=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
   const guDigits='૦૧૨૩૪૫૬૭૮૯'; const format=(value:string)=>isGujarati?value.replace(/[0-9]/g,d=>guDigits[Number(d)]):value;
   el.querySelectorAll('strong').forEach((node,i)=>node.textContent=format(String(parts[i]).padStart(2,'0')));
 };
 tick();
 const countdownTimer=setInterval(()=>{if(!document.hidden){tick();if(target!==null && target<=Date.now())clearInterval(countdownTimer)}},1000);
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)tick()});
 document.querySelectorAll<HTMLImageElement>('.invite img[data-guest-photo]').forEach(img=>{
   const fallback=()=>{img.outerHTML=photoPlaceholder()};
   img.addEventListener('error',fallback,{once:true});
   if(img.complete && img.naturalWidth===0)fallback();
 });
 document.querySelectorAll<HTMLImageElement>('.invite img[data-decorative]').forEach(img=>{
   const hide=()=>img.remove();
   img.addEventListener('error',hide,{once:true});
   if(img.complete && img.naturalWidth===0)hide();
 });
 if(wedding.musicUrl){
   const audio=new Audio(wedding.musicUrl);
   audio.loop=true;
   audio.preload='none';
   const button=document.querySelector<HTMLButtonElement>('#music')!;
   const unavailable=()=>{audio.pause();button.replaceWith(Object.assign(document.createElement('span'),{className:'music-unavailable',textContent:ui.musicUnavailable}))};
   audio.addEventListener('error',unavailable,{once:true});
   button.addEventListener('click',async()=>{
     if(!audio.paused){audio.pause();button.textContent=ui.playMusic;button.title=ui.playMusic;button.setAttribute('aria-label',ui.playMusic);button.setAttribute('aria-pressed','false');return}
     try{await audio.play();button.textContent=ui.musicOn;button.title=ui.musicOn;button.setAttribute('aria-label',ui.musicOn);button.setAttribute('aria-pressed','true')}
     catch{unavailable()}
   });
 }
 if(!reduceMotion && 'IntersectionObserver' in window){
   // Keep visibility state reversible: leaving the viewport resets the reveal,
   // so a guest scrolling upward sees the same section settle back naturally.
   const observer=new IntersectionObserver(entries=>entries.forEach(e=>{
     e.target.classList.toggle('in-view',e.isIntersecting);
   }),{threshold:.08,rootMargin:'0px 0px -6% 0px'});
   document.querySelectorAll('.collage,.letter-section,.photo-interlude,.paper-panel,.event-card,.note-paper,.photo-interlude p,.events h2,.closing .mandala,.scroll-copy,.gujarati-family-card,.gujarati-reference-card').forEach(el=>observer.observe(el));
   const hero=document.querySelector<HTMLElement>('.hero')!;
   const collage=document.querySelector<HTMLElement>('.collage')!;
   const letter=document.querySelector<HTMLElement>('.letter-section')!;
   const guScrollPaper=letter.querySelector<HTMLElement>('.gujarati-scroll-paper');
   const interlude=document.querySelector<HTMLElement>('.photo-interlude')!;
   const eventStack=document.querySelector<HTMLElement>('.events')!;
   const eventList=eventStack.querySelector<HTMLElement>('.event-list')!;
   const eventCards=[...eventStack.querySelectorAll<HTMLElement>('.event-card')];
   const familyCanvas=document.querySelector<HTMLElement>('.gujarati-reference-canvas');
   const familyGrid=familyCanvas?.querySelector<HTMLElement>('.gujarati-reference-grid');
   const familyPortal=familyCanvas?.querySelector<HTMLElement>('.gujarati-reference-portal img');
   const familyFolios=[...(familyGrid?.querySelectorAll<HTMLElement>('.gujarati-reference-card')||[])];
   const movingText=[...document.querySelectorAll<HTMLElement>('.scroll-copy')];
   let frame=0;
   const update=()=>{
     frame=0;
     if(document.hidden)return;
     const h=hero.getBoundingClientRect();
     const c=collage.getBoundingClientRect();
     const l=letter.getBoundingClientRect();
     const i=interlude.getBoundingClientRect();
     const hp=Math.max(0,Math.min(1,(-h.top)/(h.height || 1)));
     const cp=Math.max(0,Math.min(1,(innerHeight-c.top)/(innerHeight+c.height)));
     const lp=Math.max(0,Math.min(1,(innerHeight-l.top)/(innerHeight+l.height)));
     const ip=Math.max(0,Math.min(1,(innerHeight-i.top)/(innerHeight+i.height)));
     hero.style.setProperty('--hero-progress',hp.toFixed(3));
     collage.style.setProperty('--collage-progress',cp.toFixed(3));
     collage.style.setProperty('--collage-drift',`${Math.round((cp-.5)*100)}px`);
     collage.style.setProperty('--photo-sway',`${Math.round((cp-.5)*56)}px`);
     collage.style.setProperty('--photo-scale',`${(0.985+Math.sin(cp*Math.PI)*0.035).toFixed(3)}`);
     letter.style.setProperty('--letter-progress',lp.toFixed(3));
     letter.style.setProperty('--card-rise',`${Math.round(lp*140)}px`);
     letter.style.setProperty('--card-tilt',`${((1-lp)*9).toFixed(2)}deg`);
     letter.style.setProperty('--card-scale',`${(0.96+lp*0.04).toFixed(3)}`);
     letter.style.setProperty('--flower-rise',`${Math.round(lp*48)}px`);
     if(guScrollPaper){
       const open=positionGujaratiScroll(letter,guScrollPaper.parentElement!);
       letter.style.setProperty('--gu-scroll-clip',`${((1-open)*100).toFixed(2)}%`);
       gujaratiScrollScene?.setProgress(open);
     }
     const listTop=eventStack.offsetTop+eventList.offsetTop;
     eventCards.forEach((card,index)=>{
       const naturalTop=listTop+card.offsetTop;
       const progress=Math.max(0,Math.min(1,(scrollY+innerHeight*.82-naturalTop)/(innerHeight*.7)));
       card.style.setProperty('--event-scroll-y',`${Math.round((1-progress)*30)}px`);
       card.style.setProperty('--event-scroll-tilt',`${((1-progress)*5).toFixed(2)}deg`);
       card.style.setProperty('--event-scroll-scale',isGujarati?'1':`${(.94+progress*.06).toFixed(3)}`);
       card.style.setProperty('--event-art-drift',`${Math.round((.5-progress)*28+index*2)}px`);
     });
     if(familyGrid){
       const gridTop=familyGrid.getBoundingClientRect().top;
       familyFolios.forEach((folio,index)=>{
         const naturalTop=gridTop+folio.offsetTop;
         const raw=Math.max(0,Math.min(1,(innerHeight*.9-naturalTop)/(innerHeight*.55)));
         const eased=1-(1-raw)**3;
         const side=index%2===0?-1:1;
         folio.style.setProperty('--folio-x',`${Math.round(side*(1-eased)*Math.min(66,innerWidth*.17))}px`);
         folio.style.setProperty('--folio-y',`${Math.round((1-eased)*26)}px`);
         folio.style.setProperty('--folio-rotate',`${(side*(1-eased)*-3.5).toFixed(2)}deg`);
         folio.style.setProperty('--folio-yaw',`${(side*(1-eased)*-4).toFixed(2)}deg`);
         folio.style.setProperty('--folio-opacity',`${(.86+eased*.14).toFixed(2)}`);
       });
     }
     if(familyPortal){const p=familyPortal.getBoundingClientRect();const progress=Math.max(0,Math.min(1,(innerHeight-p.top)/(innerHeight+p.height)));familyPortal.style.setProperty('--portal-shift',`${Math.round((progress-.5)*24)}px`)}
     interlude.style.setProperty('--interlude-progress',ip.toFixed(3));
     interlude.style.setProperty('--interlude-pan',`${Math.round((ip-.5)*90)}px`);
     interlude.style.setProperty('--procession-shift',`${Math.round((ip-.5)*42)}px`);
     interlude.style.setProperty('--elephant-shift',`${Math.round((ip-.5)*44)}px`);
     interlude.querySelectorAll<HTMLElement>('.baraati').forEach((person,index)=>{
       const direction=index%2===0?1:-1;
       person.style.setProperty('--marcher-shift',`${Math.round((ip-.5)*(22+index*4)*direction)}px`);
       person.style.setProperty('--marcher-rise',`${Math.round(Math.sin(ip*Math.PI*2+index*.8)*5)}px`);
     });
     movingText.forEach(el=>{
       const rect=el.getBoundingClientRect();
       if(rect.bottom<0||rect.top>innerHeight){el.style.setProperty('--text-shift','0px');return}
       const amount=Math.max(-14,Math.min(14,(innerHeight*.5-(rect.top+rect.height*.5))*.04));
       el.style.setProperty('--text-shift',`${amount.toFixed(1)}px`);
     });
   };
   const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
   addEventListener('scroll',schedule,{passive:true});
   addEventListener('resize',schedule,{passive:true});
   document.addEventListener('visibilitychange',schedule);
   update();
   document.body.classList.add('motion-ready');
 }
}
function addGujaratiLinks(){
  const links=document.querySelector<HTMLElement>('#home-menu');
  if(links&&!links.querySelector('[data-gujarati-link]')){
    const link=document.createElement('a'); link.href='/gujarati/'; link.textContent='Gujarati invitations'; link.dataset.gujaratiLink=''; links.insertBefore(link,links.querySelector('.nav-cta'));
  }
  const footer=document.querySelector<HTMLElement>('.home-footer');
  if(footer){const link=document.createElement('a');link.href='/gujarati/';link.textContent='Gujarati templates ↗';footer.append(link)}
}
function gujaratiCatalog(){
  document.title='Gujarati wedding invitations — wed.instant';
  document.documentElement.lang='en';
  app.innerHTML=`<main class="gu-catalog" lang="en"><header class="gu-catalog-nav"><a class="brand" href="/">wed.instant</a><a href="/">Home ↗</a></header><section class="gu-catalog-hero"><span>WED.INSTANT · GUJARATI COLLECTION</span><h1>Gujarati wedding<br><em>invitations</em></h1><p>A mobile invitation with a Gujarati guest experience, readable details, and a memorable opening.</p><a class="gu-catalog-button" href="/gujarati/invitation/">View the template <span>↗</span></a></section><section class="gu-template-list"><article class="gu-template-card"><div class="gu-template-preview"><span class="gu-preview-ornament">❋</span><small>લગ્ન પ્રસંગ</small><h2>${weddingGujarati.personOne}<br><i>${coupleConnector}</i><br>${weddingGujarati.personTwo}</h2><span class="gu-preview-date">${weddingGujarati.dateLabel}</span><div class="gu-preview-line"></div><span class="gu-preview-venue">${weddingGujarati.venue}</span></div><div class="gu-template-copy"><span class="gu-template-tag">GUJARATI · DEMO TEMPLATE</span><h2>Heirloom</h2><p>Burgundy fabric, textured paper, and a story that unfolds as guests scroll. The details shown here are demo content.</p><a class="gu-catalog-button" href="/gujarati/invitation/">Open Gujarati invitation <span>↗</span></a></div></article><article class="gu-template-card"><div class="gu-template-preview" style="background:linear-gradient(#4a234366,#4a234322),url('/assets/city/mobile-city-impasto-background.webp') center/cover"><span class="gu-preview-ornament">✦</span><small>કલ્પિત વિગતો સાથેનો નમૂનો</small><h2>આરવ<br><i>અને</i><br>કાવ્યા</h2><span class="gu-preview-date">૧૨ ડિસેમ્બર ૨૦૨૭</span></div><div class="gu-template-copy"><span class="gu-template-tag">GUJARATI · STATIC DEMO</span><h2>ગુલાબી શહેર</h2><p>સાંજના શહેર, ફૂલોથી સજેલા ઝરોખા અને ઉજવણીના પ્રસંગો સાથેનું નવું આમંત્રણ.</p><a class="gu-catalog-button" href="/gujarati/city/">નવું આમંત્રણ જુઓ <span>↗</span></a></div></article></section><footer class="gu-catalog-footer"><a href="/">wed.instant</a><span>Gujarati wedding templates</span></footer></main>`;
}
window.addEventListener('message', event => {
  if (window.parent === window || event.source !== window.parent || event.origin !== location.origin) return;
  const payload = event.data as { type?: string; wedding?: Wedding };
  if (payload?.type === 'customer-invitation-preview' && payload.wedding) invite(payload.wedding);
});
void bootCustomerRoute((data)=>{invite(data)}).then(async handled=>{if(!handled){if(routePath.startsWith('/gujarati/city')) { const { renderCityTemplate } = await import('./city-template'); renderCityTemplate(app); } else if(routePath.startsWith('/gujarati/invitation')) invite(); else if(routePath === '/gujarati' || routePath === '/gujarati/') gujaratiCatalog(); else if(routePath.startsWith('/invitation')) invite(); else { home(); addGujaratiLinks(); }}});











