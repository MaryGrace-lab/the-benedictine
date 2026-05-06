"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, Database, Mail, Cookie, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.1, duration: 0.5 } 
    }),
  };

  const sections = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Information We Collect",
      content: [
        "Personal information (name, email address, phone number, home address)",
        "Academic records and student performance data",
        "Payment and transaction history",
        "Technical data (IP address, browser type, device information)",
        "Communication preferences and correspondence"
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "How We Use Your Information",
      content: [
        "To process admissions and enrollment applications",
        "To communicate school updates, announcements, and emergency notifications",
        "To maintain academic records and generate reports",
        "To process fees and other financial transactions",
        "To improve our educational services and website experience"
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Information Sharing & Disclosure",
      content: [
        "We do not sell or rent personal information to third parties",
        "Information may be shared with teachers and staff for educational purposes",
        "We may disclose information to comply with legal obligations",
        "Third-party service providers (payment processors, cloud storage) under confidentiality agreements"
      ]
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your data",
        "All sensitive information is encrypted during transmission",
        "Regular security audits and updates are performed",
        "Access to personal data is restricted to authorized personnel only"
      ]
    },
    {
      icon: <Cookie className="w-6 h-6" />,
      title: "Cookies & Tracking",
      content: [
        "We use cookies to enhance website functionality and user experience",
        "Analytics cookies help us understand how visitors use our site",
        "You can disable cookies through your browser settings",
        "Essential cookies cannot be disabled as they enable core site functions"
      ]
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Request corrections to inaccurate data",
        "Request deletion of your data (subject to legal retention requirements)",
        "Opt-out of marketing communications",
        "Data portability in a structured format"
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
              <FileText className="w-16 h-16 mx-auto mb-4 text-orange-400" />
            </motion.div>
            <motion.h1 
              variants={fadeUp} 
              custom={1}
              className="text-3xl md:text-5xl font-bold mb-4"
            >
              Privacy Policy
            </motion.h1>
            <motion.p 
              variants={fadeUp} 
              custom={2}
              className="text-stone-300 text-lg"
            >
              Your privacy matters to us. Learn how we collect, use, and protect your information.
            </motion.p>
            <motion.p 
              variants={fadeUp} 
              custom={3}
              className="text-stone-400 text-sm mt-4"
            >
              Last Updated: April 2026
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
              {sections.map((section, index) => (
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