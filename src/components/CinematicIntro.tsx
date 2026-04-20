'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TypewriterEffect from './TypewriterEffect';
import MatrixStream from './MatrixStream';

interface CinematicIntroProps {
  onComplete: () => void;
  typewriterDuration?: number;
  matrixDuration?: number;
  totalDuration?: number;
}

const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  typewriterDuration = 3000,
  matrixDuration = 4000,
  totalDuration = 7000,
}) => {
  const [phase, setPhase] = useState<'typewriter' | 'matrix' | 'complete'>('typewriter');
  const [showMatrix, setShowMatrix] = useState(false);

  const typewriterLines = [
    '> boot_sequence: ml_engineer.hassaan',
    '> user: hassaan.shah()',
    '> role_detected: backend.machine_learning.dev',
    '> permissions_granted: data_modeling.engineer',
    '> user_profile: cloud_ml_pipeline.builder',
    '> system_status: ACTIVE',
    '> acquiring_data: hassaan.skills',
    '> loading_portfolio: hassaan.projects',
    '> initializing_interface: hassaan.contact',
    '> boot_sequence: hassaan.about',
    '> system_status: ACTIVE',
    '> acquiring_data: hassaan.history',
    '> incoming transmission detected',
    '> failed to validate identity',
    '> transmission channel validation failed',
    '> transmission channel insecure',
    '> retrying signal identity validation',
    '> accept transmission',
    '> boot_sequence: hassaan.connect',
    '> system_status: ACTIVE',
    '> acquiring_data: hassaan.secure.mail',
    '> boot_sequence: hassaan.connect',
    '> system_status: ACTIVE',
    '> acquiring_data: hassaan.incoming.transmission',
    '> incoming transmission detected',
    '> failed to validate identity',
    '> transmission channel validation failed',
    '> transmission channel insecure',
    '> retrying signal identity validation',
    '> accept transmission',
  ];

  const handleTypewriterComplete = () => {
    setPhase('matrix');
    setShowMatrix(true);
  };

  const handleMatrixComplete = () => {
    setPhase('complete');
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  useEffect(() => {
    // Fallback timer to ensure animation completes
    const fallbackTimer = setTimeout(() => {
      onComplete();
    }, totalDuration);

    return () => clearTimeout(fallbackTimer);
  }, [onComplete, totalDuration]);

  return (
    <AnimatePresence>
      {phase !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="cinematic-overlay"
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {phase === 'typewriter' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto px-8"
              >
                <div className="text-center mb-8">
                  <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-4xl md:text-6xl font-bold text-terminal-accent mb-4"
                  >
                    Hassaan Shah
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="text-terminal-text text-lg md:text-xl"
                  >
                    ML Engineer • Developer • Data Engineer • Curious Human
                  </motion.div>
                </div>
                
                <TypewriterEffect
                  lines={typewriterLines}
                  onComplete={handleTypewriterComplete}
                  speed={30}
                  pauseBetweenLines={200}
                />
              </motion.div>
            )}

            {showMatrix && phase === 'matrix' && (
              <MatrixStream
                onComplete={handleMatrixComplete}
                duration={matrixDuration}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CinematicIntro;

