//components/ui/StudentCard.tsx
"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";

type Props = {
  studentName: string;
  studentId: string;
  password: string;
  studentClass: string;
  isOpen: boolean;
  onClose: () => void;
};

export default function StudentCard({
  studentName,
  studentId,
  password,
  studentClass,
  isOpen,
  onClose,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: cardRef,
    documentTitle: `Student_Card_${studentId}`,
    pageStyle: `
      @page {
        size: A5 landscape;
        margin: 0;
      }
      @media print {
        body { 
          margin: 0; 
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          background-color: #FAF7F2;
        }
      }
    `,
  });

  const handleDownloadJPEG = async () => {
    const { toJpeg } = await import("html-to-image");
    if (cardRef.current) {
      try {
        const dataUrl = await toJpeg(cardRef.current, {
          quality: 0.95,
          pixelRatio: 3,
          backgroundColor: "#FAF7F2",
        });
        const link = document.createElement("a");
        link.download = `Student_Card_${studentId}.jpeg`;
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error("Oops, something went wrong with the image download!", error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-6 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 text-center">
          <h2 className="text-xl font-bold text-[#3D1902] flex items-center justify-center gap-2">
            🎓 Student Result Checker Card
          </h2>
          <p className="text-xs text-[#8B5E3C] font-medium mt-1">
            Format: A5 Landscape — Fold directly in half to form a compact A6 dual-sided card
          </p>
        </div>

        {/* Card Canvas Container */}
        <div className="flex justify-center mb-6 overflow-x-auto p-2 bg-slate-50 rounded-xl border border-slate-200/60 shadow-inner">
          <div
            ref={cardRef}
            className="w-[594px] h-[420px] relative flex overflow-hidden bg-[#FAF7F2] select-none flex-shrink-0"
            style={{ boxSizing: "border-box" }}
          >
            {/* ── FRONT SIDE (Left A6 Panel) ── */}
            <div className="w-1/2 h-full relative p-5 flex flex-col justify-between box-border border-r border-dashed border-[#8B5E3C]/40 bg-gradient-to-b from-white via-[#FAF7F2]/30 to-white">
              {/* Background Watermark Accent */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                <Image src="/logo.jpg" alt="" width={240} height={240} className="object-contain" unoptimized />
              </div>

              {/* Header Profile */}
              <div className="relative z-10 flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-[#8B5E3C]/20 p-1 flex-shrink-0 shadow-sm">
                  <Image src="/logo.jpg" alt="School Logo" fill className="object-contain p-0.5 rounded-lg" unoptimized />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-[11px] font-black text-[#3D1902] uppercase tracking-wider leading-tight">
                    The Benedictine Academy
                  </h3>
                  <p className="text-[7px] font-bold text-[#8B5E3C] tracking-wide uppercase">Catholic Education Centre</p>
                  <p className="text-[5.5px] text-slate-400 mt-0.5 line-clamp-1">37, Old Mechanic Road, Off Siluko Road, Egor, Benin City</p>
                </div>
              </div>

              {/* Main Credentials Display */}
              <div className="relative z-10 my-auto space-y-1.5">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-[#8B5E3C]/10 shadow-sm flex flex-col">
                  <span className="text-[6px] font-bold text-[#8B5E3C] uppercase tracking-widest mb-0.5">Student Name</span>
                  <span className="text-[11px] font-extrabold text-[#3D1902] truncate">{studentName}</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-[#8B5E3C]/10 shadow-sm flex flex-col">
                    <span className="text-[6px] font-bold text-[#8B5E3C] uppercase tracking-widest mb-0.5">Class</span>
                    <span className="text-[10px] font-bold text-[#3D1902] truncate">{studentClass}</span>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-[#8B5E3C]/10 shadow-sm flex flex-col">
                    <span className="text-[6px] font-bold text-[#8B5E3C] uppercase tracking-widest mb-0.5">Student Card ID</span>
                    <span className="text-[10px] font-bold text-[#3D1902] font-mono tracking-wider truncate">{studentId}</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#3D1902] to-[#5C2708] rounded-lg p-2 shadow-md flex items-center justify-between border border-black/20">
                  <div className="flex flex-col">
                    <span className="text-[6px] font-bold text-[#FAF7F2]/60 uppercase tracking-widest mb-0.5">Password Key</span>
                    <span className="text-[12px] font-black text-white font-mono tracking-widest">{password}</span>
                  </div>
                  <span className="text-sm opacity-20">🔑</span>
                </div>
              </div>

              {/* Footer Stamp */}
              <div className="relative z-10 pt-1.5 border-t border-[#8B5E3C]/15 flex items-center justify-between text-[6px] font-medium text-[#8B5E3C]/70">
                <span className="font-bold tracking-tight">thebenedictineacademyportal.com</span>
                <span className="text-[5px] text-slate-400">Learning in Wisdom • Est. 2017</span>
              </div>

              {/* Fold Badge Indicator Overlay */}
              <div className="absolute bottom-1 right-2 text-[5px] font-bold text-[#8B5E3C]/30 bg-[#8B5E3C]/5 px-1 py-0.5 rounded uppercase tracking-widest pointer-events-none">
                Front Side
              </div>
            </div>

            {/* ── BACK SIDE (Right A6 Panel) ── */}
            <div className="w-1/2 h-full relative p-5 flex flex-col justify-between box-border bg-gradient-to-b from-white via-[#FAF7F2]/10 to-white">
              {/* Central Instructions Block */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 justify-center bg-[#8B5E3C]/5 py-1 rounded-md border border-[#8B5E3C]/15">
                  <span className="text-[9px]">📋</span>
                  <h4 className="text-[9px] font-extrabold text-[#3D1902] uppercase tracking-wider">
                    Portal Access Guide
                  </h4>
                </div>

                <div className="space-y-1.5">
                  {[
                    { num: "1", txt: <>Visit <strong>thebenedictineacademyportal.com</strong></> },
                    { num: "2", txt: <>Click on <strong>Student Portal</strong> or <strong>Check Result</strong></> },
                    { num: "3", txt: <>Enter your <strong>Card ID</strong> printed on the front profile.</> },
                    { num: "4", txt: <>Enter your <strong>Password</strong> accurately.</> },
                    { num: "5", txt: <>Click <strong>Sign In</strong> to view and print your results.</> },
                  ].map((step) => (
                    <div key={step.num} className="flex gap-2 items-start bg-white/50 p-1.5 rounded border border-slate-100 shadow-2xs">
                      <span className="w-3.5 h-3.5 bg-[#8B5E3C] text-white rounded-md text-[7px] font-black flex items-center justify-center flex-shrink-0">
                        {step.num}
                      </span>
                      <span className="text-[7.5px] text-slate-700 leading-normal flex-1">{step.txt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety/Notice Block */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-2 space-y-1">
                <h5 className="text-[7.5px] font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1">
                  ⚠️ Critical Security Notice
                </h5>
                <p className="text-[6.5px] text-amber-900/80 leading-relaxed">
                  Treat credentials with care. Never disclose Card ID or Password to third parties. Contact the school's administrative support for assistance.
                </p>
              </div>

              {/* Back Footer Bar */}
              <div className="pt-2 border-t border-slate-100 text-center text-[5.5px] text-slate-400 leading-tight">
                <p>37, Old Mechanic Road, Off Siluko Road, Egor, Benin City, Edo State, Nigeria</p>
                <div className="flex justify-center gap-3 mt-1 font-bold text-[#8B5E3C]/50 uppercase tracking-widest">
                  <span>Motto: Wisdom & Virtue</span>
                  <span>•</span>
                  <span>Secure Token Layer v2.0</span>
                </div>
              </div>

              {/* Fold Badge Indicator Overlay */}
              <div className="absolute bottom-1 left-2 text-[5px] font-bold text-[#8B5E3C]/30 bg-[#8B5E3C]/5 px-1 py-0.5 rounded uppercase tracking-widest pointer-events-none">
                Back Side
              </div>
            </div>

            {/* Fold Centered Text Overlay */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center justify-between py-2 pointer-events-none z-20">
              <span className="text-[5px] font-bold text-[#8B5E3C]/40 bg-[#FAF7F2] px-1 border border-dashed border-[#8B5E3C]/30 rounded uppercase tracking-wider">✂️ Fold Line</span>
              <div className="h-full w-[1px] border-l border-dashed border-[#8B5E3C]/20 my-1" />
              <span className="text-[5px] font-bold text-[#8B5E3C]/40 bg-[#FAF7F2] px-1 border border-dashed border-[#8B5E3C]/30 rounded uppercase tracking-wider">✂️ Fold Line</span>
            </div>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => handlePrint()}
            className="flex-1 py-2.5 bg-[#8B5E3C] text-white rounded-xl font-bold hover:bg-[#6B3F2C] active:scale-[0.99] transition-all text-sm shadow-md shadow-[#8B5E3C]/10 flex items-center justify-center gap-2"
          >
            🖨️ Print Document (A5)
          </button>
          <button
            onClick={handleDownloadJPEG}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.99] transition-all text-sm shadow-md shadow-blue-600/10 flex items-center justify-center gap-2"
          >
            📥 Download Image Asset
          </button>
          <button
            onClick={onClose}
            className="w-28 py-2.5 bg-slate-100 text-slate-600 rounded-xl font-semibold hover:bg-slate-200 transition-all text-sm"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}