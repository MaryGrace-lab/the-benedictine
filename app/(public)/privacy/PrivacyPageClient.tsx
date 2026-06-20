"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Mail,
  Cookie,
  FileText,
} from 'lucide-react';
import { privacySections, privacyMetadata, contactInfo } from './_data/privacySections';

// Icon mapping – functions stay inside the client component
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  lock: Lock,
  eye: Eye,
  database: Database,
  mail: Mail,
  cookie: Cookie,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function PrivacyPageClient() {
  return (
    <main className="flex-1 pt-16 md:pt-20 bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-stone-900 to-[#270f01] text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div variants={fadeUp} custom={0}>
              <FileText className="w-16 h-16 mx-auto mb-4 text-orange-400" aria-hidden="true" />
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold mb-4">
              Privacy Policy
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg">
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </motion.p>
            <motion.p variants={fadeUp} custom={3} className="text-stone-400 text-sm mt-4">
              Last Updated: {privacyMetadata.lastUpdated}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 p-6 bg-amber-50 rounded-2xl border border-amber-200"
            >
              <p className="text-stone-700 leading-relaxed">
                The Benedictine Academy ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                when you visit our website or use our services. Please read this policy carefully.
              </p>
            </motion.div>

            {/* Policy Sections */}
            <div className="space-y-8">
              {privacySections.map((section, index) => {
                const IconComponent = ICON_MAP[section.iconKey];
                return (
                  <motion.div
                    key={section.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-orange-100 rounded-xl text-orange-600 shrink-0">
                        {IconComponent && <IconComponent className="w-6 h-6" aria-hidden="true" />}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-4">
                          {section.title}
                        </h2>
                        <ul className="space-y-2">
                          {section.content.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-stone-600">
                              <span className="text-orange-500 mt-1" aria-hidden="true">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Children's Privacy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-200"
            >
              <h2 className="text-xl font-bold text-stone-800 mb-3">Children's Privacy</h2>
              <p className="text-stone-600 mb-3">
                We are committed to protecting the privacy of children. Our website and services are designed
                for use by parents, guardians, and authorized school personnel. We do not knowingly collect
                personal information from children without parental consent.
              </p>
              <p className="text-stone-600">
                Parents and guardians have the right to review, update, or request deletion of their child's
                information. Please contact us at the email below to exercise these rights.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-200"
            >
              <h2 className="text-xl font-bold text-stone-800 mb-3">Contact Us</h2>
              <p className="text-stone-600 mb-3">
                If you have questions about this Privacy Policy or our data practices, please contact us at:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Phone:</strong> {contactInfo.phone}</p>    
                <p><strong>Address:</strong> {contactInfo.address}</p>
              </div>
            </motion.div>

            {/* Updates to Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 text-center text-stone-500 text-sm"
            >
              <p>
                We may update this Privacy Policy from time to time. Changes will be posted on this page
                with an updated revision date. Continued use of our website constitutes acceptance of any changes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}