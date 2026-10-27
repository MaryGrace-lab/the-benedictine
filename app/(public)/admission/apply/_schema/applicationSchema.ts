//app/(public)/admission/apply/_schema/applicationSchema.ts
import { z } from "zod";

export const personalInfoSchema = z.object({
  surname: z.string().min(1, "Surname is required"),
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  gender: z.string().min(1, "Please select gender"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  stateOfOrigin: z.string().min(1, "State of origin is required"),
  lga: z.string().min(1, "Local government area is required"),
  religion: z.string().min(1, "Religion is required"),
  bloodGroup: z.string().optional(),
  genotype: z.string().optional(),
});

export const parentInfoSchema = z.object({
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  guardianName: z.string().optional(),
  occupation: z.string().min(1, "Occupation is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  alternatePhone: z.string().optional(),
  residentialAddress: z.string().min(1, "Residential address is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyPhone: z.string().min(10, "Valid emergency phone is required"),
});

export const academicInfoSchema = z.object({
  previousSchool: z.string().optional(),
  previousClass: z.string().optional(),
  applyingClass: z.string().min(1, "Please select a class"),
  session: z.string().min(1, "Session is required"),
});

export const medicalInfoSchema = z.object({
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  specialNeeds: z.string().optional(),
  emergencyMedicalInfo: z.string().optional(),
});

export const fullApplicationSchema = z.object({
  ...personalInfoSchema.shape,
  ...parentInfoSchema.shape,
  ...academicInfoSchema.shape,
  ...medicalInfoSchema.shape,
});

export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ParentInfo = z.infer<typeof parentInfoSchema>;
export type AcademicInfo = z.infer<typeof academicInfoSchema>;
export type MedicalInfo = z.infer<typeof medicalInfoSchema>;
export type FullApplication = z.infer<typeof fullApplicationSchema>;