"use client";

import React, { useState, useEffect } from "react";
import { motion, useTransform, MotionValue, AnimatePresence } from "framer-motion";
import InteractivePixelPortrait from "../InteractivePixelPortrait";

export default function StageUI({ scroll }: { scroll: MotionValue<number> }) {
  const t = scroll; // 0..1
  const [isMobile, setIsMobile] = useState(false);
  
  // Interactive portrait states
  const [isHovering, setIsHovering] = useState(false);

  // Enhanced mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
      console.log('Mobile detection:', { 
        width: window.innerWidth, 
        isMobile: isMobileDevice,
        userAgent: navigator.userAgent 
      });
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🌌 LAYERED 3D SPACE SYSTEM - TRULY SEPARATE SPACES
  // LAPTOP SPACE: Z-depth -8 to -5 (BACKGROUND)
  // TEXT SPACE: Z-depth +5 to +10 (FOREGROUND)
  
  // PAGE 1: Hero (0-25%) - Text in FOREGROUND SPACE
  const page1Opacity = useTransform(t, [0.0, 0.05, 0.2, 0.25], [0, 1, 1, 0]);
  const page1Scale = useTransform(t, [0.0, 0.1, 0.2], [0.8, 1.1, 1.0]);
  const page1Z = useTransform(t, [0.0, 0.1, 0.2], [15, 8, 8]); // FOREGROUND SPACE
  const page1Y = useTransform(t, [0.0, 0.1, 0.2], [0, 0, 0]); // Center vertically
  
  // PAGE 2: Explorer (25-50%) - Text in FOREGROUND SPACE
  const page2Opacity = useTransform(t, [0.2, 0.25, 0.45, 0.5], [0, 1, 1, 0]);
  const page2X = useTransform(t, [0.2, 0.25, 0.5], [200, 0, 0]); // FAR RIGHT
  const page2Y = useTransform(t, [0.2, 0.25, 0.5], [0, 0, 0]); // Center vertically
  const page2Z = useTransform(t, [0.2, 0.25, 0.5], [15, 8, 8]); // FOREGROUND SPACE
  
  // PAGE 3: Creator (50-75%) - Text in FOREGROUND SPACE
  const page3Opacity = useTransform(t, [0.45, 0.5, 0.7, 0.75], [0, 1, 1, 0]);
  const page3X = useTransform(t, [0.45, 0.5, 0.75], [-200, 0, 0]); // FAR LEFT
  const page3Y = useTransform(t, [0.45, 0.5, 0.75], [0, 0, 0]); // Center vertically
  const page3Z = useTransform(t, [0.45, 0.5, 0.75], [15, 8, 8]); // FOREGROUND SPACE
  
  // PAGE 4: Visionary (75-100%) - Text in FOREGROUND SPACE
  const page4Opacity = useTransform(t, [0.7, 0.75, 0.95, 1.0], [0, 1, 1, 0]);
  const page4X = useTransform(t, [0.7, 0.75, 1.0], [200, 0, 0]); // FAR RIGHT
  const page4Y = useTransform(t, [0.7, 0.75, 1.0], [0, 0, 0]); // Center vertically
  const page4Z = useTransform(t, [0.7, 0.75, 1.0], [15, 8, 8]); // FOREGROUND SPACE

  return (
    <div className="pointer-events-none fixed inset-0 z-30 flex items-center justify-center">
      {/* VISUAL BOUNDARY - Separates BACKGROUND and FOREGROUND spaces */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent pointer-events-none" 
           style={{ zIndex: 5 }} />
      
      {/* BACKGROUND SPACE INDICATOR - Hidden on mobile */}
      <div className="absolute top-4 left-4 text-white/30 text-xs font-mono pointer-events-none hidden sm:block"
           style={{ zIndex: 1 }}>
        BACKGROUND SPACE (Z: -8 to -5)
      </div>
      
      {/* FOREGROUND SPACE INDICATOR - Hidden on mobile */}
      <div className="absolute top-4 right-4 text-white/30 text-xs font-mono pointer-events-none hidden sm:block"
           style={{ zIndex: 20 }}>
        FOREGROUND SPACE (Z: +8 to +15)
      </div>
      {/* PAGE 1: HERO ENTRANCE - "The Journey Begins" - Properly Fixed */}
      <motion.div
        style={{
          opacity: page1Opacity,
          scale: page1Scale,
          z: page1Z,
          y: page1Y,
          // Mobile-specific positioning - extra wide and very short, moved down more
          ...(isMobile ? {
            position: 'absolute',
            left: '2%',
            top: '65%',
            transform: 'translateY(-50%)',
            width: '96%',
            maxWidth: '400px'
          } : {})
        }}
        className={isMobile ? "absolute" : "absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-[96%] sm:w-[80%] max-w-lg px-1 sm:px-0"}
      >
        <motion.div 
          className="pointer-events-auto bg-gradient-to-br from-blue-500/15 to-purple-500/15 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{
            ...(isMobile ? {
              padding: '8px 12px',
              boxShadow: '0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
              border: '2px solid rgba(59, 130, 246, 0.4)'
            } : {})
          }}
        >
          <motion.h2 
            className="text-white text-lg sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight text-center sm:text-left cursor-pointer select-none relative touch-manipulation"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              textShadow: "0 0 20px rgba(59, 130, 246, 0.8)"
            }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsHovering(true);
              console.log('🔥 Meet Hassan touched! Opening portrait...');
              // Set navigation flag for normal navigation
              sessionStorage.setItem('portrait_navigation', 'true');
              window.location.href = '/portrait1';
            }}
            onTouchEnd={() => setIsHovering(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('🔥 Meet Hassan clicked! Opening portrait...');
              // Set navigation flag for normal navigation
              sessionStorage.setItem('portrait_navigation', 'true');
              window.location.href = '/portrait1';
            }}
            style={{
              ...(isMobile ? {
                marginBottom: '4px'
              } : {}),
              filter: isHovering ? 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.6))' : 'none',
              WebkitTouchCallout: 'none',
              WebkitUserSelect: 'none',
              userSelect: 'none',
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Meet Hassan
            {isHovering && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-2 text-green-400 text-sm sm:text-lg md:text-xl"
              >
                [Click to explore]
              </motion.span>
            )}
            </motion.h2>
            
                    {/* Mobile instruction */}
                    {isMobile && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="text-center"
                        style={{ marginTop: '2px' }}
                      >
                        <p className="text-blue-300 text-xs animate-pulse">
                          👆 Tap to explore portrait
                        </p>
                      </motion.div>
                    )}
            
            <motion.p 
              className="text-gray-200 text-xs sm:text-base leading-relaxed mb-3 text-center sm:text-left"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            A passionate Software Engineering student on a mission to build the future, one line of code at a time.
          </motion.p>
        </motion.div>
        
        {/* Hover Preview Effects */}
        {isHovering && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Subtle matrix rain effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-green-500/10 to-transparent" />
            
            {/* Floating particles */}
            <div className="absolute inset-0">
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 2,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-radial from-green-400/20 via-transparent to-transparent" />
          </motion.div>
        )}
      </motion.div>

      {/* PAGE 2: EXPLORER - "Exploring Possibilities" - Enhanced Mobile */}
      <motion.div
        style={{ 
          opacity: page2Opacity,
          x: page2X,
          y: page2Y,
          z: page2Z,
          scale: useTransform(t, [0.2, 0.25, 0.5], [0.8, 1, 0.9]),
          // Mobile-specific positioning to avoid laptop overlap
          ...(isMobile && {
            top: '65%',
            transform: 'translateY(-50%)'
          })
        }}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-[96%] sm:w-[80%] max-w-lg px-1 sm:px-0"
      >
        <motion.div 
          className="pointer-events-auto bg-gradient-to-br from-green-500/15 to-teal-500/15 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.h3 
            className="text-white text-lg sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent leading-tight text-center sm:text-left"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The Explorer
          </motion.h3>
          <motion.p 
            className="text-gray-200 text-xs sm:text-base leading-relaxed mb-3 text-center sm:text-left"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Currently pursuing Software Engineering, Hassan is constantly exploring new technologies and pushing the boundaries of what's possible.
          </motion.p>
          <motion.div 
            className="flex flex-wrap gap-1 sm:gap-2 justify-center sm:justify-start"
            initial={{ x: 30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="px-2 sm:px-3 py-1 bg-blue-500/25 text-blue-300 rounded-full text-xs sm:text-sm font-medium">React</span>
            <span className="px-2 sm:px-3 py-1 bg-purple-500/25 text-purple-300 rounded-full text-xs sm:text-sm font-medium">TypeScript</span>
            <span className="px-2 sm:px-3 py-1 bg-green-500/25 text-green-300 rounded-full text-xs sm:text-sm font-medium">Node.js</span>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* PAGE 3: CREATOR - "The Code Comes Alive" - Enhanced Mobile */}
      <motion.div
        style={{ 
          opacity: page3Opacity,
          x: page3X,
          y: page3Y,
          z: page3Z,
          scale: useTransform(t, [0.45, 0.5, 0.75], [0.8, 1, 0.9]),
          // Mobile-specific positioning to avoid laptop overlap
          ...(isMobile && {
            top: '65%',
            transform: 'translateY(-50%)'
          })
        }}
        className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-[96%] sm:w-[80%] max-w-lg px-1 sm:px-0"
      >
        <motion.div 
          className="pointer-events-auto bg-gradient-to-br from-orange-500/15 to-red-500/15 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.h3 
            className="text-white text-lg sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent leading-tight text-center sm:text-left"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The Creator
          </motion.h3>
          <motion.p 
            className="text-gray-200 text-xs sm:text-base leading-relaxed mb-3 text-center sm:text-left"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            From full-stack web applications to mobile apps, Hassan brings ideas to life through clean, efficient code and innovative solutions.
          </motion.p>
          <motion.div 
            className="text-xs sm:text-sm text-gray-400 text-center sm:text-left italic"
            initial={{ x: -30, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            "Code is poetry written in logic"
          </motion.div>
        </motion.div>
      </motion.div>

      {/* PAGE 4: VISIONARY - "Building the Future" - Enhanced Mobile */}
      <motion.div
        style={{ 
          opacity: page4Opacity,
          x: page4X,
          y: page4Y,
          z: page4Z,
          scale: useTransform(t, [0.7, 0.75, 1.0], [0.8, 1, 0.9]),
          // Mobile-specific positioning to avoid laptop overlap
          ...(isMobile && {
            top: '65%',
            transform: 'translateY(-50%)'
          })
        }}
        className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-[96%] sm:w-[80%] max-w-lg px-1 sm:px-0"
      >
        <motion.div 
          className="pointer-events-auto bg-gradient-to-br from-purple-500/15 to-pink-500/15 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.h3 
            className="text-white text-lg sm:text-3xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight text-center sm:text-left"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            The Visionary
          </motion.h3>
          <motion.p 
            className="text-gray-200 text-xs sm:text-base leading-relaxed mb-3 text-center sm:text-left"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            With a keen eye for detail and a passion for innovation, Hassan focuses on creating solutions that not only work but inspire and delight users.
          </motion.p>
          <motion.div 
            className="flex justify-center"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-base sm:text-2xl">🚀 💻 ⚡</div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Removed CTA card for cleaner experience */}
      
    </div>
  );
}
