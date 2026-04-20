"use client";

import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function SceneRoot() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll-based transforms
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]); // move down as you scroll
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]); // shrink slightly

  return (
    <motion.div
      className="relative w-full h-full float-wrapper"
      suppressHydrationWarning
      style={{ y, scale }}
    >
      {mounted ? (
        // @ts-expect-error custom element
        <model-viewer
          src="/models/hacker_laptop.glb"
          alt="3D laptop"
          autoplay
          auto-rotate
          rotation-per-second="5deg"
          camera-orbit="-10deg 75deg 2.8m"
          disable-zoom
          interaction-prompt="none"
          touch-action="none"
          style={{ width: "100%", height: "100%", background: "transparent" }}
          environment-image="neutral"
        />
      ) : null}

      <style jsx>{`
        .float-wrapper {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </motion.div>
  );
}
