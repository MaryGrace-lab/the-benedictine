import { Metadata } from 'next';
import AcademicsClient from './AcademicsClient';
import { curriculumSections } from './_data/curriculum';

export const metadata: Metadata = {
  title: 'Academics | The Benedictine Academy',
  description:
    'Explore our comprehensive primary and secondary curriculum designed for academic excellence and character formation.',
};

export default function AcademicsPage() {
  return <AcademicsClient sections={curriculumSections} />;
}