// components/ui/LogoShowcase.tsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function LogoShowcase() {
  return (
    <section className="py-16 md:py-28 bg-white overflow-hidden lg:hidden">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="inline-block"
        >
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{
              duration: 2.8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 0.3,
            }}
            className="relative w-48 h-48 sm:w-56 sm:h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 mx-auto"
          >
            <Image
              src="/logo.jpg"
              alt="The Benedictine Academy Logo"
              fill
              loading="lazy"
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, (max-width: 1024px) 288px, 320px"
              priority={false}
            />
            <motion.div
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#eab308]/30 to-transparent skew-x-12"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-[#1B3A5C] tracking-tight">
            Excellence &amp; Character
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-md mx-auto">
            Building a legacy of holistic education since 2017
          </p>
        </motion.div>
      </div>
    </section>
  );
}