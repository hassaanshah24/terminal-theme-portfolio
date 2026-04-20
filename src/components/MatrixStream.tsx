'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MatrixStreamProps {
  onComplete: () => void;
  duration?: number;
}

const MatrixStream: React.FC<MatrixStreamProps> = ({
  onComplete,
  duration = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isActive, setIsActive] = useState(true);

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
  const matrixChars = characters.split('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix rain effect with enhanced chaos
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    const speeds: number[] = [];
    const opacities: number[] = [];

    // Initialize drops with random properties
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * canvas.height;
      speeds[i] = Math.random() * 3 + 1; // Random speed between 1-4
      opacities[i] = Math.random() * 0.8 + 0.2; // Random opacity between 0.2-1
    }

    const draw = () => {
      // Black background with fade effect
      ctx.fillStyle = 'rgba(0, 17, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Green text with varying opacity
      ctx.fillStyle = '#00ff00';
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character with occasional special characters
        const charSet = Math.random() > 0.8 ? '01' : matrixChars;
        const text = charSet[Math.floor(Math.random() * charSet.length)];
        
        // Apply opacity
        ctx.globalAlpha = opacities[i];
        
        // Draw character with glow effect
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 5;
        ctx.fillText(text, i * fontSize, drops[i]);
        
        // Reset shadow
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;

        // Reset drop to top randomly with different conditions
        if (drops[i] > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
          speeds[i] = Math.random() * 3 + 1; // New random speed
          opacities[i] = Math.random() * 0.8 + 0.2; // New random opacity
        }

        // Move drop down with variable speed
        drops[i] += speeds[i];
      }

      // Add flying elements from sides occasionally
      if (Math.random() > 0.98) {
        const side = Math.random() > 0.5 ? 'left' : 'right';
        const x = side === 'left' ? 0 : canvas.width;
        const y = Math.random() * canvas.height;
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        ctx.globalAlpha = 0.7;
        ctx.fillText(text, x, y);
        ctx.globalAlpha = 1;
      }
    };

    const animate = () => {
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Complete animation after duration
    const timer = setTimeout(() => {
      setIsActive(false);
      setTimeout(() => {
        onComplete();
      }, 500);
    }, duration);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timer);
    };
  }, [duration, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 z-10"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'linear-gradient(180deg, #001100 0%, #000000 100%)' }}
      />
    </motion.div>
  );
};

export default MatrixStream;