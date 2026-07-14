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
  hashtag: '#SukHeverafter',
};

/* The wedding moment (countdown + hero target). ISO local time. ------------- */
export const wedding = {
  // 24 Nov 2026, 9:00 PM — the pheras / main ceremony.  ⟵ EDIT
  dateTimeISO: '2026-11-24T21:00:00',
  dateLabel: '24 November 2026',
  dayLabel: 'Tuesday',
  scratchPrompt: 'Scratch to reveal our wedding date',
};

/* Hosting families — drives the "voice" of each side's invitation ----------- */
export const families = {
  bride: {
    hosts: 'Mr. & Mrs. Malhotra',                                  // ⟵ EDIT
    inviteLine: 'joyfully invite you to celebrate the wedding of their daughter',
    sign: 'With love, the Malhotra Family',                         // ⟵ EDIT
    contacts: [
      { name: 'Manish Malhotra', phone: '+919876500001' },          // ⟵ EDIT
      { name: 'Ashu Malhotra', phone: '+919876500002' },          // ⟵ EDIT
    ],
  },
  groom: {
    hosts: 'Mr. & Mrs. Bahl',                                     // ⟵ EDIT
    inviteLine: 'joyfully invite you to celebrate the wedding of their son',
    sign: 'With love, the Bahl Family',                           // ⟵ EDIT
    contacts: [
      { name: 'Jatinder Bahl', phone: '+919876500003' },           // ⟵ EDIT
      { name: 'Neeru Bahl', phone: '+919876500004' },           // ⟵ EDIT
    ],
  },
  joint: {
    hosts: 'The Bahl & Malhotra Families',                        // ⟵ EDIT
    inviteLine: 'joyfully invite you to celebrate the wedding of',
    sign: 'With love, the Bahl & Malhotra Families',
    contacts: [
      { name: 'Manish Malhotra', phone: '+919876500001' },
      { name: 'Jatinder Bahl', phone: '+919876500003' },
    ],
  },
};

/* Venues --------------------------------------------------------------------- */
const brideHome = {
  name: '3010, Tribune Colony',
  area: 'Sector 29, Chandigarh',
  mapUrl: 'https://maps.app.goo.gl/SQxN8fmCPD2m1V5u6',
};
const groomHome = {
  name: 'Guru Kirpa Niwas',
  area: '32, Gillco Valley Rd, Sector 127, Kharar',
  mapUrl: 'https://maps.app.goo.gl/VVrJ7hTVdEWrSkzs9',
};
const hotelRadius = {
  name: 'Hotel Radius',
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
    name: 'Sai Sandhya', nameDeva: 'साईं संध्या',
    dateISO: '2026-11-15', dateLabel: '15 Nov', dayLabel: 'Sunday',
    timeLabel: 'Evening', icon: 'kirtan',
    blurb: 'An evening of devotional song and blessings to begin the celebrations.',
    dressCode: { label: 'Soft ivory & pastels', color: '#f4ead8' },
    venue: brideHome,
    video: '/videos/Sai Sandhya (Sukriti).mp4',
  },
  {
    id: 'mehndi-groom', order: 2, side: 'groom',
    name: 'Mehndi', nameDeva: 'मेहंदी',
    dateISO: '2026-11-21', dateLabel: '21 Nov', dayLabel: 'Saturday',
    timeLabel: 'Morning', icon: 'mehndi',
    blurb: 'Henna, music and laughter as the groom’s side gathers.',
    dressCode: { label: 'Fresh greens', color: '#7faa6a' },
    venue: groomHome,
    video: '/videos/Mehndi (Hemant).mp4',
  },
  {
    id: 'mehndi-bride', order: 3, side: 'bride',
    name: 'Mehndi', nameDeva: 'मेहंदी',
    dateISO: '2026-11-21', dateLabel: '21 Nov', dayLabel: 'Saturday',
    timeLabel: 'Afternoon – Evening', icon: 'mehndi',
    blurb: 'Intricate henna and festive cheer for the bride and her guests.',
    dressCode: { label: 'Marigold & green', color: '#d9b441' },
    venue: brideHome,
    video: '/videos/Mehndi (Sukriti).mp4',
  },
  {
    id: 'sundarkand', order: 4, side: 'groom',
    name: 'Sundarkand Path', nameDeva: 'सुंदरकांड पाठ',
    dateISO: '2026-11-22', dateLabel: '22 Nov', dayLabel: 'Sunday',
    timeLabel: 'Morning', icon: 'path',
    blurb: 'A morning recitation seeking blessings for the union.',
    dressCode: { label: 'Saffron & white', color: '#e08a3c' },
    venue: groomHome,
    video: '/videos/Sundarkand Path (Hemant).mp4',
  },
  {
    id: 'shagun-sangeet', order: 5, side: 'together',
    name: 'Shagun & Sangeet', nameDeva: 'शगुन व संगीत',
    dateISO: '2026-11-22', dateLabel: '22 Nov', dayLabel: 'Sunday',
    timeLabel: 'Evening', icon: 'sangeet',
    blurb: 'Both families come together for blessings, dance and music.',
    dressCode: { label: 'Jewel tones', color: '#3b5ca8' },
    venue: hotelRadius,
    video: '/videos/HS Shagun.mp4',
  },
  {
    id: 'haldi', order: 6, side: 'together',
    name: 'Haldi', nameDeva: 'उत्सव',
    dateISO: '2026-11-23', dateLabel: '23 Nov', dayLabel: 'Monday',
    timeLabel: '9 a.m. onwards', icon: 'haldi',
    blurb: 'Turmeric, sunshine and joy for the bride and groom.',
    dressCode: { label: 'Sunny yellow', color: '#f1c40f' },
    venue: hotelRadius,
    video: '/videos/HS Haldi.mp4',
  },
  {
    id: 'chooda', order: 7, side: 'bride',
    name: 'Chooda Rasam', nameDeva: 'चूड़ा रसम',
    dateISO: '2026-11-24', dateLabel: '24 Nov', dayLabel: 'Tuesday',
    timeLabel: 'Morning', icon: 'chooda',
    blurb: 'The bride adorns her sacred chooda amid family blessings.',
    dressCode: { label: 'Rose & red', color: '#d05f7a' },
    venue: hotelRadius,
  },
  {
    id: 'sehrabandi-baarat', order: 8, side: 'groom',
    name: 'Sehrabandi & Baarat', nameDeva: 'सेहराबंदी व बारात',
    dateISO: '2026-11-24', dateLabel: '24 Nov', dayLabel: 'Tuesday',
    timeLabel: 'Evening', icon: 'baarat',
    blurb: 'The groom is adorned and sets off in a joyous procession.',
    dressCode: { label: 'Cream & gold', color: '#d4af37' },
    venue: groomHome,
  },
  {
    id: 'wedding', order: 9, side: 'together',
    name: 'The Wedding', nameDeva: 'विवाह',
    dateISO: '2026-11-24', dateLabel: '24 November 2026', dayLabel: 'Tuesday',
    timeLabel: 'Night', icon: 'wedding',
    blurb: 'The sacred pheras — where two souls become one.',
    dressCode: { label: 'Festive best', color: '#8a1f2b' },
    venue: dullatResort,
    // Per-side films: the guest's `side` picks which one plays (joint → groom).
    videoBySide: {
      groom: '/videos/Wedding (Hemant).mp4',
      bride: '/videos/Wedding (Sukriti).mp4',
    },
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
  { id: 'venue', label: 'Venue & Travel' },
  { id: 'rsvp', label: 'RSVP' },
];

/* Global config ------------------------------------------------------------- */
export const config = {
  // WhatsApp number that RSVP submissions are sent to (digits + country code,
  // no + or spaces). Used for both RSVP delivery and the footer share CTA. ⟵ EDIT
  rsvpWhatsApp: '919876500001',
  // RSVP success sound effect (optional). public/assets/yay.mp3
  yaySfx: '/assets/yay.mp3',
  // Default site URL used by the control panel to build share links.
  // Leave '' to auto-detect from the browser. ⟵ EDIT once deployed.
  siteUrl: '',
};
