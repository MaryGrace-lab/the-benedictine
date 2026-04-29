"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, ChevronRight, ChevronLeft, 
  Mail, Save, User, Users, FileText, Eye
} from 'lucide-react';

export default function AdmissionPortal() {
  const [step, setStep] = useState(-1); 
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', dob: '', gender: '',
    parentName: '', parentEmail: '', parentPhone: '',
    address: '', targetClass: '', previousSchool: ''
  });

  const steps = [
    { title: 'Student', icon: <User className="w-5 h-5" /> },
    { title: 'Guardian', icon: <Users className="w-5 h-5" /> },
    { title: 'Details', icon: <FileText className="w-5 h-5" /> },
    { title: 'Review', icon: <Eye className="w-5 h-5" /> }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-12 bg-stone-50 p-4 rounded-2xl">
      {steps.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            step >= i ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-500'
          }`}>
            {step > i ? <CheckCircle className="w-5 h-5" /> : i + 1}
          </div>
          <span className={`hidden md:block font-bold text-sm ${step === i ? 'text-[#270f01]' : 'text-stone-400'}`}>
            {s.title}
          </span>
          {i < steps.length - 1 && <div className="hidden md:block w-8 h-[2px] bg-stone-200 mx-2" />}
        </div>
      ))}
    </div>
  );

  if (step === 4) return (
    <div className="min-h-screen bg-[#fdfcfb] flex items-center justify-center p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white p-12 rounded-[3rem] shadow-2xl text-center border border-stone-100">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h2 className="text-3xl font-black text-[#270f01]">Application Sent!</h2>
        <p className="mt-4 text-stone-500">We've sent a confirmation to <br/><span className="font-bold text-orange-600">{email}</span></p>
        <button onClick={() => setStep(-1)} className="mt-8 w-full py-4 bg-[#270f01] text-white rounded-2xl font-bold hover:bg-black transition-all">Return Home</button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-stone-900 pb-20 font-sans">
      <header className="bg-[#270f01] pt-20 pb-40 px-6 text-center text-white relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-5xl font-black tracking-tight">Admission <span className="text-orange-500">2026</span></h1>
          <p className="mt-4 text-stone-400 font-medium">Join our community of excellence and innovation.</p>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 bg-orange-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-10 w-96 h-96 bg-orange-800 rounded-full blur-3xl" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 -mt-24 relative z-20">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 overflow-hidden">
          
          {step === -1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-10 md:p-20 text-center">
              <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Mail className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-black text-[#270f01] mb-4">Portal Access</h2>
              <p className="text-stone-500 mb-10 text-lg max-w-sm mx-auto">Enter your email to start or resume your child's application.</p>
              
              <div className="max-w-md mx-auto text-left">
                <label htmlFor="access-email" className="text-xs font-black text-stone-400 uppercase tracking-widest block mb-2 text-center">Email Address</label>
                <input 
                  id="access-email"
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="parent@example.com"
                  className="w-full h-18 px-8 rounded-2xl border-2 border-stone-100 bg-stone-50 focus:border-orange-500 focus:bg-white outline-none text-lg mb-6 transition-all text-center font-medium"
                />
                <button 
                  onClick={() => setStep(0)}
                  className="w-full bg-orange-600 text-white py-6 rounded-2xl font-black text-xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-3"
                >
                  Enter Portal <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          )}

          {step >= 0 && step <= 3 && (
            <div className="p-8 md:p-14">
              <StepIndicator />

              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="space-y-8"
                  >
                    {step === 0 && (
                      <div className="grid md:grid-cols-2 gap-8">
                        <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                        <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                        <InputGroup label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} />
                        
                        <div className="space-y-2">
                          <label 
                            htmlFor="gender-select" 
                            className="text-xs font-black text-stone-400 uppercase tracking-widest"
                          >
                            Gender
                          </label>
                          <select 
                            id="gender-select" 
                            name="gender" 
                            value={formData.gender}
                            onChange={handleInputChange} 
                            className="w-full h-16 border-2 border-stone-100 bg-stone-50 rounded-2xl px-6 outline-none focus:border-orange-500 transition-all appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {step === 1 && (
                      <div className="grid md:grid-cols-1 gap-8">
                        <InputGroup label="Parent/Guardian Full Name" name="parentName" value={formData.parentName} onChange={handleInputChange} />
                        <div className="grid md:grid-cols-2 gap-8">
                          <InputGroup label="Contact Email" name="parentEmail" type="email" value={formData.parentEmail} onChange={handleInputChange} />
                          <InputGroup label="Phone Number" name="parentPhone" type="tel" value={formData.parentPhone} onChange={handleInputChange} />
                        </div>
                      </div>
                    )}

                    {step === 2 && (
                      <div className="grid md:grid-cols-1 gap-8">
                        <InputGroup label="Residential Address" name="address" value={formData.address} onChange={handleInputChange} />
                        <div className="grid md:grid-cols-2 gap-8">
                          <InputGroup label="Target Class" name="targetClass" value={formData.targetClass} onChange={handleInputChange} />
                          <InputGroup label="Previous School" name="previousSchool" value={formData.previousSchool} onChange={handleInputChange} />
                        </div>
                      </div>
                    )}

                    {step === 3 && (
                      <div className="bg-stone-50 rounded-3xl p-8 border border-stone-100">
                        <h4 className="font-black text-[#270f01] mb-6 flex items-center gap-2">
                          <Eye className="text-orange-500" /> Confirm Information
                        </h4>
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                          <p className="text-stone-400">Student:</p>
                          <p className="font-bold">{formData.firstName} {formData.lastName}</p>
                          <p className="text-stone-400">Guardian:</p>
                          <p className="font-bold">{formData.parentName}</p>
                          <p className="text-stone-400">Class:</p>
                          <p className="font-bold">{formData.targetClass}</p>
                        </div>
                        <p className="mt-8 text-xs text-stone-400 italic">By clicking submit, you agree that the information provided is accurate to the best of your knowledge.</p>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-between mt-16 pt-10 border-t border-stone-100">
                <button 
                  onClick={() => setStep(s => s - 1)} 
                  className="flex items-center gap-2 text-stone-400 font-bold hover:text-[#270f01] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" /> Back
                </button>
                <div className="flex gap-4">
                  <button className="hidden md:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-stone-400 hover:text-orange-600 transition-all">
                    <Save className="w-4 h-4" /> Save Draft
                  </button>
                  <button 
                    onClick={() => setStep(s => s + 1)} 
                    className="bg-[#270f01] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-black transition-all flex items-center gap-2 shadow-xl shadow-stone-200"
                  >
                    {step === 3 ? 'Final Submit' : 'Continue'} <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function InputGroup({ label, name, ...props }: InputGroupProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-xs font-black text-stone-400 uppercase tracking-widest">
        {label}
      </label>
      <input 
        id={name}
        name={name}
        {...props}
        className="w-full h-16 border-2 border-stone-100 bg-stone-50 rounded-2xl px-6 text-lg focus:border-orange-500 focus:bg-white outline-none transition-all font-medium" 
      />
    </div>
  );
}