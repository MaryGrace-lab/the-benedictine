import React from 'react';
import { AcademicsPageContent } from './_components/AcademicsAnimations';
import { CurriculumSection as CurriculumSectionType } from './_types/academics';

interface AcademicsClientProps {
  sections: CurriculumSectionType[];
}

export default function AcademicsClient({ sections }: AcademicsClientProps) {
  return <AcademicsPageContent sections={sections} />;
}