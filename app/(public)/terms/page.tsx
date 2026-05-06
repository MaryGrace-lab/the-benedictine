"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileCheck, 
  AlertCircle, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  BookOpen,
  MessageSquare,
  Scale,
  Globe
} from "lucide-react";

export default function TermsOfServicePage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.1, duration: 0.5 } 
    }),
  };

  const termsSections = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Acceptance of Terms",
      content: [
        "By accessing and using The Benedictine Academy website, you agree to be bound by these Terms of Service.",
        "If you do not agree with any part of these terms, please do not use our website or services.",
        "These terms apply to all visitors, users, parents, guardians, and students."
      ]
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Accounts & Registration",
      content: [
        "You must provide accurate and complete information when creating an account.",
        "You are responsible for maintaining the confidentiality of your login credentials.",
        "You agree to notify us immediately of any unauthorized use of your account.",
        "We reserve the right to suspend or terminate accounts that violate these terms.",
        "Each user is responsible for all activities that occur under their account."
      ]
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Payments & Fees",
      content: [
        "School fees and other charges are due according to the published schedule.",
        "All payments must be made through approved payment channels.",
        "Late payments may result in additional fees or suspension of services.",
        "Refunds are governed by our refund policy as outlined in the school handbook.",
        "We reserve the right to modify fees with reasonable advance notice."
      ]
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Code of Conduct",
      content: [
        "Users must treat all school community members with respect and dignity.",
        "Harassment, bullying, or discriminatory behavior is strictly prohibited.",
        "Students must adhere to the school's dress code and behavioral standards.",
        "Parents are expected to communicate respectfully with staff and faculty.",
        "Violations may result in disciplinary action including account termination."
      ]
    },
    {
      icon: <Scale className="w-6 h-6" />,
      title: "Intellectual Property",
      content: [
        "All content on this website is the property of The Benedictine Academy.",
        "You may not reproduce, distribute, or modify content without written permission.",
        "The school logo, name, and branding are protected trademarks.",
        "Educational materials are for personal, non-commercial use only.",
        "Unauthorized use of intellectual property may result in legal action."
      ]
    },
    {
      icon: <AlertCircle className="w-6 h-6" />,
      title: "Limitation of Liability",
      content: [
        "The Benedictine Academy is not liable for indirect or consequential damages.",
        "We do not guarantee uninterrupted or error-free access to our services.",
        "You assume all risks associated with using our website and services.",
        "Our liability is limited to the maximum extent permitted by law.",
        "We are not responsible for third-party content or links on our site."
      ]
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Communication & Notifications",
      content: [
        "By using our services, you consent to receive electronic communications from us.",
        "Important notifications will be sent via email, SMS, or through the parent portal.",
        "You agree to keep your contact information current.",
        "Emergency notifications may be sent to registered phone numbers.",
        "It is your responsibility to regularly check for updates and announcements."
      ]
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Governing Law",
      content: [
        "These terms are governed by the laws of the Federal Republic of Nigeria.",
        "Any disputes shall be resolved in the courts of Benin City, Nigeria.",
        "We reserve the right to modify these terms at any time.",
        "Continued use of our services constitutes acceptance of modified terms.",
        "If any provision is found unenforceable, remaining provisions remain in effect."
      ]
    }
  ];

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
              <FileCheck className="w-16 h-16 mx-auto mb-4 text-orange-400" />
            </motion.div>
            <motion.h1 
              variants={fadeUp} 
              custom={1}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Terms of Service
            </motion.h1>
            <motion.p 
              variants={fadeUp} 
              custom={2}
              className="text-stone-300 text-lg"
            >
              Please read these terms carefully before using our website and services.
            </motion.p>
            <motion.p 
              variants={fadeUp} 
              custom={3}
              className="text-stone-400 text-sm mt-4"
            >
              Last Updated: April 2026 | Effective Date: April 2026
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
                <AlertCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
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
              {termsSections.map((section, index) => (
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
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-stone-800 mb-4">
                        {section.title}
                      </h2>
                      <ul className="space-y-2">
                        {section.content.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-stone-600">
                            <span className="text-orange-500 mt-1">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
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
                <p className="text-stone-700">
                  <strong>Email:</strong> thebenedictineacademy@gmail.com
                </p>
                <p className="text-stone-700">
                  <strong>Phone:</strong> +234 705 944 3788
                </p>
                <p className="text-stone-700">
                  <strong>Address:</strong> 37, Old Mechanic Road, Off Siluko Road, Benin City.
                </p>
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