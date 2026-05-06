"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { PersonalFormData } from '../_types/admission';

interface StepPersonalInfoProps {
  form: UseFormReturn<PersonalFormData>;
}

const StepPersonalInfo = ({ form }: StepPersonalInfoProps) => {
  const { register, formState: { errors }, watch, setValue } = form;

  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">Student Information</h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={labelClass}>First Name <span className="text-red-500">*</span></label>
          <input id="firstName" {...register('firstName')} placeholder="Enter first name" className={inputClass} />
          {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last Name <span className="text-red-500">*</span></label>
          <input id="lastName" {...register('lastName')} placeholder="Enter last name" className={inputClass} />
          {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="dateOfBirth" className={labelClass}>Date of Birth <span className="text-red-500">*</span></label>
          <input id="dateOfBirth" type="date" {...register('dateOfBirth')} className={inputClass} />
          {errors.dateOfBirth && <p className={errorClass}>{errors.dateOfBirth.message}</p>}
        </div>
        <div>
          <label htmlFor="gender" className={labelClass}>Gender <span className="text-red-500">*</span></label>
          <select 
            id="gender"
            className={inputClass + " bg-white"}
            value={watch('gender')} 
            onChange={e => setValue('gender', e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className={errorClass}>{errors.gender.message}</p>}
        </div>
      </div>

      <div>
  <label htmlFor="previousSchool" className={labelClass}>Previous School Attended<span className="text-red-500">*</span></label>
  <input id="previousSchool" {...register('previousSchool')} placeholder="Name of previous school" className={inputClass} />
  {errors.previousSchool && <p className={errorClass}>{errors.previousSchool.message}</p>}
</div>
    </div>
  );
};

export default StepPersonalInfo;