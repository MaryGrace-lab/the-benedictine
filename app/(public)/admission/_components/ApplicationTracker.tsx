"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, User, CheckCircle, Loader2, Calendar, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { ApplicationResult } from '../_types/admission';

interface Props {
  onResume?: (applicationId: string) => void;
}

const ApplicationTracker = ({ onResume }: Props) => {
  const [trackingId, setTrackingId] = useState('');
  const [trackResult, setTrackResult] = useState<ApplicationResult | 'not_found' | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrack = async () => {
    if (!trackingId.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(`/api/admission?applicationId=${trackingId.trim()}`);
      if (res.ok) {
        const data: ApplicationResult = await res.json();
        setTrackResult(data);
      } else if (res.status === 404) {
        setTrackResult('not_found');
      } else {
        toast.error('Error fetching application');
        setTrackResult(null);
      }
    } catch {
      toast.error('Network error');
      setTrackResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      key="tracker"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8"
    >
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Search className="w-5 h-5 text-orange-600" /> Track Application
      </h2>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="e.g. ADM-2026-XXXX"
          value={trackingId}
          onChange={e => setTrackingId(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleTrack()}
          className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleTrack}
          disabled={isSearching}
          className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors disabled:opacity-70 flex items-center gap-1"
        >
          {isSearching ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Searching
            </>
          ) : (
            'Search'
          )}
        </button>
      </div>

      {trackResult === 'not_found' && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
          Application ID not found. Please double-check your entry.
        </div>
      )}

      {trackResult && trackResult !== 'not_found' && (
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
            <h3 className="font-bold">Result for {trackResult.applicationId}</h3>
          </div>
          <div className="p-6 grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Student Name</p>
                <p className="font-medium">{trackResult.studentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-500 uppercase font-bold">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold capitalize mt-1 ${
                    trackResult.status === 'accepted'
                      ? 'bg-green-100 text-green-700'
                      : trackResult.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : trackResult.status === 'submitted'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {trackResult.status}
                </span>
              </div>
            </div>
            {trackResult.classApplied && (
              <div className="flex items-start gap-3">
                <span className="text-xs text-slate-500 uppercase font-bold">Class:</span>
                <span>{trackResult.classApplied}</span>
              </div>
            )}
            {trackResult.submittedAt && (
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold">Submitted</p>
                  <p className="text-sm">{formatDate(trackResult.submittedAt)}</p>
                </div>
              </div>
            )}
            {trackResult.draftExpiresAt && trackResult.status === 'draft' && (
              <div className="col-span-full p-3 bg-amber-50 rounded-lg border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-amber-700">
                  Draft expires on {formatDate(trackResult.draftExpiresAt)}. Complete it now.
                </p>
                <button
                  onClick={() => onResume?.(trackResult.applicationId)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors self-start"
                >
                  Continue Application <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ApplicationTracker;