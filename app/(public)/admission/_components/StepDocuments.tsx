"use client";

import React from 'react';
import FileUploadField from './FileUploadField';
import { classOptions } from '../_data/classOptions';
import { UploadedFile } from '../_types/admission';

interface StepDocumentsProps {
  classApplied: string;
  setClassApplied: (value: string) => void;
  documents: Record<string, UploadedFile[]>;
  setDocuments: React.Dispatch<React.SetStateAction<Record<string, UploadedFile[]>>>;
  handleFileUpload: (file: File, docKey: string) => Promise<string>;
}

const StepDocuments = ({ classApplied, setClassApplied, documents, setDocuments, handleFileUpload }: StepDocumentsProps) => {
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const inputClass = "w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold border-b pb-2">Class & Documents</h3>
      
      <div>
        <label htmlFor="classApplied" className={labelClass}>Apply For Class <span className="text-red-500">*</span></label>
        <select 
          id="classApplied"
          className={inputClass} 
          value={classApplied} 
          onChange={e => setClassApplied(e.target.value)}
        >
          <option value="">Select a Class</option>
          {classOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      
      <div className="space-y-6">
        <h4 className="font-semibold text-slate-800">Required Documents</h4>
        
        <FileUploadField
          label="Birth Certificate"
          required
          acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf']}
          maxSize={5}
          maxFiles={1}
          value={documents.birthCertificate}
          onChange={(files) => setDocuments(prev => ({ ...prev, birthCertificate: files }))}
          onFileUpload={(file) => handleFileUpload(file, 'birthCertificate')}
        />
        
        <FileUploadField
          label="Passport Photo"
          required
          acceptedTypes={['.jpg', '.jpeg', '.png']}
          maxSize={2}
          maxFiles={1}
          value={documents.passportPhoto}
          onChange={(files) => setDocuments(prev => ({ ...prev, passportPhoto: files }))}
          onFileUpload={(file) => handleFileUpload(file, 'passportPhoto')}
        />
        
        <FileUploadField
          label="Previous Term Result"
          required
          acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf']}
          maxSize={5}
          maxFiles={1}
          value={documents.previousResult}
          onChange={(files) => setDocuments(prev => ({ ...prev, previousResult: files }))}
          onFileUpload={(file) => handleFileUpload(file, 'previousResult')}
        />

        <FileUploadField
          label="Medical Report (optional)"
          acceptedTypes={['.jpg', '.jpeg', '.png', '.pdf']}
          maxSize={5}
          maxFiles={1}
          value={documents.medicalReport}
          onChange={(files) => setDocuments(prev => ({ ...prev, medicalReport: files }))}
          onFileUpload={(file) => handleFileUpload(file, 'medicalReport')}
        />
      </div>
    </div>
  );
};

export default StepDocuments;