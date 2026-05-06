"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import HeroHeader from './_components/HeroHeader';
import ApplicationTracker from './_components/ApplicationTracker';
import FormStepper from './_components/FormStepper';
import StepPersonalInfo from './_components/StepPersonalInfo';
import StepParentInfo from './_components/StepParentInfo';
import StepDocuments from './_components/StepDocuments';
import StepReview from './_components/StepReview';
import SuccessScreen from './_components/SuccessScreen';
import { personalSchema, parentSchema } from './_schemas/admissionSchemas';
import { PersonalFormData, ParentFormData, UploadedFile } from './_types/admission';
import toast from 'react-hot-toast';

const AdmissionPage = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState<string | null>(null);
  const [classApplied, setClassApplied] = useState('');
  const [showTracker, setShowTracker] = useState(false);
  const [documents, setDocuments] = useState<Record<string, UploadedFile[]>>({
    birthCertificate: [],
    passportPhoto: [],
    previousResult: [],
    medicalReport: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const personalForm = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    defaultValues: { firstName: '', lastName: '', dateOfBirth: '', gender: '', previousSchool: '' }
  });

  const parentForm = useForm<ParentFormData>({
    resolver: zodResolver(parentSchema),
    defaultValues: { parentName: '', parentEmail: '', parentPhone: '', address: '' }
  });

  // ---------- Stable saveDraft with refs ----------
  const appIdRef = useRef(appId);
  appIdRef.current = appId;

  const formValuesRef = useRef({ personal: personalForm.getValues(), parent: parentForm.getValues(), classApplied: '' });
  formValuesRef.current = {
    personal: personalForm.getValues(),
    parent: parentForm.getValues(),
    classApplied,
  };

  const saveDraft = useCallback(async (currentStep: number) => {
    const id = appIdRef.current;
    if (!id) return;
    const { personal, parent, classApplied: cl } = formValuesRef.current;
    const data = { ...personal, ...parent, classApplied: cl };
    try {
      await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'saveDraft', applicationId: id, step: currentStep, data }),
      });
    } catch (e) {
      console.warn('Draft save failed', e);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (appId && !submitted && !showTracker) saveDraft(step);
    }, 120000);
    return () => clearInterval(interval);
  }, [appId, step, submitted, showTracker, saveDraft]);

  // ---------- Init application on first load ----------
  const initApplication = useCallback(async () => {
    if (appId || showTracker) return;
    try {
      const data = {
        firstName: personalForm.getValues('firstName') || 'temp',
        lastName: personalForm.getValues('lastName') || 'temp',
        dateOfBirth: personalForm.getValues('dateOfBirth') || new Date().toISOString().split('T')[0],
        gender: personalForm.getValues('gender') || 'male',
        previousSchool: personalForm.getValues('previousSchool') || '',
      };
      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'init', data }),
      });
      const result = await res.json();
      if (result.success) {
        setAppId(result.applicationId);
        toast.success('Application started! Save your ID: ' + result.applicationId);
        localStorage.setItem('admissionId', result.applicationId);
      } else {
        toast.error('Failed to start application');
      }
    } catch {
      toast.error('Network error');
    }
  }, [appId, showTracker, personalForm]);

  useEffect(() => {
    const savedId = localStorage.getItem('admissionId');
    if (savedId) setAppId(savedId);
  }, []);

  // ---------- Load draft from tracker ----------
  const loadDraft = async (applicationId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admission?applicationId=${applicationId}&action=resume`);
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error || 'Cannot load draft');
        return;
      }
      const data = await res.json();
      personalForm.reset(data.studentData);
      parentForm.reset(data.parentData);
      setClassApplied(data.classApplied || '');
      setStep(data.currentStep ?? 1);
      setAppId(applicationId);
      setShowTracker(false);
      toast.success('Draft loaded');
    } catch {
      toast.error('Connection error');
    } finally {
      setIsLoading(false);
    }
  };

  // ---------- File Upload to Vercel Blob ----------
  const handleFileUpload = async (file: File, docKey: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Upload failed');
    }

    const data = await res.json();
    return data.url; // Permanent Vercel Blob URL
  };

  // ---------- Navigation ----------
  const handleNext = async () => {
    setIsLoading(true);
    if (step === 0) {
      const valid = await personalForm.trigger();
      if (!valid) { setIsLoading(false); return; }
      if (!appId) await initApplication();
    } else if (step === 1) {
      const valid = await parentForm.trigger();
      if (!valid) { setIsLoading(false); return; }
    } else if (step === 2) {
      if (!classApplied) { toast.error('Please select a class'); setIsLoading(false); return; }
      const requiredDocs = ['birthCertificate', 'passportPhoto', 'previousResult'];
      const missingDocs = requiredDocs.filter(
        docKey => !documents[docKey]?.[0] || documents[docKey][0].status !== 'success'
      );
      if (missingDocs.length > 0) { toast.error('Please upload all required documents'); setIsLoading(false); return; }
    }

    if (appId) await saveDraft(step + 1);
    setStep(s => s + 1);
    setIsLoading(false);
  };

  // ---------- Final Submission ----------
  const handleSubmitApp = async () => {
    const personalValid = await personalForm.trigger();
    const parentValid = await parentForm.trigger();
    if (!personalValid || !parentValid) {
      toast.error('Please correct the errors in the form');
      return;
    }
    if (!classApplied) {
      toast.error('Please select a class');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        ...personalForm.getValues(),
        ...parentForm.getValues(),
        classApplied,
        documents: {
          birthCertificate: documents.birthCertificate.map(f => f.url || ''),
          passportPhoto: documents.passportPhoto.map(f => f.url || ''),
          previousResult: documents.previousResult.map(f => f.url || ''),
          medicalReport: documents.medicalReport.map(f => f.url || ''),
        },
      };

      const res = await fetch('/api/admission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit', applicationId: appId, data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSubmitted(true);
        toast.success('Application submitted! Check your email for the application ID.');
      } else {
        if (result.error?.fieldErrors) {
          const messages = Object.entries(result.error.fieldErrors)
            .map(([field, errs]) => `${field}: ${(errs as string[]).join(', ')}`)
            .join('; ');
          toast.error(messages || 'Validation failed');
        } else {
          toast.error(result.error || 'Submission failed');
        }
      }
    } catch {
      toast.error('Network error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setStep(0);
    setShowTracker(true);
    setClassApplied('');
    setDocuments({ birthCertificate: [], passportPhoto: [], previousResult: [], medicalReport: [] });
    personalForm.reset();
    parentForm.reset();
    setAppId(null);
    localStorage.removeItem('admissionId');
  };

  if (submitted && appId) return <SuccessScreen appId={appId} onReset={handleReset} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <HeroHeader showTracker={showTracker} setShowTracker={setShowTracker} />

      <main className="max-w-4xl mx-auto px-4 -mt-8 pb-20">
        <AnimatePresence mode="wait">
          {showTracker ? (
            <ApplicationTracker onResume={loadDraft} />
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <FormStepper step={step} setStep={setStep} handleNext={handleNext} handleSubmitApp={handleSubmitApp} loading={isLoading}>
                {step === 0 && <StepPersonalInfo form={personalForm} />}
                {step === 1 && <StepParentInfo form={parentForm} />}
                {step === 2 && <StepDocuments classApplied={classApplied} setClassApplied={setClassApplied} documents={documents} setDocuments={setDocuments} handleFileUpload={handleFileUpload} />}
                {step === 3 && <StepReview personalData={personalForm.getValues()} parentData={parentForm.getValues()} classApplied={classApplied} />}
              </FormStepper>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdmissionPage;