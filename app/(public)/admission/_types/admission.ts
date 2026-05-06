export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'success' | 'error' | 'pending';
  preview?: string;
  error?: string;
  url?: string;
}

export type PersonalFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  previousSchool: string;
};

export type ParentFormData = {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  address: string;
};

export interface ApplicationResult {
  applicationId: string;
  studentName: string;
  classApplied: string;
  status: 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected' | 'waitlisted';
  submittedAt: string | null;
  draftExpiresAt: string | null;
  currentStep: number;
}