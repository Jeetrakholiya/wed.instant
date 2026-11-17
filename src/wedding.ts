export interface Event { name: string; dateLabel: string; time: string; venue: string; mapUrl?: string; icon: string; cardArt?: 'mehendi' | 'sangeet' | 'wedding' | 'reception' }
export interface Photo { src: string; alt: string; srcSet?: string }
export interface Wedding { schemaVersion: 1; templateId: 'heirloom'; isDemo: boolean; locale?: string; personOne: string; personTwo: string; dateLocal: string; dateLabel: string; timezone: string; ceremonyTime: string; venue: string; address: string; mapUrl?: string; attire: string; invitationIntro: string; invitationMessage: string; interludeText: string; noteSignoff: string; closingMessage: string; events: Event[]; note: string; blessings: string[]; photos: Photo[]; musicUrl?: string; ganeshInvocation?: string; familyContacts?: { name: string; phone: string; relation?: string }[]; invitationAddress?: string; portraitPhoto?: Photo }
export let wedding: Wedding = {
  schemaVersion: 1,
  templateId: 'heirloom',
  isDemo: true,
  personOne: 'Name One', personTwo: 'Name Two',
  dateLocal: '2027-02-14T18:00:00', dateLabel: '14 February 2027', timezone: 'Asia/Kolkata', ceremonyTime: '6:00 PM',
  venue: 'Your Wedding Venue', address: 'Add your venue address',
  attire: 'Add your dress code',
  invitationIntro: 'Together with their families',
  invitationMessage: 'request the pleasure of your company at the celebration of their marriage',
  interludeText: 'A joyful procession of music, family, and friends welcomes the groom.',
  noteSignoff: 'With love,',
  closingMessage: "We can't wait to celebrate with you.",
  events: [
    { name: 'Mehendi', dateLabel: 'Add date', time: 'Add time', venue: 'Add venue', icon: '✦', cardArt: 'mehendi' },
    { name: 'Sangeet', dateLabel: 'Add date', time: 'Add time', venue: 'Add venue', icon: '♫', cardArt: 'sangeet' },
    { name: 'Wedding', dateLabel: '14 February 2027', time: '6:00 PM', venue: 'Your Wedding Venue', icon: '❋', cardArt: 'wedding' },
    { name: 'Reception', dateLabel: 'Add date', time: 'Add time', venue: 'Add venue', icon: '◈', cardArt: 'reception' }
  ],
  note: 'Add your own message to your guests here. Share what this day means to you and how much their presence matters.',
  blessings: ['Add family names', 'Add family names'],
  // Original generated demo imagery. Replace these with customer-owned photos in the editor.
  photos: [
    { src: `${import.meta.env.BASE_URL}assets/couple-portrait.webp`, alt: 'Fictional demo couple in a palace courtyard' },
    { src: `${import.meta.env.BASE_URL}assets/couple-courtyard.webp`, alt: 'Fictional demo couple walking beneath jasmine garlands' },
    { src: `${import.meta.env.BASE_URL}assets/jasmine-hands.webp`, alt: 'Demo photograph of hands exchanging jasmine flowers' },
    { src: `${import.meta.env.BASE_URL}assets/couple-portrait.webp`, alt: 'Fictional demo couple beneath a palace arch' }
  ],
  musicUrl: `${import.meta.env.BASE_URL}assets/vow-vine-original-wedding-loop.wav`
};

export function setActiveWedding(value: Wedding) { wedding = value; }
