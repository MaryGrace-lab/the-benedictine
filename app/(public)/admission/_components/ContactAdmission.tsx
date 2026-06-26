"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ContactAdmission() {
  return (
    <section id="contact" className="bg-white py-20 dark:bg-gray-950">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-[#1B3A5C] sm:text-4xl">
            Contact Admissions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Have questions? Our admission team is here to help you through the
            process.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Phone,
              title: "Phone",
              info: "+234 800 000 0000",
              sub: "Mon-Fri, 8am-4pm",
            },
            {
              icon: Mail,
              title: "Email",
              info: "admissions@benedictineacademy.edu.ng",
              sub: "We reply within 24hrs",
            },
            {
              icon: MapPin,
              title: "Location",
              info: "Visit Campus",
              sub: "City, State, Nigeria",
            },
            {
              icon: Clock,
              title: "Hours",
              info: "Mon - Fri",
              sub: "8:00 AM - 4:00 PM",
            },
          ].map((item) => (
            <Card key={item.title} className="h-full">
              <CardContent className="flex flex-col items-center p-5 text-center">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <item.icon className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-[#1B3A5C]">{item.title}</h3>
                <p className="break-all text-sm text-gray-700">{item.info}</p>
                <p className="mt-1 text-xs text-gray-500">{item.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA to Contact Page */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="mb-4 text-sm text-gray-500">
            For detailed inquiries, visit our full contact page.
          </p>
          <Link href="/contact">
            <Button className="bg-[#1B3A5C] hover:bg-[#1F4D7B]">
              Go to Contact Page
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}