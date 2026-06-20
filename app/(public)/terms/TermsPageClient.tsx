"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  FileCheck,
  AlertCircle,
  Users,
  CreditCard,
  ShieldCheck,
  BookOpen,
  MessageSquare,
  Scale,
  Globe,
} from 'lucide-react';
import { termsSections, privacyMetadata, contactInfo } from './_data/termsSections';

// Icon mapping – functions stay inside the client component
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  bookOpen: BookOpen,
  users: Users,
  creditCard: CreditCard,
  shieldCheck: ShieldCheck,
  scale: Scale,
  alertCircle: AlertCircle,
  messageSquare: MessageSquare,
  globe: Globe,
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

export default function TermsPageClient() {
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
              <FileCheck className="w-16 h-16 mx-auto mb-4 text-orange-400" aria-hidden="true" />
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-3xl md:text-5xl font-bold mb-4">
              Terms of Service
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-stone-300 text-lg">
              Please read these terms carefully before using our website and services.
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
            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 p-6 bg-red-50 rounded-2xl border border-red-200"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-bold text-red-800 mb-2">Important Legal Notice</h3>
                  <p className="text-stone-700 leading-relaxed">
                    These Terms of Service constitute a legally binding agreement between you and
                    The Benedictine Academy. By accessing our website, enrolling as a student, or
                    using any of our services, you acknowledge that you have read, understood, and
                    agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-6">
              {termsSections.map((section, index) => {
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

            {/* Termination Clause */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-200"
            >
              <h2 className="text-xl font-bold text-stone-800 mb-3">Termination of Service</h2>
              <p className="text-stone-600 mb-3">
                We reserve the right to suspend or terminate access to our website and services,
                without prior notice or liability, for any reason, including but not limited to:
              </p>
              <ul className="space-y-2 text-stone-600 ml-6">
                <li className="list-disc">Breach of these Terms of Service</li>
                <li className="list-disc">Non-payment of fees (for enrolled students)</li>
                <li className="list-disc">Conduct that violates school policies or Nigerian law</li>
                <li className="list-disc">Any activity that disrupts or harms our community</li>
              </ul>
            </motion.div>

            {/* Indemnification */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-stone-50 rounded-2xl border border-stone-200"
            >
              <h2 className="text-xl font-bold text-stone-800 mb-3">Indemnification</h2>
              <p className="text-stone-600">
                You agree to indemnify and hold harmless The Benedictine Academy, its administrators,
                teachers, staff, and affiliates from any claims, damages, losses, or expenses arising
                from your use of our website, violation of these terms, or infringement of any third-party rights.
              </p>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-200"
            >
              <h2 className="text-xl font-bold text-stone-800 mb-3">Contact Information</h2>
              <p className="text-stone-600 mb-3">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> {contactInfo.email}</p>
                <p><strong>Phone:</strong> {contactInfo.phone}</p>
                <p><strong>Address:</strong> {contactInfo.address}</p>
              </div>
            </motion.div>

            {/* Acknowledgment */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-8 text-center text-stone-500 text-sm"
            >
              <p>
                By using The Benedictine Academy website and services, you acknowledge that you have read,
                understood, and agree to be bound by these Terms of Service.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}