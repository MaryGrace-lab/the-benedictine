"use client";

import React from 'react';
import { User, Mail, Phone, MapPin, FileCheck } from 'lucide-react';
import { PersonalFormData, ParentFormData } from '../_types/admission';

interface StepReviewProps {
  personalData: PersonalFormData;
  parentData: ParentFormData;
  classApplied: string;
}

const StepReview = ({ personalData, parentData, classApplied }: StepReviewProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold border-b pb-2">Review Details</h3>
      <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center gap-3"><User className="w-4 h-4 text-blue-500" /><span className="text-sm"><strong>Student:</strong> {personalData.firstName} {personalData.lastName}</span></div>
          <div className="flex items-center gap-3"><Mail className="w-4 h-4 text-blue-500" /><span className="text-sm"><strong>Email:</strong> {parentData.parentEmail}</span></div>
          <div className="flex items-center gap-3"><Phone className="w-4 h-4 text-blue-500" /><span className="text-sm"><strong>Phone:</strong> {parentData.parentPhone}</span></div>
          <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-blue-500" /><span className="text-sm"><strong>Address:</strong> {parentData.address}</span></div>
          <div className="flex items-center gap-3"><FileCheck className="w-4 h-4 text-blue-500" /><span className="text-sm"><strong>Class:</strong> {classApplied}</span></div>
        </div>
        <div className="pt-4 border-t border-slate-200">
          <p className="text-xs text-slate-500 italic">By clicking submit, you agree that all information provided is accurate.</p>
        </div>
      </div>
    </div>
  );
};

export default StepReview;