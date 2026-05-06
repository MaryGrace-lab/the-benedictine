"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessScreenProps {
  appId: string;
  onReset: () => void;
}

const SuccessScreen = ({ appId, onReset }: SuccessScreenProps) => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Application Sent!</h1>
        <p className="text-slate-600 mb-8">We have received your application. Please save your ID for tracking.</p>
        <div className="bg-slate-100 rounded-2xl p-6 mb-8">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Your Application ID</p>
          <p className="text-3xl font-mono font-bold text-blue-600">{appId}</p>
        </div>
        <button 
          onClick={onReset}
          className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
        >
          Track Application Status
        </button>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;