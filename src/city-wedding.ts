export interface CityEvent {
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  motif: 'flowers' | 'lanterns' | 'car' | 'arch';
}

export interface CityWedding {
  isDemo: true;
  couple: [string, string];
  date: string;
  greeting: string;
  invitation: string;
  families: string[];
  familyGroups: { title: string; members: { relation: string; name: string }[] }[];
  events: CityEvent[];
  note: string;
  closing: string;
}

// Fictional sample only. Replace every detail before sharing with guests.
export const cityWedding: CityWedding = {
  isDemo: true,
  couple: ['આરવ', 'કાવ્યા'],
  date: '૧૨ ડિસેમ્બર ૨૦૨૭',
  greeting: '॥ શ્રી ગણેશાય નમઃ ॥',
  invitation: 'અમારા પરિવારોના આશીર્વાદ સાથે જીવનની નવી સફર શરૂ કરીએ છીએ. આ આનંદભરી પળોમાં આપની હાજરી અમારે માટે અમૂલ્ય છે.',
  families: ['આરવનો પરિવાર', 'કાવ્યાનો પરિવાર'],
  familyGroups: [
    { title: 'વરપક્ષ', members: [
      { relation: 'પિતા', name: 'શ્રી મહેશભાઈ વ્યાસ' },
      { relation: 'માતા', name: 'શ્રીમતી હેતલબેન વ્યાસ' },
      { relation: 'ભાઈ', name: 'શ્રી નીલ વ્યાસ' },
    ] },
    { title: 'કન્યાપક્ષ', members: [
      { relation: 'પિતા', name: 'શ્રી નિરંજનભાઈ શાહ' },
      { relation: 'માતા', name: 'શ્રીમતી ભાવનાબેન શાહ' },
      { relation: 'બહેન', name: 'કુ. રિયા શાહ' },
    ] },
    { title: 'મોસાળપક્ષ', members: [
      { relation: 'મામા', name: 'શ્રી અશોકભાઈ પટેલ' },
      { relation: 'મામી', name: 'શ્રીમતી કિરણબેન પટેલ' },
    ] },
  ],
  events: [
    { title: 'મહેંદી', date: '૧૦ ડિસેમ્બર ૨૦૨૭', time: 'સાંજે ૫:૦૦ વાગ્યે', venue: 'નમૂના બગીચો, અમદાવાદ', description: 'રંગ, હાસ્ય અને મહેંદીની સુગંધ સાથે ઉજવણીની શરૂઆત.', motif: 'flowers' },
    { title: 'સંગીત સંધ્યા', date: '૧૧ ડિસેમ્બર ૨૦૨૭', time: 'રાત્રે ૮:૦૦ વાગ્યે', venue: 'નમૂના પ્રાંગણ, અમદાવાદ', description: 'સૂર અને તાલ સાથે યાદગાર સાંજ.', motif: 'lanterns' },
    { title: 'જાનનું આગમન', date: '૧૨ ડિસેમ્બર ૨૦૨૭', time: 'સવારે ૯:૦૦ વાગ્યે', venue: 'નમૂના લગ્ન સ્થળ, અમદાવાદ', description: 'ઢોલના તાલે અને પરિવારના ઉમંગ સાથે વરરાજાનું સ્વાગત.', motif: 'car' },
    { title: 'લગ્નવિધિ', date: '૧૨ ડિસેમ્બર ૨૦૨૭', time: 'સવારે ૧૧:૦૦ વાગ્યે', venue: 'નમૂના લગ્ન સ્થળ, અમદાવાદ', description: 'પ્રેમ, વચન અને આશીર્વાદની મંગલ ઘડી.', motif: 'arch' },
    { title: 'સ્વાગત સમારંભ', date: '૧૨ ડિસેમ્બર ૨૦૨૭', time: 'સાંજે ૭:૦૦ વાગ્યે', venue: 'નમૂના સભાખંડ, અમદાવાદ', description: 'મળીએ, સાથે ભોજન લઈએ અને આ ખુશી વહેંચીએ.', motif: 'lanterns' },
  ],
  note: 'તમારા પ્રેમ અને આશીર્વાદથી આ દિવસ વધુ સુંદર બનશે. અમારી ખુશીમાં જોડાવા માટે હૃદયથી આમંત્રણ.',
  closing: 'આપની હાજરીની આતુરતાથી રાહ જોઈશું.'
};
