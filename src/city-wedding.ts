export interface CityEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  motif: 'flowers' | 'lanterns' | 'car' | 'arch';
  side: 'both' | 'groom' | 'bride';
  dressCode: string;
  mapUrl: string;
  calendarStart: string;
  calendarEnd: string;
}

export interface CityFamilyMember {
  relation: string;
  name: string;
}

export interface CityFamilyGroup {
  title: string;
  side: 'both' | 'groom' | 'bride';
  members: CityFamilyMember[];
}

export interface CityWedding {
  isDemo: true;
  couple: [string, string];
  date: string;
  weddingDateIso: string;
  rsvpPhone: string;
  greeting: string;
  invitation: string;
  families: string[];
  familyGroups: CityFamilyGroup[];
  events: CityEvent[];
  note: string;
  closing: string;
}

// Fictional sample only. Replace every detail before sharing with guests.
export const cityWedding: CityWedding = {
  isDemo: true,
  couple: ['આરવ', 'કાવ્યા'],
  date: '૧૨ ડિસેમ્બર ૨૦૨૭',
  weddingDateIso: '2027-12-12T11:00:00+05:30',
  rsvpPhone: '+919876543210',
  greeting: '॥ શ્રી ગણેશાય નમઃ ॥',
  invitation: 'અમારા પરિવારોના આશીર્વાદ સાથે જીવનની નવી સફર શરૂ કરીએ છીએ. આ આનંદભરી પળોમાં આપની હાજરી અમારે માટે અમૂલ્ય છે.',
  families: ['આરવનો પરિવાર', 'કાવ્યાનો પરિવાર'],
  familyGroups: [
    {
      title: 'વરપક્ષ',
      side: 'groom',
      members: [
        { relation: 'દાદા - દાદી', name: 'સ્વ. શાંતિલાલ વ્યાસ · શ્રીમતી કાંતાબેન વ્યાસ' },
        { relation: 'પિતા', name: 'શ્રી મહેશભાઈ વ્યાસ' },
        { relation: 'માતા', name: 'શ્રીમતી હેતલબેન વ્યાસ' },
        { relation: 'ભાઈ', name: 'શ્રી નીલ વ્યાસ' },
      ],
    },
    {
      title: 'કન્યાપક્ષ',
      side: 'bride',
      members: [
        { relation: 'દાદા - દાદી', name: 'શ્રી રમેશચંદ્ર શાહ · શ્રીમતી જશોદાબેન શાહ' },
        { relation: 'પિતા', name: 'શ્રી નિરંજનભાઈ શાહ' },
        { relation: 'માતા', name: 'શ્રીમતી ભાવનાબેન શાહ' },
        { relation: 'બહેન', name: 'કુ. રિયા શાહ' },
      ],
    },
    {
      title: 'મોસાળપક્ષ',
      side: 'both',
      members: [
        { relation: 'મામા - મામી', name: 'શ્રી અશોકભાઈ પટેલ · શ્રીમતી કિરણબેન પટેલ' },
        { relation: 'મામા - મામી', name: 'શ્રી કમલેશભાઈ પટેલ · શ્રીમતી નીતાબેન પટેલ' },
      ],
    },
  ],
  events: [
    {
      id: 'mehendi',
      title: 'મહેંદી રસમ',
      date: '૧૦ ડિસેમ્બર ૨૦૨૭',
      time: 'સાંજે ૫:૦૦ વાગ્યે',
      venue: 'નમૂના રોયલ ગાર્ડન, સિંધુભવન રોડ, અમદાવાદ',
      description: 'રંગ, હાસ્ય અને મહેંદીની સુગંધ સાથે લગ્નોત્સવની શુભ શરૂઆત.',
      motif: 'flowers',
      side: 'bride',
      dressCode: 'પીળા અથવા લીલા રંગનો પરંપરાગત પોશાક (Mehendi Greens & Yellows)',
      mapUrl: 'https://maps.google.com/?q=Sindhu+Bhavan+Road+Ahmedabad',
      calendarStart: '20271210T113000Z',
      calendarEnd: '20271210T163000Z',
    },
    {
      id: 'sangeet',
      title: 'સંગીત સંધ્યા',
      date: '૧૧ ડિસેમ્બર ૨૦૨૭',
      time: 'રાત્રે ૮:૦૦ વાગ્યે',
      venue: 'નમૂના બેન્ક્વેટ પ્રાંગણ, બોડકદેવ, અમદાવાદ',
      description: 'સૂર, સંગીત અને રાસ-ગરબાની રમઝટ સાથે અવિસ્મરણીય સાંજ.',
      motif: 'lanterns',
      side: 'both',
      dressCode: 'ઇન્ડો-વેસ્ટર્ન / ગ્લેમરસ એથનિક (Glamorous Festive Ethnic)',
      mapUrl: 'https://maps.google.com/?q=Bodakdev+Ahmedabad',
      calendarStart: '20271211T143000Z',
      calendarEnd: '20271211T193000Z',
    },
    {
      id: 'baraat',
      title: 'જાન પ્રસ્થાન & સ્વાગત',
      date: '૧૨ ડિસેમ્બર ૨૦૨૭',
      time: 'સવારે ૯:૦૦ વાગ્યે',
      venue: 'ધ ગ્રાન્ડ પેલેસ રિસોર્ટ, એસ.જી. હાઇવે, અમદાવાદ',
      description: 'ઢોલ-નગારાના ગગનભેદી નાદ અને શાહી ઠાઠ સાથે વરરાજાનું ભવ્ય સ્વાગત.',
      motif: 'car',
      side: 'groom',
      dressCode: 'શાહી સાફો / કુર્તા-પાયજામા (Royal Heritage & Safa)',
      mapUrl: 'https://maps.google.com/?q=SG+Highway+Ahmedabad',
      calendarStart: '20271212T033000Z',
      calendarEnd: '20271212T053000Z',
    },
    {
      id: 'wedding',
      title: 'હસ્તમેળાપ & લગ્નવિધિ',
      date: '૧૨ ડિસેમ્બર ૨૦૨૭',
      time: 'સવારે ૧૧:૦૦ વાગ્યે (વિજય મુહૂર્ત)',
      venue: 'ધ ગ્રાન્ડ પેલેસ રિસોર્ટ, એસ.જી. હાઇવે, અમદાવાદ',
      description: 'વેદમંત્રોચ્ચાર, સપ્તપદીના પવિત્ર ફેરા અને વડીલોના મંગલ આશીર્વાદ.',
      motif: 'arch',
      side: 'both',
      dressCode: 'શ્રેષ્ઠ શાહી પરંપરાગત વસ્ત્રો (Royal Indian Traditional)',
      mapUrl: 'https://maps.google.com/?q=SG+Highway+Ahmedabad',
      calendarStart: '20271212T053000Z',
      calendarEnd: '20271212T093000Z',
    },
    {
      id: 'reception',
      title: 'સ્નેહમિલન & સ્વાગત સમારંભ',
      date: '૧૨ ડિસેમ્બર ૨૦૨૭',
      time: 'સાંજે ૭:૦૦ વાગ્યે',
      venue: 'ધ ગ્રાન્ડ પેલેસ બોલરૂમ, એસ.જી. હાઇવે, અમદાવાદ',
      description: 'નવદંપતીને સ્નેહભર્યા આશીર્વાદ, શુભેચ્છા ભેટ અને પ્રીતિભોજન.',
      motif: 'lanterns',
      side: 'both',
      dressCode: 'ફોર્મલ સૂટ / ડિઝાઇનર શેરવાની / સાડી (Formal Elegance)',
      mapUrl: 'https://maps.google.com/?q=SG+Highway+Ahmedabad',
      calendarStart: '20271212T133000Z',
      calendarEnd: '20271212T180000Z',
    },
  ],
  note: 'તમારા પ્રેમ અને આશીર્વાદથી આ દિવસ સદાય માટે યાદગાર બનશે. અમારી ખુશીમાં સહભાગી થવા હૃદયપૂર્વકનું આમંત્રણ.',
  closing: 'આપની સ્નેહભરી હાજરીની આતુરતાથી રાહ જોઈશું.',
};
