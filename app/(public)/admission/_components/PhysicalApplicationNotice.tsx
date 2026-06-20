import React from 'react';
import { MapPin, Clock } from 'lucide-react';

export default function PhysicalApplicationNotice() {
  return (
    <section className="py-16 px-4 -mt-10">
      <div className="max-w-3xl mx-auto">
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 md:p-10 text-center shadow-lg">
          <MapPin className="w-12 h-12 text-amber-600 mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#270f01] mb-3">
            Physical Application Only
          </h2>
          <p className="text-stone-600 mb-6 max-w-xl mx-auto leading-relaxed">
            All candidates must apply{' '}
            <strong className="text-[#270f01]">physically at the school</strong>. We do not accept
            online applications at this time.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-stone-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Monday – Friday, 8:00 AM – 3:00 PM</span>
          </div>
          <p className="text-sm text-stone-500 mt-2">
            The Benedictine Academy, 37, Old Mechanic Road, Off Siluko Road, Egor, Benin City.
          </p>
        </div>
      </div>
    </section>
  );
}