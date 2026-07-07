/* ============================================================================
 *  ALL CONTENT LIVES HERE.
 *  Edit names / dates / venues / phone numbers below — never touch the
 *  animation or layout code. Everything marked  ⟵ EDIT  is a placeholder.
 * ========================================================================== */

/* The couple ---------------------------------------------------------------- */
export const couple = {
  groom: { first: 'Hemant', full: 'Hemant' },
  bride: { first: 'Sukriti', full: 'Sukriti' },
  monogram: 'H&S',
  hashtag: '#HemantWedsSukriti',
};

/* The wedding moment (countdown + hero target). ISO local time. ------------- */
export const wedding = {
  // 24 Nov 2026, 9:00 PM — the pheras / main ceremony.  ⟵ EDIT
  dateTimeISO: '2026-11-24T21:00:00',
  dateLabel: '24 November 2026',
  dayLabel: 'Tuesday',
  scratchPrompt: 'Scratch below to reveal our wedding date',
};

/* Hosting families — drives the "voice" of each side's invitation ----------- */
export const families = {
  bride: {
    hosts: 'Mr. & Mrs. Malhotra',                                  // ⟵ EDIT
    inviteLine: 'request the pleasure of your company at the wedding of their daughter',
    sign: 'With love, the Malhotra Family',                         // ⟵ EDIT
    contacts: [
      { name: 'Rohan Malhotra', phone: '+919876500001' },          // ⟵ EDIT
      { name: 'Priya Malhotra', phone: '+919876500002' },          // ⟵ EDIT
    ],
  },
  groom: {
    hosts: 'Mr. & Mrs. Khanna',                                     // ⟵ EDIT
    inviteLine: 'request the pleasure of your company at the wedding of their son',
    sign: 'With love, the Khanna Family',                           // ⟵ EDIT
    contacts: [
      { name: 'Vikram Khanna', phone: '+919876500003' },           // ⟵ EDIT
      { name: 'Anjali Khanna', phone: '+919876500004' },           // ⟵ EDIT
    ],
  },
  joint: {
    hosts: 'The Khanna & Malhotra Families',                        // ⟵ EDIT
    inviteLine: 'joyfully invite you to celebrate the wedding of',
    sign: 'With love, the Khanna & Malhotra Families',
    contacts: [
      { name: 'Rohan Malhotra', phone: '+919876500001' },
      { name: 'Vikram Khanna', phone: '+919876500003' },
    ],
  },
};

/* Venues. Default is used for any event that doesn't override it ------------- */
const defaultVenue = {
  name: 'The Grand Pavilion',                                       // ⟵ EDIT
  area: 'Sector 9, Chandigarh',                                     // ⟵ EDIT
  mapUrl: 'https://maps.google.com/?q=Chandigarh',                  // ⟵ EDIT
};
const hotelRadius = {
  name: 'Rooftop, Hotel Radius',
  area: 'SCO 205-209, Airport Rd, TDI City, Sector 117, Mohali, Punjab 160055',
  mapUrl: 'https://maps.google.com/?q=Hotel+Radius+TDI+City+Sector+117+Mohali',
};
const dullatResort = {
  name: 'Dullat Resort',
  area: '',                                                          // ⟵ EDIT add city/area
  mapUrl: 'https://maps.google.com/?q=Dullat+Resort',                // ⟵ EDIT refine map link
};

/* ----------------------------------------------------------------------------
 *  THE FUNCTIONS.  side: 'bride' | 'groom' | 'together'.
 *  `icon` is a key in components/Icons.jsx.  `dressCode.color` is the dot.
 *  `order` controls chronological sort.
 * -------------------------------------------------------------------------- */
export const events = [
  {
    id: 'kirtan', order: 1, side: 'bride',
    name: 'Kirtan', nameDeva: 'कीर्तन',
    dateISO: '2026-11-14', dateLabel: '14–15 Nov', dayLabel: 'Sat–Sun',
    timeLabel: 'Evening', icon: 'kirtan',
    blurb: 'An evening of devotional song and blessings to begin the celebrations.',
    dressCode: { label: 'Soft ivory & pastels', color: '#f4ead8' },
    venue: defaultVenue,
  },
  {
    id: 'mehndi-groom', order: 2, side: 'groom',
    name: 'Mehndi', nameDeva: 'मेहंदी',
    dateISO: '2026-11-21', dateLabel: '21 Nov', dayLabel: 'Saturday',
    timeLabel: 'Morning', icon: 'mehndi',
    blurb: 'Henna, music and laughter as the groom’s side gathers.',
    dressCode: { label: 'Fresh greens', color: '#7faa6a' },
    venue: defaultVenue,
    video: '/videos/mehndi.mp4',
  },
  {
    id: 'mehndi-bride', order: 3, side: 'bride',
    name: 'Mehndi', nameDeva: 'मेहंदी',
    dateISO: '2026-11-21', dateLabel: '21 Nov', dayLabel: 'Saturday',
    timeLabel: 'Afternoon – Evening', icon: 'mehndi',
    blurb: 'Intricate henna and festive cheer for the bride and her guests.',
    dressCode: { label: 'Marigold & green', color: '#d9b441' },
    venue: defaultVenue,
  },
  {
    id: 'sundarkand', order: 4, side: 'groom',
    name: 'Sundarkand Path', nameDeva: 'सुंदरकांड पाठ',
    dateISO: '2026-11-22', dateLabel: '22 Nov', dayLabel: 'Sunday',
    timeLabel: 'Morning', icon: 'path',
    blurb: 'A morning recitation seeking blessings for the union.',
    dressCode: { label: 'Saffron & white', color: '#e08a3c' },
    venue: defaultVenue,
  },
  {
    id: 'shagun-sangeet', order: 5, side: 'together',
    name: 'Shagun & Sangeet', nameDeva: 'शगुन व संगीत',
    dateISO: '2026-11-22', dateLabel: '22 Nov', dayLabel: 'Sunday',
    timeLabel: 'Evening', icon: 'sangeet',
    blurb: 'Both families come together for blessings, dance and music.',
    dressCode: { label: 'Jewel tones', color: '#3b5ca8' },
    venue: hotelRadius,
  },
  {
    id: 'haldi', order: 6, side: 'together',
    name: 'Ubtan & Utsav', nameDeva: 'उत्सव',
    dateISO: '2026-11-23', dateLabel: '23 Nov 2026', dayLabel: 'Monday',
    timeLabel: '9 a.m. onwards', icon: 'haldi',
    blurb: 'Turmeric, sunshine and joy for the bride and groom.',
    dressCode: { label: 'Sunny yellow', color: '#f1c40f' },
    venue: hotelRadius,
    video: '/videos/haldi.mp4',
  },
  {
    id: 'chooda', order: 7, side: 'bride',
    name: 'Chooda Rasam', nameDeva: 'चूड़ा रसम',
    dateISO: '2026-11-24', dateLabel: '24 Nov', dayLabel: 'Tuesday',
    timeLabel: 'Morning', icon: 'chooda',
    blurb: 'The bride adorns her sacred chooda amid family blessings.',
    dressCode: { label: 'Rose & red', color: '#d05f7a' },
    venue: defaultVenue,
  },
  {
    id: 'sehrabandi-baarat', order: 8, side: 'groom',
    name: 'Sehrabandi & Baarat', nameDeva: 'सेहराबंदी व बारात',
    dateISO: '2026-11-24', dateLabel: '24 Nov', dayLabel: 'Tuesday',
    timeLabel: 'Evening', icon: 'baarat',
    blurb: 'The groom is adorned and sets off in a joyous procession.',
    dressCode: { label: 'Cream & gold', color: '#d4af37' },
    venue: defaultVenue,
  },
  {
    id: 'wedding', order: 9, side: 'together',
    name: 'The Wedding', nameDeva: 'विवाह',
    dateISO: '2026-11-24', dateLabel: '24 November 2026', dayLabel: 'Tuesday',
    timeLabel: 'Night', icon: 'wedding',
    blurb: 'The sacred pheras — where two souls become one.',
    dressCode: { label: 'Festive best', color: '#8a1f2b' },
    venue: dullatResort,
  },
];

/* Quick presets for the host control panel ---------------------------------- */
const byIds = (...ids) => ids;
export const presets = {
  all: { label: 'All functions', ids: events.map((e) => e.id) },
  wedding: { label: 'Wedding only', ids: byIds('wedding') },
  'shagun-wedding': { label: 'Shagun + Wedding', ids: byIds('shagun-sangeet', 'wedding') },
  bride: {
    label: 'Bride-side',
    ids: events.filter((e) => e.side === 'bride' || e.side === 'together').map((e) => e.id),
  },
  groom: {
    label: 'Groom-side',
    ids: events.filter((e) => e.side === 'groom' || e.side === 'together').map((e) => e.id),
  },
};

/* Toggleable scenes (Envelope / Hero / Footer are always shown) ------------- */
export const toggleableSections = [
  { id: 'countdown', label: 'Countdown' },
  { id: 'story', label: 'Our Story' },
  { id: 'events', label: 'Functions' },
  { id: 'venue', label: 'Venue & Travel' },
  { id: 'rsvp', label: 'RSVP' },
];

/* Our Story timeline -------------------------------------------------------- */
export const story = {
  title: 'Our Story',
  intro: 'Two families, one celebration — here is how it all began.',
  beats: [
    { year: '2019', heading: 'We Met', text: 'A chance introduction that felt like fate.' },         // ⟵ EDIT
    { year: '2022', heading: 'The Question', text: 'A quiet evening, a ring, and an easy “yes”.' },    // ⟵ EDIT
    { year: '2026', heading: 'Forever', text: 'And now, we’d love for you to be there.' },             // ⟵ EDIT
  ],
};

/* Food preferences offered in the RSVP -------------------------------------- */
export const foodPreferences = ['Vegetarian', 'Jain', 'Gluten-Free', 'No preference'];

/* Global config ------------------------------------------------------------- */
export const config = {
  // WhatsApp number that RSVP submissions are sent to (digits + country code,
  // no + or spaces). Used for both RSVP delivery and the footer share CTA. ⟵ EDIT
  rsvpWhatsApp: '919876500001',
  // Background music. Drop a licensed track at public/assets/bg-music.mp3. ⟵ EDIT
  music: { src: '/assets/bg-music.mp3', title: 'Wedding theme' },
  // RSVP success sound effect (optional). public/assets/yay.mp3
  yaySfx: '/assets/yay.mp3',
  // Enable the iTunes "song for the dance floor" search field in the RSVP.
  enableSongRequest: true,
  // Default site URL used by the control panel to build share links.
  // Leave '' to auto-detect from the browser. ⟵ EDIT once deployed.
  siteUrl: '',
};
