"use client";

import { motion } from "framer-motion";
import { admissionSteps } from "../_data";
import {
  UserPlus,
  ClipboardList,
  Upload,
  CreditCard,
  Pencil,
  Users,
  Award,
  CheckCircle,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  UserPlus,
  ClipboardList,
  Upload,
  CreditCard,
  Pencil,
  Users,
  Award,
  CheckCircle,
};

export default function AdmissionProcess() {
  return (
    <section className="bg-white py-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#1B3A5C] sm:text-4xl">
            Admission Process
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Our streamlined admission process makes it easy to enroll your child.
            Follow these steps to get started.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {admissionSteps.map((step, index) => {
            const Icon = iconMap[step.icon] || ClipboardList;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-amber-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="absolute right-4 top-4 text-4xl font-bold text-gray-100 dark:text-gray-800">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-[#1B3A5C]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}