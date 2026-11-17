const pagesAssets = import.meta.env.BASE_URL + 'assets/';
import type { Wedding } from './wedding';
import './royal-entrance.css';

export function mountRoyalEntrance(wedding: Wedding, gu: boolean) {
  const cover = document.querySelector<HTMLElement>('#cover')!;
  cover.className = 'royal-entrance';
  cover.setAttribute('role', 'dialog');
  cover.setAttribute('aria-modal', 'true');
  cover.setAttribute('aria-label', gu ? 'લગ્નનું આમંત્રણ' : 'Your wedding invitation');
  // Keep customer names as live, escaped text, never baked into the artwork.
  const escape = (text: string) => text.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  const nameMarkup = `<span>${escape(wedding.personOne)}</span><i>&</i><span>${escape(wedding.personTwo)}</span>`;
  cover.innerHTML = `<div class="royal-ambient" aria-hidden="true"></div>
    <div class="royal-presentation">
      <p class="royal-overline">${gu ? 'સ્નેહભર્યું આમંત્રણ' : 'A celebration of love'}</p>
      <div class="royal-stage">
        <div class="royal-paper"><div class="royal-paper-rule"></div><span class="royal-paper-symbol" aria-hidden="true">✧</span><p>${gu ? 'પરિવારજનોના આશીર્વાદ સાથે' : 'Together with their families'}</p><div class="royal-paper-names">${nameMarkup}</div><p>${gu ? 'આપને હાર્દિક આમંત્રણ' : 'You are warmly invited'}</p><small>${escape(wedding.dateLabel)}</small></div>
        <div class="royal-door royal-door-left" aria-hidden="true"></div><div class="royal-door royal-door-right" aria-hidden="true"></div>
        <button class="royal-seal" id="open" aria-label="${gu ? 'આમંત્રણ ખોલો' : 'Open the invitation'}"><img src="${pagesAssets}entrance-jasmine-seal.png" width="1024" height="1024" alt="" fetchpriority="high"></button>
      </div>
      <div class="royal-controls"><p>${gu ? 'ખોલવા માટે મહોરને સ્પર્શો' : 'TOUCH THE SEAL TO UNFOLD'}</p><button id="skip" class="royal-skip">${gu ? 'સીધું આમંત્રણ જુઓ ↗' : 'Skip to invitation ↗'}</button></div>
    </div>`;
}
