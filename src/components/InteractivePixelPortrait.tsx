'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

// =======================================================
// 🎥 Utility: Easing Functions
// =======================================================
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// =======================================================
// 🎥 Types for Pixel State
// =======================================================
interface Pixel {
  visible: boolean;
  brightness: number;
  baseGreenIntensity: number;
  phase: number;
  originalX: number;
  originalY: number;
  currentX: number;
  currentY: number;
  velocityX: number;
  velocityY: number;
  offsetX: number;
  offsetY: number;
  delay: number;
}

// =======================================================
// 🎥 Main Interactive Pixel Portrait Component
// =======================================================
const InteractivePixelPortrait = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [imageLoaded, setImageLoaded] = useState(false);

  // Pixels stored in a ref instead of React state
  const pixelDataRef = useRef<Pixel[][]>([]);

  // Explosion / Implosion states
  const isExplodingRef = useRef(false);
  const isImplodingRef = useRef(false);

  const animationRef = useRef<number>();
  const explosionStartRef = useRef<number | null>(null);
  const implosionStartRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  // Config
  const explosionDuration = 1500; // ms
  const implosionDuration = 1500; // ms
  const scatterDistance = 120; // Reduced for rectangle container
  const dotSize = 2.4;
  const spacing = 4;
  const margin = 50; // Reduced margin for rectangle container

  // =======================================================
  // 🎥 Step 1: Process Image into Pixel Grid
  // =======================================================
  const processImage = useCallback(() => {
    const hiddenCanvas = hiddenCanvasRef.current;
    if (!hiddenCanvas) return;

    const ctx = hiddenCanvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();

    img.onload = () => {
      // Mobile-optimized dimensions
      const isMobile = window.innerWidth < 768;
      const maxDimension = isMobile ? 120 : 150;
      let targetWidth = img.naturalWidth;
      let targetHeight = img.naturalHeight;

      if (targetWidth > targetHeight) {
        targetHeight = Math.round(targetHeight * (maxDimension / targetWidth));
        targetWidth = maxDimension;
      } else {
        targetWidth = Math.round(targetWidth * (maxDimension / targetHeight));
        targetHeight = maxDimension;
      }

      hiddenCanvas.width = targetWidth;
      hiddenCanvas.height = targetHeight;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imageData.data;

      const processedPixels: Pixel[][] = [];

      for (let y = 0; y < targetHeight; y++) {
        const row: Pixel[] = [];
        for (let x = 0; x < targetWidth; x++) {
          const index = (y * targetWidth + x) * 4;
          const r = pixels[index];
          const g = pixels[index + 1];
          const b = pixels[index + 2];
          const a = pixels[index + 3];

          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
          const isVisible = a > 30 && brightness > 0.05;

          if (isVisible) {
            const contrastFactor = 1.4;
            const enhancedBrightness = Math.min(
              1,
              Math.max(0, (brightness - 0.5) * contrastFactor + 0.5)
            );

            const greenIntensity = Math.floor(enhancedBrightness * 255);

            const centerX = targetWidth / 2;
            const centerY = targetHeight / 2;
            const dx = x - centerX;
            const dy = y - centerY;
            const angle = Math.atan2(dy, dx);

            const velocityMagnitude =
              scatterDistance * (0.5 + Math.random() * 0.5);
            const velocityX = Math.cos(angle) * velocityMagnitude;
            const velocityY = Math.sin(angle) * velocityMagnitude;

            row.push({
              visible: true,
              brightness: enhancedBrightness,
              baseGreenIntensity: greenIntensity,
              phase: Math.random() * Math.PI * 2,
              originalX: x,
              originalY: y,
              currentX: x,
              currentY: y,
              velocityX,
              velocityY,
              offsetX: 0,
              offsetY: 0,
              delay: Math.random() * 0.25,
            });
          } else {
            row.push({
              visible: false,
              brightness: 0,
              baseGreenIntensity: 0,
              phase: 0,
              originalX: x,
              originalY: y,
              currentX: x,
              currentY: y,
              velocityX: 0,
              velocityY: 0,
              offsetX: 0,
              offsetY: 0,
              delay: 0,
            });
          }
        }
        processedPixels.push(row);
      }

      pixelDataRef.current = processedPixels;
      setImageLoaded(true);

      // Resize canvas
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = targetWidth * spacing + margin * 2;
        canvas.height = targetHeight * spacing + margin * 2;
      }
    };

    img.onerror = () => {
      console.error('❌ Failed to load image');
    };

    img.src = '/images/portrait/babe-.png';
    img.crossOrigin = 'anonymous';
  }, []);

  // =======================================================
  // 🎥 Step 2: Handlers
  // =======================================================
  const handleMouseEnter = () => {
    isExplodingRef.current = true;
    isImplodingRef.current = false;
    explosionStartRef.current = performance.now();
  };

  const handleMouseLeave = () => {
    isExplodingRef.current = false;
    isImplodingRef.current = true;
    implosionStartRef.current = performance.now();
  };

  // =======================================================
  // 🎥 Step 3: Animation Loop
  // =======================================================
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timeRef.current += 1;
    const now = performance.now();

    const pixels = pixelDataRef.current;

    for (let y = 0; y < pixels.length; y++) {
      for (let x = 0; x < pixels[y].length; x++) {
        const pixel = pixels[y][x];
        if (!pixel.visible) continue;

        let t = 0;
        if (isExplodingRef.current && explosionStartRef.current !== null) {
          const elapsed = now - explosionStartRef.current;
          t = clamp(elapsed / explosionDuration - pixel.delay, 0, 1);
          const eased = easeOutExpo(t);
          pixel.offsetX = pixel.velocityX * eased;
          pixel.offsetY = pixel.velocityY * eased;
        } else if (isImplodingRef.current && implosionStartRef.current !== null) {
          const elapsed = now - implosionStartRef.current;
          t = clamp(elapsed / implosionDuration - pixel.delay, 0, 1);
          const eased = easeInOutCubic(t);
          pixel.offsetX = pixel.velocityX * (1 - eased);
          pixel.offsetY = pixel.velocityY * (1 - eased);
        }

        pixel.currentX = pixel.originalX + pixel.offsetX;
        pixel.currentY = pixel.originalY + pixel.offsetY;

        // === Draw pixel with depth-aware shading ===
        const drawX = margin + pixel.currentX * spacing + spacing / 2;
        const drawY = margin + pixel.currentY * spacing + spacing / 2;

        const breathingSpeed = 0.003;
        const breathingIntensity = 0.15;
        const breathingOffset =
          Math.sin(timeRef.current * breathingSpeed + pixel.phase) *
          breathingIntensity;

        // Depth-aware brightness mapping
        const shadowGamma = 0.8; // punchier shadows
        const highlightGamma = 1.4; // softer brights
        const adjusted =
          pixel.brightness < 0.4
            ? Math.pow(pixel.brightness, shadowGamma)
            : Math.pow(pixel.brightness, highlightGamma);

        // Add subtle sparkle in darks
        const sparkle =
          pixel.brightness < 0.35 ? Math.random() * 20 : Math.random() * 5;

        // Final green intensity
        const depthGreen = Math.floor(
          Math.max(
            0,
            Math.min(
              255,
              pixel.baseGreenIntensity * adjusted +
                breathingOffset * 40 +
                sparkle
            )
          )
        );

        // Map darks → black/green mix
        const shadowFactor = 1 - pixel.brightness;
        const r = Math.floor(depthGreen * 0.2 * (1 - shadowFactor));
        const g = depthGreen;
        const b = Math.floor(depthGreen * 0.3 * (1 - shadowFactor));

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [imageLoaded]);

  // =======================================================
  // 🎥 Step 4: Effects
  // =======================================================
  useEffect(() => {
    processImage();
  }, [processImage]);

  useEffect(() => {
    if (imageLoaded) {
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animate, imageLoaded]);

  // =======================================================
  // 🎥 Step 5: Render JSX
  // =======================================================
  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <div
        ref={containerRef}
        className="relative cursor-pointer transition-all duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{ 
          width: '100%',
          height: '100%',
          maxWidth: '600px',
          maxHeight: '600px'
        }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full h-full"
          style={{ 
            imageRendering: 'pixelated',
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            background: 'transparent'
          }}
        />
        <canvas ref={hiddenCanvasRef} style={{ display: 'none' }} />
        
        {/* Loading indicator */}
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default InteractivePixelPortrait;