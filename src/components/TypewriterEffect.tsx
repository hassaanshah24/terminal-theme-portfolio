'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
  lines: string[];
  onComplete: () => void;
  speed?: number;
  pauseBetweenLines?: number;
  className?: string;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  lines,
  onComplete,
  speed = 50,
  pauseBetweenLines = 800,
  className = '',
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false);
      setTimeout(() => {
        onComplete();
      }, 1000);
      return;
    }

    const currentLine = lines[currentLineIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex < currentLine.length) {
        setCurrentText(currentLine.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
          setCurrentText('');
        }, pauseBetweenLines);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [currentLineIndex, lines, speed, pauseBetweenLines, onComplete]);

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {lines.slice(0, currentLineIndex).map((line, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="text-sm md:text-base"
        >
          {line}
          {line.includes('load hassaan.core....100%') && (
            <span className="inline-block w-2 h-2 bg-terminal-accent ml-2" style={{
              boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88'
            }} />
          )}
        </motion.div>
      ))}
      
      {isTyping && currentLineIndex < lines.length && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm md:text-base"
        >
          {currentText}
          {lines[currentLineIndex]?.includes('load hassaan.core....100%') && currentText.includes('100%') && (
            <span className="inline-block w-2 h-2 bg-terminal-accent ml-2" style={{
              boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88'
            }} />
          )}
          <span className="terminal-cursor ml-1" />
        </motion.div>
      )}
    </div>
  );
};

export default TypewriterEffect;