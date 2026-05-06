import React from 'react';

const MapEmbed = () => {
  return (
    <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-xl h-64 md:h-80 group">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.345862828!2d5.5898864!3d6.3492751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1040ed6e94f06835%3A0x6767676767676767!2s37%20Old%20Mechanic%20Rd%2C%20Benin%20City!5e0!3m2!1sen!2sng!4v1714412345678!5m2!1sen!2sng"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="grayscale hover:grayscale-0 transition-all duration-700"
      />
    </div>
  );
};

export default MapEmbed;