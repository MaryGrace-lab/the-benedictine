export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "3rd Term Resumption & Workers' Day",
    excerpt: "School resumes on April 27th, 2026. Teaching and learning begins immediately. May 1st is Workers' Day (Public Holiday).",
    date: "April 27 – May 1, 2026 (Week 1)",
    category: "Academic",
    image: "/1.jpg"
  },
  {
    id: 2,
    title: "Teaching & Learning Continues",
    excerpt: "Regular teaching and learning activities across all classes for the second week of the term.",
    date: "May 4 – 8, 2026 (Week 2)",
    category: "Academic",
    image: "/classroom.jpg"
  },
  {
    id: 3,
    title: "BECE Mock Exam & 2nd CAT Questions",
    excerpt: "Teaching and learning continues. BECE Mock Examination scheduled. Submission of 2nd CAT questions due this week.",
    date: "May 11 – 15, 2026 (Week 3)",
    category: "Examination",
    image: "/classroom.jpg"
  },
  {
    id: 4,
    title: "BECE Practical Examination",
    excerpt: "Teaching and learning continues alongside BECE Practical examinations for eligible students.",
    date: "May 18 – 22, 2026 (Week 4)",
    category: "Examination",
    image: "/science.png"
  },
  {
    id: 5,
    title: "1st Test & Computer Practical I",
    excerpt: "First continuous assessment test for the term. Computer Practical I examination also scheduled this week.",
    date: "May 25 – 29, 2026 (Week 5)",
    category: "Examination",
    image: "/computer-lab.jpg"
  },
  {
    id: 6,
    title: "Midterm Break & BECE Examination",
    excerpt: "Midterm break for all students. BECE Examination continues for registered candidates.",
    date: "June 1 – 5, 2026 (Week 6)",
    category: "Events",
    image: "/1.jpg"
  },
  {
    id: 7,
    title: "Graduation Rehearsal Begins",
    excerpt: "Teaching and learning resumes after midterm break. Graduation rehearsal begins for final year students. June 12th is Democracy Day (Public Holiday).",
    date: "June 8 – 12, 2026 (Week 7)",
    category: "Events",
    image: "/1.jpg"
  },
  {
    id: 8,
    title: "Music Practical I & 2nd CAT Submission",
    excerpt: "Teaching and learning continues. Music Practical I examination scheduled. Submission of 2nd CAT questions due by June 19th.",
    date: "June 15 – 19, 2026 (Week 8)",
    category: "Examination",
    image: "/music.jpg"
  },
  {
    id: 9,
    title: "MBA Mock Examination",
    excerpt: "Teaching and learning continues. MBA Mock Examination scheduled this week.",
    date: "June 22 – 26, 2026 (Week 9)",
    category: "Examination",
    image: "/classroom.jpg"
  },
  {
    id: 10,
    title: "2nd Test, Electrical Practical & MBA Exam",
    excerpt: "Second continuous assessment test. Electrical Practical I examination. Submission of exam questions (soft copies). MBA Examination on July 4th.",
    date: "June 29 – July 4, 2026 (Week 10)",
    category: "Examination",
    image: "/classroom.jpg"
  },
  {
    id: 11,
    title: "Teaching & Learning Week",
    excerpt: "Regular teaching and learning activities continue across all classes.",
    date: "July 6 – 10, 2026 (Week 11)",
    category: "Academic",
    image: "/classroom.jpg"
  },
  {
    id: 12,
    title: "General Revision & Music Practical II",
    excerpt: "General revision begins for all classes in preparation for examinations. Music Practical II scheduled.",
    date: "July 13 – 17, 2026 (Week 12)",
    category: "Academic",
    image: "/music.jpg"
  },
  {
    id: 13,
    title: "Term Examination & Practicals",
    excerpt: "3rd term examinations begin. Electrical and Computer Practical II examinations also scheduled this week.",
    date: "July 20 – 24, 2026 (Week 13)",
    category: "Examination",
    image: "/classroom.jpg"
  },
  {
    id: 14,
    title: "Results, Graduation & Vacation",
    excerpt: "Filling of result booklets (July 27-28). Final graduation rehearsal (July 29). Graduation ceremony (July 30). Collection of results and vacation begins (July 31).",
    date: "July 27 – 31, 2026 (Week 14)",
    category: "Events",
    image: "/1.jpg"
  },
  {
    id: 15,
    title: "1st Term 2026/2027 Resumption",
    excerpt: "The Benedictine Academy resumes for the 1st term of the 2026/2027 academic session. All students are expected back on campus.",
    date: "September 14, 2026",
    category: "Academic",
    image: "/1.jpg"
  },
];