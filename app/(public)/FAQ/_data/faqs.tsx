import { ReactNode } from 'react';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

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
    a: (
      <span>
        Fees vary by class level. Please{' '}
        <Link 
          href="/contact" 
          className="text-[#270f01] underline font-semibold hover:text-[#b08d2a] transition-colors"
        >
          contact the admissions office
        </Link>{' '}
        or reach out via{' '}
        <a 
          href="https://wa.me/2347059443788"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-green-600 underline font-semibold"
        >
          WhatsApp <MessageCircle className="w-3 h-3" />
        </a>{' '}
        for the current fee schedule. Payment plans are available.
      </span>
    ) 
  },
  { q: 'Do you offer boarding facilities?', a: 'Currently, The Benedictine Academy operates as a day school.' },
  { q: 'What extracurricular activities are available?', a: 'We offer a wide range including football, martial arts, debate competition, drama, coding club, music, art, and catering services.' },
  { q: 'How can I track my child\'s academic progress?', a: 'Parents can access the student portal to view results, attendance records, and teacher comments. We also hold termly parent-teacher meetings.' },
  { q: 'What is the student-to-teacher ratio?', a: 'We maintain a maximum ratio of 20:1 to ensure personalized attention and effective learning for every student.' },
  { q: 'Is transportation provided?', a: 'Yes, we operate school buses covering major routes across the city. Bus service fees are separate from tuition fees.' },
  { q: 'What curriculum does the school follow?', a: 'We follow the Nigerian National Curriculum accredited by the Ministry of Education, supplemented with international best practices in STEM and humanities.' },
];