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
  category: 'academic' | 'event' | 'general';
  date: string;          // YYYY-MM-DD
  title: string;
  content: string;
}

export const homeAnnouncements: HomeAnnouncement[] = [
  {
    id: 1,
    category: 'academic',
    date: '2026-04-15',
    title: 'School Resumption',
    content: 'School will resume on 27th of April 2026.',
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
    name: 'Mrs. Umoize Mary',
    role: 'Parent',
    content: 'Taking my children to The Benedictine Academy was the best decision I ever made.',
  },
  {
    name: 'Mr. Okonkwo Joseph',
    role: 'Alumnus',
    content: 'The Benedictine Academy gave me the foundation I needed in my academic journey.',
  },
  {
    name: 'Dr. Eze Charlse',
    role: 'Parent',
    content: 'A beacon of academic and moral excellence.',
  },
];