"use client";

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ParentFormData } from '../_types/admission';

interface StepParentInfoProps {
  form: UseFormReturn<ParentFormData>;
}

const StepParentInfo = ({ form }: StepParentInfoProps) => {
  const { register, formState: { errors } } = form;

  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const errorClass = "text-red-500 text-xs mt-1";

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">Parent/Guardian Information</h3>
      
      <div>
        <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
        <input {...register('parentName')} placeholder="Guardian's legal name" className={inputClass} />
        {errors.parentName && <p className={errorClass}>{errors.parentName.message}</p>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
          <input type="email" {...register('parentEmail')} placeholder="email@example.com" className={inputClass} />
          {errors.parentEmail && <p className={errorClass}>{errors.parentEmail.message}</p>}
        </div>
        <div>
          <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
          <input {...register('parentPhone')} placeholder="+234..." className={inputClass} />
          {errors.parentPhone && <p className={errorClass}>{errors.parentPhone.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>Residential Address <span className="text-red-500">*</span></label>
        <textarea 
          className={inputClass + " min-h-25"}
          {...register('address')}
        />
        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
      </div>
    </div>
  );
};

export default StepParentInfo;