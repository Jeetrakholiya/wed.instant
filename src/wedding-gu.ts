import type { Wedding } from './wedding';

// Gujarati draft copy for layout review. This is demonstration text, not customer content.
export const weddingGujarati: Wedding = {
  schemaVersion: 1,
  templateId: 'heirloom',
  isDemo: true,
  personOne: 'નામ એક',
  personTwo: 'નામ બે',
  dateLocal: '2027-02-14T18:00:00',
  dateLabel: '૧૪ ફેબ્રુઆરી ૨૦૨૭',
  timezone: 'Asia/Kolkata',
  ceremonyTime: 'સાંજે ૬:૦૦ વાગ્યે',
  venue: 'લગ્નનું સ્થળ ઉમેરો',
  address: 'સરનામું ઉમેરો',
  attire: 'પોશાકની સૂચના ઉમેરો',
  invitationIntro: 'પરિવારજનોના આશીર્વાદ સાથે',
  invitationMessage: 'અમારા લગ્ન પ્રસંગે આપની ઉપસ્થિતિનું હાર્દિક આમંત્રણ',
  interludeText: 'સંગીત, પરિવાર અને મિત્રોની સાથે વરરાજાની આનંદમય જાનનું આગમન.',
  noteSignoff: 'સ્નેહપૂર્વક,',
  closingMessage: 'આનંદના આ પ્રસંગે આપની સાથે ઉજવણી કરવાની આતુરતાથી રાહ જોઈએ છીએ.',
  events: [
    { name: 'મહેંદી', dateLabel: 'તારીખ ઉમેરો', time: 'સમય ઉમેરો', venue: 'સ્થળ ઉમેરો', icon: '✦', cardArt: 'mehendi' },
    { name: 'સંગીત', dateLabel: 'તારીખ ઉમેરો', time: 'સમય ઉમેરો', venue: 'સ્થળ ઉમેરો', icon: '♫', cardArt: 'sangeet' },
    { name: 'લગ્નવિધિ', dateLabel: '૧૪ ફેબ્રુઆરી ૨૦૨૭', time: 'સાંજે ૬:૦૦ વાગ્યે', venue: 'લગ્નનું સ્થળ ઉમેરો', icon: '❋', cardArt: 'wedding' },
    { name: 'સ્વાગત સમારંભ', dateLabel: 'તારીખ ઉમેરો', time: 'સમય ઉમેરો', venue: 'સ્થળ ઉમેરો', icon: '◈', cardArt: 'reception' }
  ],
  note: 'અહીં મહેમાનો માટે તમારો વ્યક્તિગત સંદેશ ઉમેરો. આ દિવસ તમારા માટે કેટલો ખાસ છે અને મહેમાનોની હાજરીનું કેટલું મહત્વ છે તે લખો.',
  blessings: ['પરિવારનું નામ ઉમેરો', 'પરિવારનું નામ ઉમેરો'],
  photos: [
    { src: '/assets/couple-portrait.webp', alt: 'નમૂના માટે બનાવેલ દંપતીનો ફોટો' },
    { src: '/assets/couple-courtyard.webp', alt: 'જાસ્મીનની માળા નીચે ચાલતા નમૂના દંપતી' },
    { src: '/assets/jasmine-hands.webp', alt: 'જાસ્મીનનાં ફૂલો સાથેનો નમૂનાનો ફોટો' },
    { src: '/assets/couple-portrait.webp', alt: 'મહેલના કમાની નીચે નમૂના દંપતી' }
  ],
  musicUrl: '/assets/vow-vine-original-wedding-loop.wav'
};
