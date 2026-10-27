"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, FileText, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FeesInfo() {
  return (
    <section className="bg-white py-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <Badge className="mb-4 bg-amber-100 text-amber-700">2026/2027</Badge>
          <h2 className="text-3xl font-bold tracking-tight text-[#1B3A5C] sm:text-4xl">
            School Fees
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Detailed fee structure will be provided upon inquiry. Contact our
            admission office for the complete fee schedule.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Tuition Fee",
              description:
                "Termly tuition varies by class level. Includes learning materials.",
              amount: "Varies by Class",
              icon: Info,
            },
            {
              title: "Other Fees",
              description:
                "Uniforms, extracurricular activities, etc.",
              amount: "Contact Administration for Details",
              icon: HelpCircle,
            },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border-gray-200 transition-all hover:shadow-md dark:border-gray-800">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <item.icon className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1B3A5C]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                  <p className="mt-4 text-xl font-bold text-amber-600">
                    {item.amount}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link href="#contact">
            <Button
              variant="outline"
              className="border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#1B3A5C] hover:text-white"
            >
              Request Fee Schedule
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}