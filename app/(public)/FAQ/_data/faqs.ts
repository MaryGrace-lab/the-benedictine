import { ReactNode } from 'react';

export interface FAQItem {
  q: string;
  a: ReactNode;
}

export const faqs: FAQItem[] = [
  { 
    q: 'What are the admission requirements?', 
    a: 'Applicants must submit completed application forms, birth certificate, previous school reports, immunization records, and passport photographs. An entrance examination and interview are also required.' 
  },
  { 
    q: 'What is the school fee structure?', 
    a: 'Fees vary by class level. Please contact the admissions office (via /contact) or reach out on WhatsApp (https://wa.me/2347059443788) for the current fee schedule. Payment plans are available.'
  },
  { q: 'Do you offer boarding facilities?', a: 'Currently, The Benedictine Academy operates as a day school.' },
  { q: 'What extracurricular activities are available?', a: 'We offer a wide range including football, martial arts, debate competition, drama, coding club, music, art, and catering services.' },
  { q: 'How can I track my child\'s academic progress?', a: 'Parents can access the student portal to view results, attendance records, and teacher comments. We also hold termly parent-teacher meetings.' },
  { q: 'What is the student-to-teacher ratio?', a: 'We maintain a maximum ratio of 20:1 to ensure personalized attention and effective learning for every student.' },
  { q: 'Is transportation provided?', a: 'Yes, we operate school buses covering major routes across the city. Bus service fees are separate from tuition fees.' },
  { q: 'What curriculum does the school follow?', a: 'We follow the Nigerian National Curriculum accredited by the Ministry of Education, supplemented with international best practices in STEM and humanities.' },
];