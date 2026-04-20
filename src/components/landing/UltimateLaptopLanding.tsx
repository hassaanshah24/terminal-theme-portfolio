"use client";

import React, { useRef, useEffect, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Scene from "./Scene";
import StageUI from "./StageUI";
import * as THREE from "three";

export default function UltimateLaptopLanding() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection and optimization
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    return smoothProgress.on("change", (v) => setScrollProgress(v));
  }, [smoothProgress]);

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div 
      ref={containerRef} 
      className="relative bg-black overflow-hidden"
      style={{
        // Mobile touch optimization
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black/20 to-blue-900/20"
        style={{ y: backgroundY }}
      />

      {/* 3D Canvas - Mobile Optimized */}
      <div className="fixed inset-0 z-10">
        <Canvas 
          camera={{ 
            position: [0, 1.5, 6], 
            fov: typeof window !== 'undefined' && window.innerWidth < 768 ? 75 : 60 
          }} 
          dpr={[0.5, 2]} // Lower DPR on mobile for better performance
          performance={{ min: 0.5 }} // Performance optimization
          gl={{ 
            antialias: false, // Disable antialiasing on mobile for performance
            alpha: true,
            powerPreference: "high-performance"
          }}
          onError={(error) => {
            console.error('Canvas error:', error);
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="hotpink" />
            </mesh>
          }>
            <Scene scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* Stage-synced UI overlay */}
      <StageUI scroll={smoothProgress} />

      {/* HASSAAN Text - Enhanced Mobile Responsive */}
      <div className="fixed top-2 sm:top-8 left-1/2 -translate-x-1/2 z-40 px-2 sm:px-4">
        <motion.h1 
          className="text-3xl sm:text-6xl md:text-8xl font-black text-white tracking-wider text-center drop-shadow-2xl"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          HASSAAN
        </motion.h1>
      </div>

      {/* Content Sections - Optimized scroll area for swift movements */}
      <div className="relative z-20" style={{ height: "800vh" }}>
        {/* Spacing sections for better card transitions */}
        <div className="h-screen flex items-center justify-center">
          <div className="text-white/10 text-center">
            <div className="w-1 h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto"></div>
          </div>
        </div>
        
        <div className="h-screen flex items-center justify-center">
          <div className="text-white/10 text-center">
            <div className="w-1 h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto"></div>
          </div>
        </div>
        
        <div className="h-screen flex items-center justify-center">
          <div className="text-white/10 text-center">
            <div className="w-1 h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent mx-auto"></div>
          </div>
        </div>

        {/* Final CTA Section - Mobile Optimized */}
        <motion.div
          className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6"
          style={{
            y: useTransform(scrollYProgress, [0.85, 1], [100, 0]),
            opacity: useTransform(scrollYProgress, [0.8, 0.9], [0, 1])
          }}
        >
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              className="text-4xl sm:text-6xl md:text-8xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent leading-tight"
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true }}
            >
              READY TO
              <br />
              TRANSFORM?
            </motion.h2>

            <motion.button
              className="px-8 sm:px-12 py-4 sm:py-6 bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-black text-lg sm:text-xl font-black rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-500 touch-manipulation"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              whileHover={{ scale: 1.1, y: -10 }}
              whileTap={{ scale: 0.95 }}
              viewport={{ once: true }}
            >
              GET YOURS NOW
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator - Mobile Responsive */}
      <motion.div
        className="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-30"
        initial={{ opacity: 1 }}
        animate={{ opacity: scrollProgress < 0.1 ? 1 : 0 }}
      >
        <motion.div
          className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white/30 rounded-full flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1 sm:mt-2" />
        </motion.div>
      </motion.div>
    </div>
  );
}


