// ---------- Stats Bar ----------
export interface HomeStat {
  value: string;
  label: string;
  key: string;        // used to match icon
}

export const homeStats: HomeStat[] = [
  { value: '200+', label: 'Students', key: 'users' },
  { value: '90%', label: 'Pass Rate', key: 'graduationCap' },
  { value: '25+', label: 'Expert Teachers', key: 'userCheck' },
  { value: '50+', label: 'Subjects', key: 'bookOpen' },
];

// ---------- Announcements ----------
export interface HomeAnnouncement {
  id: number;
  category: 'academic' | 'event' | 'general' | 'notice';
  date: string;          // YYYY-MM-DD
  title: string;
  content: string;
}

export const homeAnnouncements: HomeAnnouncement[] = [
  {
    id: 1,
    category: 'academic',
    date: '2026-07-10', // YYYY-MM-DD
    title: 'School Vacation Notice',
    content: 'School will vacate on 10th of July 2026.',
  },

  {
    id: 2,
    category: 'notice',
    date: '2026-07-10', // YYYY-MM-DD
    title: 'Admission Open',
    content: 'Applications for the new academic year are now open. Both online and physical applications are accepted.',
  },

];

// ---------- Highlights ----------
export interface HomeHighlight {
  title: string;
  description: string;
  icon: string;   // emoji or text, not a component
}

export const homeHighlights: HomeHighlight[] = [
  {
    title: 'Academic Excellence',
    description:
      'Maintaining a legacy of distinction with a consistent 90% pass rate in external examinations.',
    icon: '🎓',
  },
  {
    title: 'Modern Facilities',
    description:
      'Advanced ICT and science labs, music and martial arts studios, and comprehensive athletic grounds.',
    icon: '🏫',
  },
  {
    title: 'Character Formation',
    description:
      'Cultivating leaders through discipline, integrity, and a commitment to community service.',
    icon: '⭐',
  },
  {
    title: 'Sports & Arts',
    description:
      'Thriving in competitive athletics, creative arts, and eloquent discourse through our debate programs.',
    icon: '⚽',
  },
];

// ---------- Testimonials ----------
export interface HomeTestimonial {
  name: string;
  role: string;
  content: string;
}

export const homeTestimonials: HomeTestimonial[] = [
  {
    name: 'Miss Umoize Mary',
    role: 'Teacher',
    content: 'Teaching at the Benedictine Academy has been a rewarding experience, witnessing students grow academically, spiritually and morally.',
  },
];


// ---------- Gallery ----------

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

export const galleryImages: GalleryImage[] = [
  {
    src: '/1.jpg',
    alt: 'School building exterior',
    title: 'Our Campus',
    description: 'The beautiful Benedictine Academy campus',
  },
  {
    src: '/classroom.jpg',
    alt: 'Students in class',
    title: 'Classroom Learning',
    description: 'Students engaged in interactive learning',
  },
  {
    src: '/computer-lab-2.jpg',
    alt: 'Computer lab',
    title: 'Modern Facilities',
    description: 'State-of-the-art computer lab for digital learning',
  },
  {
    src: '/econs-practical-2.jpg',
    alt: 'Economics practical',
    title: 'Practical Learning',
    description: 'Hands-on learning experiences for our students',
  },
];