"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

export default function FeatureSection({
  title,
  description,
  features,
  index,
  scrollProgress
}: {
  title: string;
  description: string;
  features: { icon: string; title: string; description: string }[];
  index: number;
  scrollProgress: MotionValue<number>;
}) {
  const sectionY = useTransform(scrollProgress, [index * 0.2, (index + 1) * 0.2], [100, -100]);
  const sectionOpacity = useTransform(
    scrollProgress,
    [index * 0.2 - 0.1, index * 0.2, (index + 1) * 0.2, (index + 1) * 0.2 + 0.1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      className="relative z-20 min-h-screen flex items-center justify-center px-6"
      style={{ y: sectionY, opacity: sectionOpacity }}
    >
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-5xl md:text-7xl font-black text-white mb-8 text-center"
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {title}
        </motion.h2>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 text-center mb-12 max-w-3xl mx-auto"
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {description}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, featureIndex) => (
            <motion.div
              key={featureIndex}
              className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: featureIndex * 0.1 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}


