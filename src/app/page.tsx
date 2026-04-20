"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypewriterEffect from "@/components/TypewriterEffect";
import SystemHack from "@/components/SystemHack";
import UltimateLaptopLanding from "@/components/landing/UltimateLaptopLanding";

export default function Home() {
  const [stage, setStage] = useState<'typewriter' | 'hacking' | 'landing'>('typewriter');
  const [showLanding, setShowLanding] = useState(false);

  // Check for stage query parameter on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stageParam = urlParams.get('stage');
      
      if (stageParam === 'landing') {
        setStage('landing');
        setShowLanding(true);
        // Reset scroll position when entering landing
        window.scrollTo(0, 0);
      }
    }
  }, []);

  const typewriterLines = [
    '> run hassaan.shah',
    '> load hassaan.core....100%',
    '> sound.off()',
    '> boot_sequence: ml_engineer.hassaan',
    '> user: hassaan.shah()',
    '> role_detected: backend.machine_learning.dev',
    '> permissions_granted: data_modeling.engineer',
    '> user_profile: cloud_ml_pipeline.builder',
    '> system_status: ACTIVE',
    '> acquiring_data: hassaan.skills',
    '> loading_portfolio: hassaan.projects',
    '> initializing_interface: hassaan.contact',
  ];

  const handleTypewriterComplete = () => {
    // Typewriter completed, show launch button if needed
  };

  const handleLaunchInterface = () => {
    setStage('hacking');
  };

  const handleHackingComplete = () => {
    setStage('landing');
    setTimeout(() => {
      setShowLanding(true);
      // Reset scroll position when entering landing
      window.scrollTo(0, 0);
    }, 500);
  };

  return (
    <main className="min-h-screen text-terminal-text overflow-hidden">
      {/* Global scroll reset for landing stage */}
      {stage === 'landing' && (
        <style jsx global>{`
          body { overflow: ${showLanding ? 'auto' : 'hidden'}; }
        `}</style>
      )}
      <AnimatePresence mode="wait">
        {/* Stage 1: Typewriter Code Animation */}
        {stage === 'typewriter' && (
          <motion.div
            key="typewriter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-black flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-center px-4"
            >
              <TypewriterEffect
                lines={typewriterLines}
                onComplete={handleTypewriterComplete}
                pauseBetweenLines={200}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              className="text-center px-4"
            >
              <button
                onClick={handleLaunchInterface}
                className="bg-transparent border-2 border-terminal-text text-terminal-text px-6 py-3 sm:px-8 sm:py-4 font-mono text-xs sm:text-sm md:text-base hover:border-terminal-accent hover:text-terminal-accent hover:bg-terminal-accent hover:bg-opacity-10 transition-all duration-300 transform hover:scale-105 active:scale-95 touch-manipulation"
                style={{
                  boxShadow: '0 0 10px rgba(0, 255, 65, 0.3), inset 0 0 10px rgba(0, 255, 65, 0.1)'
                }}
              >
                launch interface
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Stage 2: Immersive System Hacking */}
        {stage === 'hacking' && (
          <motion.div
            key="hacking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative min-h-screen"
          >
            <SystemHack onComplete={handleHackingComplete} />
          </motion.div>
        )}

        {/* Stage 3: Ultimate 3D Laptop Landing */}
        {stage === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: showLanding ? 1 : 0, scale: showLanding ? 1 : 0.95 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
            className="min-h-screen"
          >
            <UltimateLaptopLanding />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}