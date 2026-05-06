import { z } from 'zod';

export const personalSchema = z.object({
  firstName: z.string().min(2, 'First name is required').max(50),
  lastName: z.string().min(2, 'Last name is required').max(50),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.string().min(1, 'Gender is required'),
  previousSchool: z.string().min(1, 'Previous school is required'),   // now required
});

export const parentSchema = z.object({
  parentName: z.string().min(2, 'Parent name is required').max(100),
  parentEmail: z.string().email('Invalid email'),
  parentPhone: z.string().min(10, 'Valid phone number required').max(15),
  address: z.string().min(5, 'Address is required').max(200),
});