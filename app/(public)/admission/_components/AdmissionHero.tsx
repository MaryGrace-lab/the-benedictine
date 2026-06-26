"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Search } from "lucide-react";
import Link from "next/link";

export default function AdmissionHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#1B3A5C] via-[#1F4D7B] to-[#0D2B45] text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#ffffff33_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm"
          >
            Admission for 2026/2027 Academic Session is ongoing
          </motion.span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Join{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              The Benedictine Academy
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/80 sm:text-xl">
            Begin your child&apos;s journey of academic excellence and character
            formation. Applications are now open for Pre-Nursery, Nursery, Primary, and
            Secondary School.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/admission/apply">
              <Button
                size="lg"
                className="group bg-amber-500 text-[#1B3A5C] hover:bg-amber-400"
              >
                Start Application
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="#contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Phone className="mr-2 h-4 w-4" />
                Contact Admissions
              </Button>
            </Link>
          </div>

          <div className="mt-5">
            <Link
              href="/admission/track"
              className="inline-flex items-center text-sm text-white/70 transition-colors hover:text-white"
            >
              <Search className="mr-1 h-4 w-4" />
              Already applied? Track your application
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full"
        >
          <path
            d="M0 60V30C240 0 480 0 720 30C960 60 1200 60 1440 30V60H0Z" 
            className="fill-white dark:fill-gray-950"
          />
        </svg>
      </div>
    </section>
  );
}