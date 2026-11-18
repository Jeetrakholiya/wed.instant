import type { Wedding } from './wedding';
import { wedding } from './wedding';
import { weddingGujarati } from './wedding-gu';
import './customer.css';

const app = document.querySelector<HTMLDivElement>('#app')!;
const sbUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const idFromPath = () => location.pathname.match(/^\/dashboard\/invitations\/([0-9a-f-]+)\/edit\/?$/i)?.[1];
type Session = { access_token: string; refresh_token: string; expires_at?: number; user: { id: string; email?: string } };
type Draft = { id: string; draft_data: Wedding; status: 'draft'; updated_at: string };
const sessionKey = 'vow-supabase-session';
const localDraftKey = 'vow-demo-invitations';
const getSession = (): Session | null => { try { return JSON.parse(localStorage.getItem(sessionKey) || 'null'); } catch { return null; } };
const setSession = (s: Session | null) => s ? localStorage.setItem(sessionKey, JSON.stringify(s)) : localStorage.removeItem(sessionKey);
const getLocalDrafts = (): Draft[] => { try { return JSON.parse(localStorage.getItem(localDraftKey) || '[]'); } catch { return []; } };
const setLocalDrafts = (drafts: Draft[]) => localStorage.setItem(localDraftKey, JSON.stringify(drafts));
const headers = (token?: string) => ({ apikey: anon || '', Authorization: `Bearer ${token || anon || ''}`, 'Content-Type': 'application/json' });
const esc = (s: string) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

async function auth(path: string, body: unknown) {
  const r = await fetch(`${sbUrl}/auth/v1/${path}`, { method: 'POST', headers: headers(), body: JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok) throw Error(data.msg || data.message || data.error_description || 'Sign in failed');
  return data;
}
async function authorizedFetch(url: string, init: RequestInit = {}) {
  let s = getSession();
  if (!sbUrl || !anon || !s) throw Error('Sign in to continue.');
  const send = (token: string) => fetch(url, { ...init, headers: { ...headers(token), ...(init.headers || {}) } });
  let r = await send(s.access_token);
  if (r.status === 401) {
    const rr = await fetch(`${sbUrl}/auth/v1/token?grant_type=refresh_token`, { method: 'POST', headers: headers(), body: JSON.stringify({ refresh_token: s.refresh_token }) });
    if (!rr.ok) { setSession(null); throw Error('Your sign-in expired. Sign in again to continue.'); }
    s = await rr.json() as Session; setSession(s); r = await send(s.access_token);
  }
  return r;
}
async function api(path: string, init: RequestInit = {}) {
  const r = await authorizedFetch(`${sbUrl}/rest/v1/${path}`, init);
  if (!r.ok) throw Error((await r.text()) || `Request failed (${r.status})`);
  return r.status === 204 ? null : r.json();
}
const privatePhotoCache = new Map<string, string>();
async function privatePhoto(src: string) {
  if (!src.includes('/storage/v1/object/authenticated/customer-photos/')) return src;
  const cached = privatePhotoCache.get(src); if (cached) return cached;
  const r = await authorizedFetch(src);
  if (!r.ok) throw Error('Could not load a private invitation photo. Sign in again or re-upload it.');
  const objectUrl = URL.createObjectURL(await r.blob()); privatePhotoCache.set(src, objectUrl); return objectUrl;
}
function shell(title: string, body: string, gu = false) {
  app.innerHTML = `<main class="customer-shell" lang="${gu ? 'gu' : 'en'}"><header><a href="/" class="brand">wed.instant</a><a href="/dashboard/">${gu ? 'મારો સ્ટુડિયો' : 'My studio'}</a></header><section class="customer-card"><p class="customer-kicker">HEIRLOOM · ${gu ? 'ગુજરાતી આમંત્રણ સ્ટુડિયો' : 'INVITATION STUDIO'}</p><h1>${title}</h1>${body}</section></main>`;
}
function status(text: string, error = false) {
  const el = document.querySelector<HTMLElement>('#customer-message');
  if (el) { el.textContent = text; el.dataset.error = String(error); }
}
function blankWedding(): Wedding { return structuredClone({ ...weddingGujarati, isDemo: false, locale: 'gu' }); }

async function requireAuth(next: () => Promise<void>) {
  if (!sbUrl || !anon) return;
  if (getSession()) { await next(); return; }
  shell('Sign in to your studio', `<p>We’ll email you a one-time sign-in code to access your private invitations.</p><form id="email-form"><label>Email address<input type="email" name="email" required autocomplete="email"></label><button class="customer-button">Send sign-in code</button></form><form id="code-form" hidden><label>Six-digit code<input name="token" inputmode="numeric" required autocomplete="one-time-code"></label><button class="customer-button">Verify and continue</button></form><p id="customer-message" role="status"></p><p class="local-note">Just exploring? <a href="/dashboard/?demo=1">Try the local editor demo ↗</a></p>`);
  let email = '';
  document.querySelector('#email-form')!.addEventListener('submit', async e => {
    e.preventDefault(); email = String(new FormData(e.currentTarget as HTMLFormElement).get('email'));
    try { await auth('otp', { email, create_user: true }); (document.querySelector('#email-form') as HTMLElement).hidden = true; (document.querySelector('#code-form') as HTMLElement).hidden = false; status('Check your inbox for the sign-in code.'); }
    catch (err) { status((err as Error).message, true); }
  });
  document.querySelector('#code-form')!.addEventListener('submit', async e => {
    e.preventDefault();
    try { const token = String(new FormData(e.currentTarget as HTMLFormElement).get('token')); setSession(await auth('verify', { email, token, type: 'email' })); await next(); }
    catch (err) { status((err as Error).message, true); }
  });
}

function createEditorField(label: string, key: string, value: string, type = 'text') {
  return `<label>${label}<input data-key="${key}" type="${type}" value="${esc(value)}"></label>`;
}
function formatGujaratiDateLabel(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) return '';
  const [, year, month, day] = match;
  const months = ['જાન્યુઆરી', 'ફેબ્રુઆરી', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઑગસ્ટ', 'સપ્ટેમ્બર', 'ઑક્ટોબર', 'નવેમ્બર', 'ડિસેમ્બર'];
  const gujaratiDigits = (text: string) => text.replace(/[0-9]/g, digit => '૦૧૨૩૪૫૬૭૮૯'[Number(digit)]);
  return `${gujaratiDigits(day)} ${months[Number(month) - 1]} ${gujaratiDigits(year)}`;
}
function eventMarkup(events: Wedding['events'], gu = false) {
  return events.map((event, i) => `<fieldset class="event-editor"><legend><span>${gu ? 'પ્રસંગ' : 'Event'} ${i + 1}</span><button type="button" class="icon-action" data-remove-event="${i}" aria-label="${gu ? 'પ્રસંગ કાઢો' : 'Remove'} ${esc(event.name)}">${gu ? 'કાઢો' : 'Remove'}</button></legend>
    ${createEditorField(gu ? 'પ્રસંગનું નામ' : 'Event name', `events.${i}.name`, event.name)}<div class="editor-field-row">${createEditorField(gu ? 'તારીખ' : 'Date', `events.${i}.dateLabel`, event.dateLabel)}${createEditorField(gu ? 'સમય' : 'Time', `events.${i}.time`, event.time)}</div>${createEditorField(gu ? 'સ્થળ' : 'Venue', `events.${i}.venue`, event.venue)}${createEditorField(gu ? 'નકશાની લિંક (વૈકલ્પિક)' : 'Map link (optional)', `events.${i}.mapUrl`, event.mapUrl || '', 'url')}</fieldset>`).join('');
}
function blessingsMarkup(blessings: string[], gu = false) {
  return blessings.map((name, i) => `<div class="blessing-row">${createEditorField(`${gu ? 'પરિવાર' : 'Family'} ${i + 1}`, `blessings.${i}`, name)}<button type="button" class="icon-action" data-remove-blessing="${i}" aria-label="${gu ? 'પરિવાર કાઢો' : 'Remove family'} ${i + 1}">${gu ? 'કાઢો' : 'Remove'}</button></div>`).join('');
}
function photoMarkup(photos: Wedding['photos'], gu = false) {
  return photos.map((photo, i) => `<figure><img data-photo-index="${i}" src="${esc(photo.src)}" alt="${esc(photo.alt)}"><button type="button" class="icon-action" data-remove-photo="${i}">${gu ? 'કાઢો' : 'Remove'}</button></figure>`).join('');
}

async function dashboard(localMode: boolean) {
  const rows: Draft[] = localMode ? getLocalDrafts().sort((a, b) => b.updated_at.localeCompare(a.updated_at)) : await api('invitations?select=id,template_id,draft_data,status,updated_at&order=updated_at.desc');
  shell('Your invitation studio', `<div class="studio-intro"><p>${localMode ? 'This demo is saved in this browser only.' : 'Your invitations are saved to your account.'}</p><span class="mode-pill">${localMode ? 'LOCAL DEMO' : 'ACCOUNT'}</span></div><button id="new-draft" class="customer-button">Start a Gujarati invitation <span aria-hidden="true">＋</span></button><p id="customer-message" role="status"></p><div class="draft-list">${rows.map((row: any) => `<article><div class="draft-copy"><strong>${row.draft_data?.locale === 'gu' || !row.draft_data ? 'Gujarati Heirloom invitation' : 'Heirloom invitation'}</strong><small>${row.status || 'draft'} · Updated ${new Date(row.updated_at).toLocaleDateString()}</small></div><a class="customer-button" href="/dashboard/invitations/${row.id}/edit/${localMode ? '?demo=1' : ''}">Edit invitation</a></article>`).join('') || '<p class="empty-state">No drafts yet. Start a Gujarati invitation.</p>'}</div>${localMode ? '<p class="local-note">Demo drafts stay in this browser only. Guest links are not available in demo mode.</p>' : '<button id="sign-out" class="customer-quiet">Sign out</button>'}`);
  document.querySelector('#new-draft')!.addEventListener('click', async () => {
    try {
      const data = blankWedding();
      if (localMode) {
        const id = crypto.randomUUID(); setLocalDrafts([{ id, draft_data: data, status: 'draft', updated_at: new Date().toISOString() }, ...getLocalDrafts()]); location.href = `/dashboard/invitations/${id}/edit/${localMode ? '?demo=1' : ''}`; return;
      }
      const row = await api('invitations?select=id', { method: 'POST', headers: { Prefer: 'return=representation' }, body: JSON.stringify({ owner_id: getSession()!.user.id, template_id: 'heirloom', draft_data: data, status: 'draft' }) });
      location.href = `/dashboard/invitations/${row[0].id}/edit/`;
    } catch (err) { status((err as Error).message, true); }
  });
  document.querySelector('#sign-out')?.addEventListener('click', () => { setSession(null); location.reload(); });
}

async function editor(id: string, localMode: boolean) {
  const localRows = localMode ? getLocalDrafts().filter(row => row.id === id) : [];
  const rows = localMode ? localRows : await api(`invitations?id=eq.${encodeURIComponent(id)}&select=*&limit=1`);
  if (!rows.length) throw Error('Invitation not found in this workspace. Return to the studio and open one of your drafts.');
  let data = structuredClone(rows[0].draft_data) as Wedding;
  const gu = data.locale === 'gu';
  const paid = !localMode && Boolean(rows[0].purchase_verified);
  const t = (english: string, _gujarati: string) => english;
  let dirty = false;
  let previewTimer = 0;
  const invitationPath = gu ? '/gujarati/invitation/' : '/invitation/';
  const previewUrl = localMode ? `${invitationPath}?localPreview=${encodeURIComponent(id)}` : `${invitationPath}?draft=${encodeURIComponent(id)}`;
  shell(t('Make it yours', 'તમારું આમંત્રણ બનાવો'), `<div class="studio-intro"><p>${t('Update the details below. Your invitation preview uses the same design guests will see.', 'નીચે તમારી લગ્ન વિગતો ભરો. બાજુમાં મહેમાનોને દેખાતું આમંત્રણ તરત જુઓ.')}</p><span class="mode-pill">${localMode ? t('LOCAL DEMO', 'લોકલ ડેમો') : t('PRIVATE DRAFT', 'ખાનગી ડ્રાફ્ટ')}</span></div>
    <div class="editor-actions"><button type="button" id="save-draft" class="customer-button">${t('Save draft', 'ડ્રાફ્ટ સાચવો')}</button><a class="customer-quiet" href="${previewUrl}" target="_blank" rel="noopener">${t('Open full preview ↗', 'સંપૂર્ણ ઝલક જુઓ ↗')}</a><a class="customer-quiet preview-jump" href="#live-preview">${t('Live preview ↓', 'જીવંત ઝલક ↓')}</a></div><p id="customer-message" class="save-state" role="status">${localMode ? t('Demo changes stay in this browser until saved.', 'ડ્રાફ્ટ સાચવો દબાવો; આ ડેમો ફક્ત આ બ્રાઉઝરમાં રહેશે.') : t('Your account draft is ready to edit.', 'તમારો ડ્રાફ્ટ સંપાદન માટે તૈયાર છે.')}</p>
    ${gu ? `<section class="publish-panel" aria-label="Share with guests"><h2>Share with guests</h2><p>${localMode ? 'This demo stays in this browser. A real guest link needs an account, a verified purchase, and publishing.' : paid ? 'Publishing makes your invitation details and selected photos visible to anyone with the guest link.' : 'A guest link becomes available after purchase verification. Payments are not connected yet.'}</p>${paid ? '<button type="button" id="publish-invitation" class="customer-button">Create or update guest link</button>' : ''}<div id="guest-link" role="status"></div></section>` : ''}
    <div class="editor-layout"><form id="editor-form" class="editor-form" novalidate>
      <details open><summary><span class="step-number">01</span><span>${t('Couple', 'દંપતી')}</span><small>${t('Names guests will see', 'મહેમાનોને દેખાતા નામ')}</small></summary><div class="section-fields editor-field-row">${createEditorField(t('First name', 'પહેલું નામ'), 'personOne', data.personOne)}${createEditorField(t('Second name', 'બીજું નામ'), 'personTwo', data.personTwo)}</div></details>
      <details open><summary><span class="step-number">02</span><span>${t('Wedding details', 'લગ્નની વિગતો')}</span><small>${t('Date, time, and dress code', 'તારીખ, સમય અને પોશાક')}</small></summary><div class="section-fields">${createEditorField(t('Wedding date and time', 'લગ્નની તારીખ અને સમય'), 'dateLocal', data.dateLocal, 'datetime-local')}<div class="editor-field-row">${createEditorField(t('Date as shown on invitation', 'આમંત્રણમાં દેખાતી તારીખ'), 'dateLabel', data.dateLabel)}${createEditorField(t('Ceremony time', 'વિધિનો સમય'), 'ceremonyTime', data.ceremonyTime)}</div><p class="field-hint date-sync-hint">The countdown uses the date and time above. The printed Gujarati date is filled from it, and the Wedding event date, time, and venue follow these fields. Edit the printed date wording or event fields separately if needed.</p>${createEditorField(t('Timezone', 'સમય ઝોન'), 'timezone', data.timezone)}${createEditorField(t('Attire', 'પોશાક'), 'attire', data.attire)}</div></details>
      <details open><summary><span class="step-number">03</span><span>${t('Events', 'પ્રસંગો')}</span><small>${t('Celebrations in the order they happen', 'યોજાનાર ક્રમમાં પ્રસંગો')}</small></summary><div class="section-fields"><div id="event-list">${eventMarkup(data.events)}</div><button type="button" id="add-event" class="add-row">＋ ${t('Add an event', 'પ્રસંગ ઉમેરો')}</button></div></details>
      <details><summary><span class="step-number">04</span><span>${t('Venues', 'સ્થળ')}</span><small>${t('Address and map', 'સરનામું અને નકશો')}</small></summary><div class="section-fields">${createEditorField(t('Main venue', 'મુખ્ય સ્થળ'), 'venue', data.venue)}${createEditorField(t('Address', 'સરનામું'), 'address', data.address)}${createEditorField(t('Map link', 'નકશાની લિંક'), 'mapUrl', data.mapUrl || '', 'url')}</div></details>
      <details open><summary><span class="step-number">05</span><span>${t('Photos', 'ફોટા')}</span><small>${t('Choose a photo, then crop it', 'ફોટો પસંદ કરી યોગ્ય રીતે ગોઠવો')}</small></summary><div class="section-fields"><label class="upload-drop"><input id="photo-upload" type="file" accept="image/jpeg,image/png,image/webp" multiple><span class="upload-icon">＋</span><strong>${t('Select photos', 'ફોટા પસંદ કરો')}</strong><small>JPG, PNG, WebP · ${t('each photo is cropped before adding', 'દરેક ફોટો ઉમેરતાં પહેલાં ગોઠવો')}</small></label><div class="photo-grid" id="photo-list">${photoMarkup(data.photos)}</div><p class="field-hint">${t('Your invitation has four photo spaces. New photos replace demo images first and appear in the live preview.', 'આમંત્રણમાં ચાર ફોટા માટે જગ્યા છે. નવા ફોટા પહેલાં ડેમો ફોટાની જગ્યાએ દેખાશે.')}</p></div></details>
      <details><summary><span class="step-number">06</span><span>${t('Personal note', 'વ્યક્તિગત સંદેશ')}</span><small>${t('Your message to guests', 'મહેમાનો માટે તમારો સંદેશ')}</small></summary><div class="section-fields">${createTextField(t('Invitation introduction', 'આમંત્રણની શરૂઆત'), 'invitationIntro', data.invitationIntro)}${createTextField(t('Invitation message', 'આમંત્રણનો સંદેશ'), 'invitationMessage', data.invitationMessage)}${createTextField(t('Personal note', 'વ્યક્તિગત નોંધ'), 'note', data.note)}${createTextField(t('Closing message', 'અંતિમ સંદેશ'), 'closingMessage', data.closingMessage)}${createEditorField(t('Sign-off', 'અંતે લખવાનું'), 'noteSignoff', data.noteSignoff)}${createEditorField(t('Baraat introduction', 'જાનનો પરિચય'), 'interludeText', data.interludeText)}</div></details>
      <details><summary><span class="step-number">07</span><span>Gujarati printed-card details</span><small>Ganesh invocation, invitation address, family contacts</small></summary><div class="section-fields">${createEditorField('Ganesh invocation', 'ganeshInvocation', data.ganeshInvocation || '॥ શ્રી ગણેશાય નમઃ ॥')}${createTextField('Invitation address and village', 'invitationAddress', data.invitationAddress || data.address)}<div id="family-contacts">${(data.familyContacts || []).map((contact, i) => `<fieldset class="event-editor"><legend><span>Inviting family ${i + 1}</span></legend>${createEditorField('Name', `familyContacts.${i}.name`, contact.name)}${createEditorField('Relationship (optional)', `familyContacts.${i}.relation`, contact.relation || '')}${createEditorField('Phone number', `familyContacts.${i}.phone`, contact.phone, 'tel')}</fieldset>`).join('')}</div><div id="blessing-list">${blessingsMarkup(data.blessings)}</div><button type="button" id="add-blessing" class="add-row">＋ ${t('Add a family', 'પરિવાર ઉમેરો')}</button></div></details>
      <details><summary><span class="step-number">08</span><span>${t('Music', 'સંગીત')}</span><small>${t('Optional, always guest-controlled', 'વૈકલ્પિક, મહેમાનની પસંદગી મુજબ')}</small></summary><div class="section-fields"><p class="field-hint">${t('Music starts only when a guest chooses to play it. The demo tune is already part of the invitation preview.', 'મહેમાન વગાડવાનું પસંદ કરે ત્યારે જ સંગીત શરૂ થાય છે. ડેમો સંગીત ઝલકમાં છે.')}</p><p class="music-status">${data.musicUrl ? t('Demo music selected', 'ડેમો સંગીત પસંદ છે') : t('No music selected', 'સંગીત પસંદ નથી')}</p></div></details>
    </form><aside class="preview-panel" id="live-preview"><div class="preview-heading"><div><span class="customer-kicker">${t('GUEST VIEW', 'મહેમાનોની ઝલક')}</span><h2>${t('Live invitation', 'જીવંત આમંત્રણ')}</h2></div><span class="preview-live-dot">${t('Updating', 'બદલાય છે')}</span></div><div class="preview-frame-wrap"><iframe id="invitation-preview" title="${t('Live wedding invitation preview', 'ગુજરાતી આમંત્રણની જીવંત ઝલક')}" src="${invitationPath}?editorPreview=1"></iframe></div><p class="field-hint">${t('Changes appear here as you edit. The invitation’s design and motion stay intact.', 'તમે લખો તે પ્રમાણે અહીં આમંત્રણ બદલાશે.')}</p></aside></div>
    <dialog id="crop-dialog" class="crop-dialog"><form method="dialog" class="crop-shell"><header><div><span class="customer-kicker">${t('PHOTO STUDIO', 'ફોટો સ્ટુડિયો')}</span><h2>${t('Frame your photo', 'ફોટો ગોઠવો')}</h2></div><button type="submit" class="icon-action" value="cancel" aria-label="${t('Close photo crop', 'ફોટો ગોઠવવાનું બંધ કરો')}">${t('Close', 'બંધ કરો')}</button></header><p>${t('Drag the photo to reposition it, then adjust the zoom.', 'ફોટોને ખેંચીને ગોઠવો અને ઝૂમ સેટ કરો.')}</p><canvas id="crop-canvas" width="720" height="540" aria-label="${t('Photo crop preview', 'ફોટાની ઝલક')}"></canvas><label class="zoom-control">${t('Zoom', 'ઝૂમ')} <input id="crop-zoom" type="range" min="1" max="2.5" value="1" step="0.01"></label><div class="crop-actions"><button type="submit" class="customer-quiet" value="cancel">${t('Cancel', 'રદ કરો')}</button><button type="button" id="use-crop" class="customer-button">${t('Use this photo', 'આ ફોટો ઉમેરો')}</button></div></form></dialog>`);

  const form = document.querySelector<HTMLFormElement>('#editor-form')!;
  const gather = () => {
    const d = structuredClone(data) as Wedding & Record<string, any>;
    form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('[data-key]').forEach(el => {
      const path = el.dataset.key!.split('.'); let target: any = d;
      for (const part of path.slice(0, -1)) target = target[part];
      target[path[path.length - 1]] = el.value;
    });
    return d;
  };
  const frame = document.querySelector<HTMLIFrameElement>('#invitation-preview')!;
  const updatePreview = async () => {
    if (!frame.contentWindow) return;
    const previewData = gather();
    if (!localMode) previewData.photos = await Promise.all(previewData.photos.map(async photo => ({ ...photo, src: await privatePhoto(photo.src) })));
    frame.contentWindow.postMessage({ type: 'customer-invitation-preview', wedding: previewData }, location.origin);
  };
  const markChanged = (announce = true) => {
    data = gather(); dirty = true;
    if (announce) status(t('Unsaved changes · Save draft when ready', 'ફેરફારો સાચવવાના બાકી છે · તૈયાર થાય ત્યારે ડ્રાફ્ટ સાચવો'));
    window.clearTimeout(previewTimer); previewTimer = window.setTimeout(updatePreview, 320);
  };
  frame.addEventListener('load', updatePreview);
  form.addEventListener('input', event => {
    const input = event.target as HTMLInputElement;
    const syncWeddingEvent = (field: string, value: string) => {
      const index = data.events.findIndex(item => item.cardArt === 'wedding');
      if (index < 0) return;
      const eventField = form.querySelector<HTMLInputElement>(`[data-key="events.${index}.${field}"]`);
      if (eventField) eventField.value = value;
    };
    if (gu && input.dataset.key === 'dateLocal') {
      const displayDate = form.querySelector<HTMLInputElement>('[data-key="dateLabel"]');
      const nextDateLabel = formatGujaratiDateLabel(input.value);
      if (displayDate && nextDateLabel) { displayDate.value = nextDateLabel; syncWeddingEvent('dateLabel', nextDateLabel); }
    }
    if (gu && input.dataset.key === 'dateLabel') syncWeddingEvent('dateLabel', input.value);
    if (gu && input.dataset.key === 'ceremonyTime') syncWeddingEvent('time', input.value);
    if (gu && input.dataset.key === 'venue') syncWeddingEvent('venue', input.value);
    markChanged();
  });
  window.addEventListener('beforeunload', e => { if (dirty) { e.preventDefault(); e.returnValue = ''; } });

  document.querySelector('#add-event')!.addEventListener('click', () => {
    data = gather(); data.events.push({ name: gu ? 'નવો પ્રસંગ' : 'New celebration', dateLabel: gu ? 'તારીખ ઉમેરો' : 'Add date', time: gu ? 'સમય ઉમેરો' : 'Add time', venue: gu ? 'સ્થળ ઉમેરો' : 'Add venue', icon: '✧' });
    dirty = true; document.querySelector('#event-list')!.innerHTML = eventMarkup(data.events); markChanged();
  });
  document.querySelector('#event-list')!.addEventListener('click', e => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-event]'); if (!button) return;
    data = gather(); data.events.splice(Number(button.dataset.removeEvent), 1); document.querySelector('#event-list')!.innerHTML = eventMarkup(data.events); markChanged();
  });
  document.querySelector('#add-blessing')!.addEventListener('click', () => {
    data = gather(); data.blessings.push(gu ? 'પરિવારનું નામ ઉમેરો' : 'Add family name'); document.querySelector('#blessing-list')!.innerHTML = blessingsMarkup(data.blessings); markChanged();
  });
  document.querySelector('#blessing-list')!.addEventListener('click', e => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-blessing]'); if (!button) return;
    data = gather(); data.blessings.splice(Number(button.dataset.removeBlessing), 1); document.querySelector('#blessing-list')!.innerHTML = blessingsMarkup(data.blessings); markChanged();
  });
  document.querySelector('#photo-list')!.addEventListener('click', e => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-remove-photo]'); if (!button) return;
    data = gather(); data.photos.splice(Number(button.dataset.removePhoto), 1); renderPhotoList(); markChanged();
  });
  async function renderPhotoList() {
    const list = document.querySelector<HTMLElement>('#photo-list')!; list.innerHTML = photoMarkup(data.photos);
    list.querySelectorAll<HTMLImageElement>('[data-photo-index]').forEach(async img => {
      const src = img.getAttribute('src') || '';
      try { const resolved = await privatePhoto(src); if (img.isConnected) img.src = resolved; }
      catch { img.alt = 'Photo unavailable. Sign in again or upload it again.'; }
    });
  }
  await renderPhotoList();

  let cropImage: HTMLImageElement | null = null; let cropCurrentFile: File | null = null; let cropQueue: File[] = [];
  let cropCenterX = 0, cropCenterY = 0, cropZoom = 1, pointerStart: { x: number; y: number; cx: number; cy: number } | null = null;
  const cropDialog = document.querySelector<HTMLDialogElement>('#crop-dialog')!;
  const cropCanvas = document.querySelector<HTMLCanvasElement>('#crop-canvas')!;
  const cropContext = cropCanvas.getContext('2d')!;
  function cropRect() {
    const image = cropImage!; const ratio = 4 / 3;
    const baseW = Math.min(image.naturalWidth, image.naturalHeight * ratio);
    const baseH = baseW / ratio; const width = baseW / cropZoom; const height = baseH / cropZoom;
    return { x: Math.max(0, Math.min(image.naturalWidth - width, cropCenterX - width / 2)), y: Math.max(0, Math.min(image.naturalHeight - height, cropCenterY - height / 2)), width, height };
  }
  function paintCrop() {
    if (!cropImage) return; const { x, y, width, height } = cropRect();
    cropContext.clearRect(0, 0, cropCanvas.width, cropCanvas.height); cropContext.drawImage(cropImage, x, y, width, height, 0, 0, cropCanvas.width, cropCanvas.height);
  }
  document.querySelector('#photo-upload')!.addEventListener('change', e => {
    const input = e.currentTarget as HTMLInputElement;
    const files = [...(input.files || [])]; if (!files.length) return;
    const visiblePhotos = data.photos.slice(0, 4);
    const available = visiblePhotos.filter(photo => photo.src.startsWith('/assets/')).length + Math.max(0, 4 - visiblePhotos.length);
    if (!available) { status('All four photo spaces are filled. Remove a photo before adding another.', true); input.value = ''; return; }
    const selected = files.slice(0, available);
    if (files.length > available) status(`Only ${available} photo space${available === 1 ? '' : 's'} available. The remaining files were not added.`, true);
    const file = selected[0]; cropCurrentFile = file; cropQueue = selected.slice(1); const image = new Image(); image.onload = () => { cropImage = image; cropCenterX = image.naturalWidth / 2; cropCenterY = image.naturalHeight / 2; cropZoom = 1; (document.querySelector('#crop-zoom') as HTMLInputElement).value = '1'; paintCrop(); cropDialog.showModal(); };
    image.src = URL.createObjectURL(file);
  });
  document.querySelector('#crop-zoom')!.addEventListener('input', e => { cropZoom = Number((e.currentTarget as HTMLInputElement).value); paintCrop(); });
  cropCanvas.addEventListener('pointerdown', e => { if (!cropImage) return; cropCanvas.setPointerCapture(e.pointerId); pointerStart = { x: e.clientX, y: e.clientY, cx: cropCenterX, cy: cropCenterY }; });
  cropCanvas.addEventListener('pointermove', e => {
    if (!pointerStart || !cropImage) return; const rect = cropRect(); const scale = cropCanvas.clientWidth / rect.width;
    cropCenterX = pointerStart.cx - (e.clientX - pointerStart.x) / scale; cropCenterY = pointerStart.cy - (e.clientY - pointerStart.y) / scale; paintCrop();
  });
  cropCanvas.addEventListener('pointerup', () => { pointerStart = null; });
  document.querySelector('#use-crop')!.addEventListener('click', async () => {
    if (!cropImage) return;
    const { x, y, width, height } = cropRect(); const output = document.createElement('canvas'); output.width = 1200; output.height = 900;
    output.getContext('2d')!.drawImage(cropImage, x, y, width, height, 0, 0, output.width, output.height);
    const blob = await new Promise<Blob>((resolve, reject) => output.toBlob(b => b ? resolve(b) : reject(Error('Could not prepare this photo.')), 'image/jpeg', .84));
    const original = cropCurrentFile; cropCurrentFile = null; if (!original) return;
    try {
      let src: string;
      if (localMode) {
        src = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(Error('Could not read the cropped photo.')); reader.readAsDataURL(blob); });
      } else {
        const session = getSession(); const path = `${session!.user.id}/${id}/${crypto.randomUUID()}-${original.name.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/\.[^.]+$/, '')}.jpg`;
        const r = await authorizedFetch(`${sbUrl}/storage/v1/object/customer-photos/${path}`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg', 'x-upsert': 'false' }, body: blob });
        if (!r.ok) throw Error(await r.text()); src = `${sbUrl}/storage/v1/object/authenticated/customer-photos/${path}`;
      }
      data = gather();
      const demoSlot = data.photos.slice(0, 4).findIndex(photo => photo.src.startsWith('/assets/'));
      const photo = { src, alt: original.name };
      if (demoSlot >= 0) data.photos[demoSlot] = photo;
      else if (data.photos.length < 4) data.photos.push(photo);
      else throw Error('All four photo spaces are filled. Remove a photo before adding another.');
      dirty = true; cropDialog.close(); await renderPhotoList(); markChanged();
      if (cropQueue.length) { const next = cropQueue.shift()!; cropCurrentFile = next; const image = new Image(); image.onload = () => { cropImage = image; cropCenterX = image.naturalWidth / 2; cropCenterY = image.naturalHeight / 2; cropZoom = 1; (document.querySelector('#crop-zoom') as HTMLInputElement).value = '1'; paintCrop(); cropDialog.showModal(); }; image.src = URL.createObjectURL(next); }
      else (document.querySelector('#photo-upload') as HTMLInputElement).value = '';
    } catch (err) { status((err as Error).message, true); }
  });
  document.querySelector('#save-draft')!.addEventListener('click', async () => {
    const button = document.querySelector<HTMLButtonElement>('#save-draft')!; button.disabled = true; button.textContent = t('Saving…', 'સાચવાય છે…');
    try {
      data = gather(); const now = new Date().toISOString();
      if (localMode) {
        const drafts = getLocalDrafts(); const index = drafts.findIndex(row => row.id === id);
        if (index < 0) throw Error('This local demo draft is no longer available.');
        drafts[index] = { ...drafts[index], draft_data: data, updated_at: now }; setLocalDrafts(drafts);
      } else await api(`invitations?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ draft_data: data, updated_at: now }) });
      dirty = false; status(localMode ? t('Saved just now · in this browser', 'હમણાં આ બ્રાઉઝરમાં સાચવાયું') : t('Saved just now · to your account', 'હમણાં તમારા ખાતામાં સાચવાયું')); button.textContent = t('Saved ✓', 'સાચવાયું ✓'); setTimeout(() => { if (button.isConnected) { button.disabled = false; button.textContent = t('Save draft', 'ડ્રાફ્ટ સાચવો'); } }, 1800);
    } catch (err) { status((err as Error).message, true); button.disabled = false; button.textContent = t('Save draft', 'ડ્રાફ્ટ સાચવો'); }
  });
  if (paid && gu) {
    const guestLink = document.querySelector<HTMLElement>('#guest-link')!;
    const publishButton = document.querySelector<HTMLButtonElement>('#publish-invitation')!;
    const existing = await api(`published_invitations?invitation_id=eq.${encodeURIComponent(id)}&select=slug,status&limit=1`) as { slug: string; status: string }[];
    const showLink = (slug: string) => {
      const url = `${location.origin}/gujarati/i/${slug}/`;
      guestLink.innerHTML = `<p>Your guest link is ready. Publish again after making changes.</p><a href="${url}" target="_blank" rel="noopener">${url}</a><button type="button" id="copy-guest-link" class="customer-quiet">Copy guest link</button>`;
      guestLink.querySelector<HTMLButtonElement>('#copy-guest-link')!.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(url); status('Guest link copied.'); }
        catch { status('Could not copy the link. Select and copy the link above.', true); }
      });
    };
    if (existing[0]?.status === 'published') showLink(existing[0].slug);
    publishButton.addEventListener('click', async () => {
      publishButton.disabled = true; publishButton.textContent = 'Publishing…';
      try {
        const current = gather();
        const required = [current.personOne,current.personTwo,current.dateLabel,current.ceremonyTime,current.venue,current.address];
        if (required.some(value => !value?.trim() || /ઉમેરો|^નામ એક$|^નામ બે$|^Add /i.test(value))) throw Error('Complete the names, date, time, venue, and address first.');
        if (!current.dateLocal || !Number.isFinite(new Date(current.dateLocal).getTime())) throw Error('Choose a valid wedding date and time.');
        if (current.events.some(event => [event.name,event.dateLabel,event.time,event.venue].some(value => !value?.trim() || /ઉમેરો|^Add /i.test(value)))) throw Error('Complete each event or remove unfinished events.');
        if (current.blessings.some(name => !name.trim() || /ઉમેરો|^Add /i.test(name))) throw Error('Complete the family names or remove empty entries.');
        const customPhotos = current.photos.filter(photo => !photo.src.startsWith('/assets/'));
        if (!customPhotos.length) throw Error('Add at least one of your own photos before publishing.');
        if (/અહીં મહેમાનો માટે/.test(current.note)) throw Error('Replace the demo personal note before publishing.');
        const now = new Date().toISOString();
        await api(`invitations?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ draft_data: current, updated_at: now }) });
        const publicPhotos = await Promise.all(customPhotos.map(async (photo) => {
          if (photo.src.startsWith(`${sbUrl}/storage/v1/object/public/guest-photos/`)) return photo;
          const source = await privatePhoto(photo.src);
          const response = await fetch(source);
          if (!response.ok) throw Error('Could not read a photo. Upload it again.');
          const path = `${getSession()!.user.id}/${id}/${crypto.randomUUID()}.jpg`;
          const upload = await authorizedFetch(`${sbUrl}/storage/v1/object/guest-photos/${path}`, { method: 'POST', headers: { 'Content-Type': 'image/jpeg' }, body: await response.blob() });
          if (!upload.ok) throw Error('Could not prepare a guest photo. Please try again.');
          return { ...photo, src: `${sbUrl}/storage/v1/object/public/guest-photos/${path}` };
        }));
        const snapshot: Wedding = { ...current, isDemo: false, locale: 'gu', photos: publicPhotos };
        const slug = existing[0]?.slug || crypto.randomUUID().replaceAll('-', '').slice(0, 16);
        const published = await api('published_invitations?on_conflict=invitation_id&select=slug,status', {
          method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
          body: JSON.stringify({ invitation_id: id, owner_id: getSession()!.user.id, slug, snapshot, status: 'published', updated_at: now })
        }) as { slug: string; status: string }[];
        existing[0] = published[0]; data = current; dirty = false; showLink(published[0].slug);
        status('Gujarati invitation published. You can now send the guest link.');
      } catch (err) { status((err as Error).message, true); }
      finally { publishButton.disabled = false; publishButton.textContent = 'Create or update guest link'; }
    });
  }
}
function createTextField(label: string, key: string, value: string) { return `<label>${label}<textarea data-key="${key}">${esc(value)}</textarea></label>`; }

export async function bootCustomerRoute(onPreview: (data: Wedding) => void) {
  const publicSlug = location.pathname.match(/^\/gujarati\/i\/([a-z0-9]{16})\/?$/)?.[1];
  if (publicSlug) {
    try {
      if (!sbUrl || !anon) throw Error('This guest link is not available yet.');
      const response = await fetch(`${sbUrl}/rest/v1/published_invitations?slug=eq.${publicSlug}&status=eq.published&select=snapshot&limit=1`, { headers: { apikey: anon, Authorization: `Bearer ${anon}` } });
      if (!response.ok) throw Error('Could not open this invitation.');
      const rows = await response.json() as { snapshot: Wedding }[];
      if (!rows[0] || rows[0].snapshot.locale !== 'gu') throw Error('This guest link is not available.');
      onPreview(rows[0].snapshot); return true;
    } catch (err) { shell('Invitation unavailable', `<p>${esc((err as Error).message)}</p><a href="/gujarati/">View the Gujarati template ↗</a>`); return true; }
  }
  const invitationRoute = location.pathname.startsWith('/invitation') || location.pathname.startsWith('/gujarati/invitation');
  const localPreviewId = invitationRoute ? new URLSearchParams(location.search).get('localPreview') : null;
  if (localPreviewId) {
    const found = getLocalDrafts().find(row => row.id === localPreviewId);
    if (!found) { shell('Preview unavailable', '<p>This local demo draft is not in this browser.</p><a href="/dashboard/">Return to the studio</a>'); return true; }
    onPreview(found.draft_data); return true;
  }
  const isDashboard = location.pathname.startsWith('/dashboard');
  const draftPreviewId = invitationRoute ? new URLSearchParams(location.search).get('draft') : null;
  if (!isDashboard && !draftPreviewId) return false;
  const localMode = !sbUrl || !anon || new URLSearchParams(location.search).get('demo') === '1';
  if (localMode && draftPreviewId) { shell('Private preview unavailable', '<p>Account previews are not active in local demo mode.</p><a href="/dashboard/">Open the local studio</a>'); return true; }
  try {
    if (localMode) {
      if (draftPreviewId) return true;
      const id = idFromPath(); if (id) await editor(id, true); else await dashboard(true);
      return true;
    }
    await requireAuth(async () => {
      if (draftPreviewId) {
        const rows = await api(`invitations?id=eq.${encodeURIComponent(draftPreviewId)}&select=draft_data,status&limit=1`);
        if (!rows.length) throw Error('This private invitation is not available to this account.');
        const data = rows[0].draft_data as Wedding;
        data.photos = await Promise.all(data.photos.map(async p => ({ ...p, src: await privatePhoto(p.src) })));
        onPreview(data);
      } else {
        const id = idFromPath(); if (id) await editor(id, false); else await dashboard(false);
      }
    });
  } catch (err) { shell('Invitation unavailable', `<p>${esc((err as Error).message)}</p><a href="/dashboard/">Return to the studio</a>`); }
  return true;
}
