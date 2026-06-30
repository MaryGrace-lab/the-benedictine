//app/(public)/admission/apply/_hooks/useApplicationForm.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ApplicationFormData {
  // Personal
  surname: string;
  firstName: string;
  middleName: string;
  gender: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  stateOfOrigin: string;
  lga: string;
  religion: string;
  bloodGroup: string;
  genotype: string;

  // Parent
  fatherName: string;
  motherName: string;
  guardianName: string;
  occupation: string;
  email: string;
  phoneNumber: string;
  alternatePhone: string;
  residentialAddress: string;
  emergencyContact: string;
  emergencyPhone: string;

  // Academic
  previousSchool: string;
  previousClass: string;
  applyingClass: string;
  session: string;

  // Medical
  allergies: string;
  medicalConditions: string;
  specialNeeds: string;
  emergencyMedicalInfo: string;

  // Document URLs (from upload)
  documents: {
    birthCertificate: string | null;
    passportPhoto: string | null;
    previousResult: string | null;
    medicalReport: string | null;
    recommendationLetter: string | null;
  };

  currentStep: number;
}

interface ApplicationFormActions {
  updateField: <K extends keyof ApplicationFormData>(field: K, value: ApplicationFormData[K]) => void;
  setDocument: (key: keyof ApplicationFormData["documents"], url: string | null) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
}

const initialState: ApplicationFormData = {
  surname: "",
  firstName: "",
  middleName: "",
  gender: "",
  dateOfBirth: "",
  placeOfBirth: "",
  nationality: "Nigerian",
  stateOfOrigin: "",
  lga: "",
  religion: "",
  bloodGroup: "",
  genotype: "",
  fatherName: "",
  motherName: "",
  guardianName: "",
  occupation: "",
  email: "",
  phoneNumber: "",
  alternatePhone: "",
  residentialAddress: "",
  emergencyContact: "",
  emergencyPhone: "",
  previousSchool: "",
  previousClass: "",
  applyingClass: "",
  session: "2026/2027",
  allergies: "",
  medicalConditions: "",
  specialNeeds: "",
  emergencyMedicalInfo: "",
  documents: {
    birthCertificate: null,
    passportPhoto: null,
    previousResult: null,
    medicalReport: null,
    recommendationLetter: null,
  },
  currentStep: 1,
};

export const useApplicationForm = create<ApplicationFormData & ApplicationFormActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      updateField: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),

      setDocument: (key, url) =>
        set((state) => ({
          documents: {
            ...state.documents,
            [key]: url,
          },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 6) set({ currentStep: currentStep + 1 });
      },

      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) set({ currentStep: currentStep - 1 });
      },

      resetForm: () => set(initialState),
    }),
    {
      name: "admission-form-storage",
      // Only persist current step, not personal data
      partialize: (state) => ({ currentStep: state.currentStep }),
    }
  )
);