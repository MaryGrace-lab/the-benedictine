"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { formSteps } from '../_data/formSteps';

interface FormStepperProps {
  step: number;
  setStep: (step: number) => void;
  handleNext: () => Promise<void>;
  handleSubmitApp: () => Promise<void>;
  loading: boolean; // add this prop
  children: React.ReactNode;
}

const FormStepper = ({ step, setStep, handleNext, handleSubmitApp, loading, children }: FormStepperProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
      {/* Step Indicators (unchanged) */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto pb-4">
        {formSteps.map((s, i) => (
          <div key={s} className="flex items-center flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i <= step ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'
            }`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-xs font-bold hidden md:block ${i <= step ? 'text-slate-900' : 'text-slate-400'}`}>
              {s}
            </span>
            {i < formSteps.length - 1 && (
              <div className={`w-8 md:w-12 h-0.5 mx-3 ${i < step ? 'bg-orange-600' : 'bg-slate-100'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="min-h-[300px]">
        {children}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12 pt-6 border-t border-slate-100">
        <button 
          onClick={() => setStep(step - 1)} 
          disabled={step === 0 || loading}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        
        {step < 3 ? (
          <button 
            onClick={handleNext}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 shadow-md transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next Step <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        ) : (
          <button 
            onClick={handleSubmitApp}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-lg transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormStepper;