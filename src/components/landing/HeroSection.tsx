"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

export default function HeroSection({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const titleY = useTransform(scrollProgress, [0, 1], [0, -100]);
  const titleOpacity = useTransform(scrollProgress, [0, 0.3], [1, 0]);
  const titleScale = useTransform(scrollProgress, [0, 0.5], [1, 1.2]);

  return (
    <motion.div
      className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6 text-center"
      style={{ y: titleY, opacity: titleOpacity, scale: titleScale }}
    >
      <motion.h1
        className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        HASSAAN
        <br />
        <span className="text-white">SHAH</span>
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-gray-300 max-w-2xl mb-8 leading-relaxed"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      >
        Experience the next generation of performance with our revolutionary laptop series
      </motion.p>

      <motion.button
        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-full hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        Explore Now
      </motion.button>
    </motion.div>
  );
}


