'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemHackProps {
  onComplete: () => void;
}

const SystemHack = ({ onComplete }: SystemHackProps) => {
  // ===== STATES =====
  const [currentPhase, setCurrentPhase] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showMatrix, setShowMatrix] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isCompromised, setIsCompromised] = useState(false);
  const [shake, setShake] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const [zoomGlitch, setZoomGlitch] = useState(false);
  
  // Terminal state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  
  // MATRIX VARIABLES
  const columnsRef = useRef<number[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const fontSize = 16;

  // ===== MATRIX SYSTEM =====
  const initializeMatrix = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const width = canvas.width;
    const columns = Math.floor(width / fontSize);
    columnsRef.current = new Array(columns).fill(0);
  };

  const drawMatrix = () => {
    if (!canvasRef.current || !ctxRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;

    ctx.fillStyle = 'rgba(0,0,0,0.08)'; // increased fade for more subtle effect
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = currentPhaseData.color;
    ctx.globalAlpha = 0.3; // reduced opacity for matrix characters
    ctx.font = `${fontSize}px monospace`;

    columnsRef.current.forEach((y, x) => {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      ctx.fillText(text, x * fontSize, y * fontSize);
      if (y * fontSize > canvas.height && Math.random() > 0.975) columnsRef.current[x] = 0;
      else columnsRef.current[x] += 1;
    });
    
    ctx.globalAlpha = 1; // reset alpha
  };


  // ===== STORY PHASES =====
  const storyPhases = [
    {
      title: 'ACCESSING SYSTEM',
      subtitle: 'Loading Hassaan\'s Portfolio...',
      color: '#00ff41',
      bgGradient: 'linear-gradient(180deg, #000000 0%, #001100 50%, #000000 100%)',
      lines: [
        '> boot_sequence: hassaan.portfolio.init',
        '> user: Hassaan Sohail Khan',
        '> role_detected: Full-Stack Developer | AI/ML | Software Engineer',
        '> university: DHA Suffa University',
        '> skills: C++, C#, Python, Django, React, Next.js, AI/ML',
        '> system_status: ACTIVE',
        '> initializing subsystems...',
        '> loading project cache...',
        '> memory_check: OK',
        '> CPU load: 15%',
        '> network_check: OK'
      ]
    },
    {
      title: 'ESTABLISHING CONNECTION...',
      subtitle: 'Encrypting portfolio data streams...',
      color: '#00aaff',
      bgGradient: 'linear-gradient(180deg, #000000 0%, #000822 50%, #000000 100%)',
      lines: [
        '> handshake_protocol: TLS_1.3',
        '> encryption_algorithm: AES-256',
        '> streaming hassaan.projects & hassaan.skills...',
        '> connection_established: SUCCESS',
        '> initializing interactive interface...',
        '> system check complete',
        '> warning: unknown packet detected',
        '> firewall check passed',
        '> intrusion_simulation: START'
      ]
    },
    {
      title: 'ACCESSING DATA STREAMS...',
      subtitle: 'Loading coding projects & ML models...',
      color: '#ffaa00',
      bgGradient: 'linear-gradient(180deg, #000000 0%, #221100 50%, #000000 100%)',
      lines: [
        '> project_1: ML_Pipeline',
        '> project_2: AI_Chatbot',
        '> project_3: WebApp_Inventory',
        '> parsing languages: C++, C#, Python, JavaScript',
        '> loading frameworks: Django, React, Next.js',
        '> data integrity check: PASSED',
        '> system logs: streaming...',
        '> pseudo-random anomalies detected',
        '> anomaly_code: 0xFA12'
      ]
    },
    {
      title: 'DETECTING INTRUSION...',
      subtitle: 'Simulating hacking security protocols...',
      color: '#ff4444',
      bgGradient: 'linear-gradient(180deg, #000000 0%, #220000 50%, #000000 100%)',
      lines: [
        '> ALERT: Unauthorized access attempt detected',
        '> CRITICAL: Firewall protocols engaged',
        '> ERROR: Memory allocation stress test',
        '> FAILURE: Attempted breach neutralized',
        '> SYSTEM: Engaging countermeasures...',
        '> glitch_detected: screen jitter',
        '> security_breach: simulated',
        '> emergency_protocols activated'
      ]
    },
    {
      title: 'SYSTEM COMPROMISED',
      subtitle: 'Emergency shutdown simulation...',
      color: '#ff0000',
      bgGradient: 'linear-gradient(180deg, #000000 0%, #1a0000 50%, #000000 100%)',
      lines: [
        '> CRITICAL: Kernel panic imminent',
        '> ERROR: Memory allocation failed',
        '> WARNING: Buffer overflow detected',
        '> ALERT: Unauthorized data access blocked',
        '> FAILURE: Security protocols offline',
        '> SYSTEM: Emergency shutdown initiated...',
        '> terminal_glitch: display distortion',
        '> reboot_required: YES'
      ]
    }
  ];

  const animate = () => {
    drawMatrix();
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
    initializeMatrix();
  };

  // ===== EFFECTS =====
  useEffect(() => {
    ctxRef.current = canvasRef.current?.getContext('2d') || null;
    handleResize();
    animate();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => setCursorVisible(prev => !prev), 500);
    return () => clearInterval(interval);
  }, []);

  // Phase control
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhase(prev => {
        if (prev < storyPhases.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  // Line animation
  useEffect(() => {
    setCurrentLineIndex(0);
    const interval = setInterval(() => {
      setCurrentLineIndex(prev => {
        const lines = storyPhases[currentPhase]?.lines || [];
        if (prev < lines.length - 1) return prev + 1;
        return prev;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [currentPhase]);

  // Progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) return prev + Math.random() * 4;
        clearInterval(interval);
        return 100;
      });
    }, 70);
    return () => clearInterval(interval);
  }, []);

  // Complete with MIND-BOGGLING Zoom Glitch Effect
  useEffect(() => {
    if (currentPhase === storyPhases.length - 1) {
      // Start the INSANE zoom glitch sequence
      const glitchSequence = () => {
        // Phase 1: Start MASSIVE glitching (FAST!)
        setIsGlitching(true);
        setShake(true);
        
        // Phase 2: ZOOM GLITCH CHAOS (VERY FAST!)
        setTimeout(() => {
          setZoomGlitch(true);
          setShake(false);
        }, 300); // MUCH FASTER!
        
        // Phase 3: Complete transition (LIGHTNING FAST!)
        setTimeout(() => {
          onComplete();
        }, 800); // MUCH FASTER!
      };
      
      const timer = setTimeout(glitchSequence, 800); // FASTER START!
      return () => clearTimeout(timer);
    }
  }, [currentPhase, onComplete]);

  // Dynamic phase effects
  useEffect(() => {
    if (currentPhase === 0) { setShowMatrix(true); setIsHacking(false); setIsEncrypting(false); setIsCompromised(false); }
    else if (currentPhase === 1) { setIsEncrypting(true); setIsHacking(false); setIsCompromised(false); }
    else if (currentPhase === 2) { setIsHacking(true); setIsEncrypting(false); setIsCompromised(false); }
    else { setIsCompromised(true); setIsHacking(false); setIsEncrypting(false); setShake(true); setTimeout(() => setShake(false), 300); }
  }, [currentPhase]);

  // ===== TERMINAL HANDLER =====
  const getRandomCodingResponse = () => {
    const responses = [
      ['> Processing...', '> Compiling code...', '> Building project...', '> Dependencies resolved ✓', '> Build successful!'],
      ['> Analyzing codebase...', '> Running linter...', '> Code quality: 94%', '> No issues found ✓'],
      ['> Initializing debugger...', '> Setting breakpoints...', '> Debug session started', '> Ready for debugging'],
      ['> Git status check...', '> Modified files: 3', '> Staged changes: 2', '> Ready to commit'],
      ['> Running tests...', '> Test suite: 47 tests', '> All tests passed ✓', '> Coverage: 89%'],
      ['> Deploying to staging...', '> Build artifacts created', '> Docker container built', '> Deployment successful ✓'],
      ['> Database migration...', '> Schema updated', '> Data integrity check passed', '> Migration complete ✓'],
      ['> API endpoint testing...', '> Response time: 120ms', '> Status: 200 OK', '> All endpoints healthy ✓'],
      ['> Security scan initiated...', '> Vulnerability check...', '> No critical issues found', '> Security scan complete ✓'],
      ['> Performance optimization...', '> Bundle size reduced by 15%', '> Load time improved', '> Optimization complete ✓'],
      ['> Code review in progress...', '> Pull request #42', '> 3 reviewers assigned', '> Review status: Pending'],
      ['> Monitoring system health...', '> CPU usage: 23%', '> Memory: 1.2GB', '> System status: Healthy'],
      ['> Backup process started...', '> Data compressed', '> Backup stored securely', '> Backup complete ✓'],
      ['> Cache invalidation...', '> CDN updated', '> Cache cleared', '> Performance optimized'],
      ['> SSL certificate check...', '> Certificate valid for 89 days', '> Security status: Good', '> SSL check complete ✓']
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleTerminalKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = terminalInput.trim();
      const upper = command.toUpperCase();
      if (upper === 'SHOW PROJECTS') {
        setTerminalOutput(prev => [...prev, `> ${command}`, 'Project 1: ML_Pipeline', 'Project 2: AI_Chatbot', 'Project 3: WebApp_Inventory']);
      } else if (upper === 'MEET HASSAN' || upper === 'SHOW PORTRAIT') {
        setTerminalOutput(prev => [...prev, `> ${command}`, 'Loading digital identity...', 'Matrix portrait initialized', 'Click "Meet Hassan" to explore the matrix']);
      } else if (upper === 'HELP') {
        setTerminalOutput(prev => [...prev, `> ${command}`, 'Available commands: SHOW PROJECTS, MEET HASSAN, HELP, RESET']);
      } else if (upper === 'RESET') {
        setTerminalOutput([]);
        setCurrentPhase(0);
        setCurrentLineIndex(0);
        setProgress(0);
      } else if (command.length === 0) {
        // noop for empty enter
      } else {
        // Show random coding responses instead of "Unknown command"
        const codingResponse = getRandomCodingResponse();
        setTerminalOutput(prev => [...prev, `> ${command}`, ...codingResponse]);
      }
      setTerminalInput('');
      // Scroll to bottom
      setTimeout(() => terminalRef.current?.scrollTo({ top: terminalRef.current.scrollHeight, behavior: 'smooth' }), 50);
    }
  };

  const getDynamicLine = (line: string) => {
    if (isCompromised && Math.random() < 0.1) {
      const glitch = ['#','@','!','0','X'][Math.floor(Math.random()*5)];
      return line.slice(0, Math.floor(line.length/2)) + glitch + line.slice(Math.floor(line.length/2));
    }
    return line;
  };

  const currentPhaseData = storyPhases[currentPhase];

  // Focus hidden input when terminal clicked
  const focusHiddenInput = () => hiddenInputRef.current?.focus();

  return (
    <div className={`relative w-full h-screen font-mono overflow-hidden ${shake ? 'animate-shake' : ''} ${isGlitching ? 'animate-pulse' : ''} ${zoomGlitch ? 'animate-ping' : ''}`} style={{ background: currentPhaseData.bgGradient }}>
      {/* Heading with Epic Glitch Effects - Desktop */}
      <motion.div 
        className="absolute top-8 sm:top-12 md:top-16 left-1/2 transform -translate-x-1/2 z-20 text-center px-4 hidden lg:block" 
        initial={{ opacity:0, y:-20 }} 
        animate={{ 
          opacity: zoomGlitch ? 0 : 1, 
          y: zoomGlitch ? -200 : 0,
          scale: zoomGlitch ? [1, 3, 5, 8, 0] : 1,
          rotate: zoomGlitch ? [0, 15, -20, 45, 0] : 0,
          x: zoomGlitch ? [0, 50, -30, 80, 0] : 0
        }} 
        transition={{ 
          duration: zoomGlitch ? 0.3 : 0.6,
          ease: zoomGlitch ? "easeInOut" : "easeOut"
        }}
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight" 
          style={{ 
            color: currentPhaseData.color, 
            textShadow: isGlitching ? `0 0 5px ${currentPhaseData.color}, 0 0 10px ${currentPhaseData.color}, 0 0 15px ${currentPhaseData.color}` : `0 0 20px ${currentPhaseData.color},0 0 40px ${currentPhaseData.color}`,
            filter: isGlitching ? 'hue-rotate(90deg) saturate(2)' : 'none'
          }}
          animate={isGlitching ? {
            x: [0, -5, 8, -3, 12, -7, 4, 0],
            y: [0, -3, 5, -2, 8, -4, 2, 0],
            scale: [1, 1.1, 0.9, 1.2, 0.8, 1.15, 0.85, 1],
            rotate: [0, 2, -3, 5, -2, 4, -1, 0]
          } : {}}
          transition={isGlitching ? {
            duration: 0.05,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
        >
          {currentPhaseData.title}
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2" 
          style={{ 
            color: currentPhaseData.color,
            filter: isGlitching ? 'hue-rotate(90deg) saturate(2)' : 'none'
          }}
          animate={isGlitching ? {
            x: [0, 3, -4, 6, -2, 5, -3, 0],
            y: [0, 2, -1, 3, -2, 1, -1, 0],
            opacity: [1, 0.3, 0.9, 0.2, 0.8, 0.4, 1],
            scale: [1, 1.05, 0.95, 1.1, 0.9, 1.08, 0.92, 1]
          } : {}}
          transition={isGlitching ? {
            duration: 0.08,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
        >
          {currentPhaseData.subtitle}
        </motion.p>
      </motion.div>

      {/* Mobile Heading - Top of Screen */}
      <motion.div 
        className="absolute top-8 left-0 right-0 z-20 text-center px-4 block lg:hidden"
        initial={{ opacity:0, y:-20 }} 
        animate={{ 
          opacity: zoomGlitch ? 0 : 1, 
          y: zoomGlitch ? -200 : 0,
          scale: zoomGlitch ? [1, 3, 5, 8, 0] : 1,
          rotate: zoomGlitch ? [0, 15, -20, 45, 0] : 0,
          x: zoomGlitch ? [0, 50, -30, 80, 0] : 0
        }} 
        transition={{ 
          duration: zoomGlitch ? 0.3 : 0.6,
          ease: zoomGlitch ? "easeInOut" : "easeOut"
        }}
      >
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight" 
          style={{ 
            color: currentPhaseData.color, 
            textShadow: isGlitching ? `0 0 5px ${currentPhaseData.color}, 0 0 10px ${currentPhaseData.color}, 0 0 15px ${currentPhaseData.color}` : `0 0 20px ${currentPhaseData.color},0 0 40px ${currentPhaseData.color}`,
            filter: isGlitching ? 'hue-rotate(90deg) saturate(2)' : 'none'
          }}
          animate={isGlitching ? {
            x: [0, -5, 8, -3, 12, -7, 4, 0],
            y: [0, -3, 5, -2, 8, -4, 2, 0],
            scale: [1, 1.1, 0.9, 1.2, 0.8, 1.15, 0.85, 1],
            rotate: [0, 2, -3, 5, -2, 4, -1, 0]
          } : {}}
          transition={isGlitching ? {
            duration: 0.05,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
        >
          {currentPhaseData.title}
        </motion.h1>
        <motion.p 
          className="text-sm sm:text-base mt-1 sm:mt-2" 
          style={{ 
            color: currentPhaseData.color,
            filter: isGlitching ? 'hue-rotate(90deg) saturate(2)' : 'none'
          }}
        >
          {currentPhaseData.subtitle}
        </motion.p>
      </motion.div>

      {/* Desktop Terminal - Side Position */}
      <motion.div 
        className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 lg:bottom-8 lg:right-8 z-30 hidden lg:block"
        animate={zoomGlitch ? {
          scale: [1, 2.5, 4, 6, 8, 0],
          rotate: [0, 15, -25, 45, -60, 0],
          opacity: [1, 0.9, 0.7, 0.4, 0.1, 0],
          x: [0, 100, -150, 200, -100, 0],
          y: [0, -50, 80, -120, 60, 0]
        } : {}}
        transition={zoomGlitch ? {
          duration: 0.3,
          ease: "easeInOut"
        } : {}}
      >
        <motion.div 
          onClick={focusHiddenInput} 
          className="w-64 h-40 sm:w-72 sm:h-48 md:w-80 md:h-56 bg-black/75 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          animate={isGlitching ? {
            x: [0, 8, -12, 15, -8, 10, -5, 0],
            y: [0, -6, 9, -12, 6, -8, 4, 0],
            scale: [1, 1.08, 0.92, 1.12, 0.88, 1.06, 0.94, 1],
            rotate: [0, 3, -4, 6, -3, 5, -2, 0]
          } : {}}
          transition={isGlitching ? {
            duration: 0.06,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
          style={{
            filter: isGlitching ? 'hue-rotate(45deg) saturate(1.5) brightness(1.2)' : 'none',
            boxShadow: isGlitching ? `0 0 20px ${currentPhaseData.color}40, 0 0 40px ${currentPhaseData.color}20` : '0 0 20px rgba(0,0,0,0.3)'
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-black/40 border-b border-gray-800">
            <div className="flex gap-0.5 sm:gap-1">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#ff5f56] rounded-full" />
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#ffbd2e] rounded-full" />
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#27c93f] rounded-full" />
            </div>
            <div className="flex-1 text-center text-xs text-gray-300">Terminal — hassaan@portfolio</div>
          </div>

          {/* Output area */}
          <div ref={terminalRef} className="flex-1 p-2 sm:p-3 text-xs text-green-300 font-mono overflow-y-auto" style={{lineHeight:1.25}}>
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">{line}</div>
            ))}

            {/* Live typing line shown in output for realism */}
            <div className="whitespace-pre-wrap">{`> ${terminalInput}`}
              <span className="ml-1" style={{opacity: cursorVisible ? 1 : 0}}>█</span>
            </div>
          </div>

          {/* Input area (hidden visible input capturing keystrokes) */}
          <div className="px-3 py-2 border-t border-gray-800 bg-black/30 flex items-center gap-2">
            <div className="text-xs text-gray-400 font-mono">~$</div>
            {/* visually hide the real input but keep it accessible for typing & screen readers */}
            <input
              ref={hiddenInputRef}
              value={terminalInput}
              onChange={e => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalKey}
              aria-label="Terminal input"
              placeholder="Type command..."
              className="flex-1 bg-transparent outline-none text-sm text-green-300 font-mono caret-green-300"
              style={{border:'none'}}
            />
            <button
              onClick={() => {
                // quick helper to push current input to output (simulate pressing Enter)
                const ev = new KeyboardEvent('keydown', {key: 'Enter'} as any);
                hiddenInputRef.current?.dispatchEvent(ev);
              }}
              className="text-xs text-gray-400 px-2 py-1 border border-gray-700 rounded hover:bg-white/2"
            >Run</button>
          </div>
        </motion.div>
      </motion.div>

      {/* Mobile Centered Terminal */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-8 z-30 block lg:hidden"
        animate={zoomGlitch ? {
          scale: [1, 2.5, 4, 6, 8, 0],
          rotate: [0, 15, -25, 45, -60, 0],
          opacity: [1, 0.9, 0.7, 0.4, 0.1, 0],
          x: [0, 100, -150, 200, -100, 0],
          y: [0, -50, 80, -120, 60, 0]
        } : {}}
        transition={zoomGlitch ? {
          duration: 0.3,
          ease: "easeInOut"
        } : {}}
      >
        <motion.div 
          onClick={focusHiddenInput} 
          className="w-64 h-40 sm:w-72 sm:h-48 md:w-80 md:h-56 bg-black/75 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          animate={isGlitching ? {
            x: [0, 8, -12, 15, -8, 10, -5, 0],
            y: [0, -6, 9, -12, 6, -8, 4, 0],
            scale: [1, 1.08, 0.92, 1.12, 0.88, 1.06, 0.94, 1],
            rotate: [0, 3, -4, 6, -3, 5, -2, 0]
          } : {}}
          transition={isGlitching ? {
            duration: 0.06,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
          style={{
            filter: isGlitching ? 'hue-rotate(45deg) saturate(1.5) brightness(1.2)' : 'none',
            boxShadow: isGlitching ? `0 0 20px ${currentPhaseData.color}40, 0 0 40px ${currentPhaseData.color}20` : '0 0 20px rgba(0,0,0,0.3)'
          }}
        >
          {/* Title bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-black/40 border-b border-gray-800">
            <div className="flex gap-0.5 sm:gap-1">
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#ff5f56] rounded-full" />
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#ffbd2e] rounded-full" />
              <span className="w-2 h-2 sm:w-3 sm:h-3 bg-[#27c93f] rounded-full" />
            </div>
            <div className="flex-1 text-center text-xs text-gray-300">Terminal — hassaan@portfolio</div>
          </div>

          {/* Output area */}
          <div ref={terminalRef} className="flex-1 p-2 sm:p-3 text-xs text-green-300 font-mono overflow-y-auto" style={{lineHeight:1.25}}>
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="whitespace-pre-wrap">{line}</div>
            ))}

            {/* Live typing line shown in output for realism */}
            <div className="whitespace-pre-wrap">{`> ${terminalInput}`}
              <span className="ml-1" style={{opacity: cursorVisible ? 1 : 0}}>█</span>
            </div>
          </div>

          {/* Input area (hidden visible input capturing keystrokes) */}
          <div className="px-3 py-2 border-t border-gray-800 bg-black/30 flex items-center gap-2">
            <div className="text-xs text-gray-400 font-mono">~$</div>
            {/* visually hide the real input but keep it accessible for typing & screen readers */}
            <input
              ref={hiddenInputRef}
              value={terminalInput}
              onChange={e => setTerminalInput(e.target.value)}
              onKeyDown={handleTerminalKey}
              aria-label="Terminal input"
              placeholder="Type command..."
              className="flex-1 bg-transparent outline-none text-sm text-green-300 font-mono caret-green-300"
              style={{border:'none'}}
            />
            <button
              onClick={() => {
                // quick helper to push current input to output (simulate pressing Enter)
                const ev = new KeyboardEvent('keydown', {key: 'Enter'} as any);
                hiddenInputRef.current?.dispatchEvent(ev);
              }}
              className="text-xs text-gray-400 px-2 py-1 border border-gray-700 rounded hover:bg-white/2"
            >Run</button>
          </div>
        </motion.div>
      </motion.div>

      {/* Terminal animation lines - Desktop */}
      <div className="absolute inset-0 flex flex-col justify-center items-center z-10 pointer-events-none hidden lg:flex">
        <div className="max-w-4xl w-full px-4 sm:px-6 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={currentPhase} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.5}} className="space-y-3">
              {currentPhaseData.lines.slice(0,currentLineIndex+1).map((line,index)=>(
                <motion.div key={`${currentPhase}-${index}`} initial={{opacity:0, x:-100, scale:0.9}} animate={{opacity:1, x:0, scale:1}} transition={{duration:0.8, delay:index*0.05}} className="text-xs sm:text-sm md:text-base" style={{color:currentPhaseData.color, textShadow:`0 0 8px ${currentPhaseData.color}, 0 0 16px ${currentPhaseData.color}`}}>
                  {getDynamicLine(line)}{cursorVisible && <span className="blink">█</span>}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Terminal animation lines - Mobile (Above Center) */}
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-40 z-10 pointer-events-none block lg:hidden">
        <div className="w-full px-2 sm:px-4 md:px-6">
          <AnimatePresence mode="wait">
            <motion.div key={currentPhase} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-20}} transition={{duration:0.5}} className="space-y-2 sm:space-y-3">
              {currentPhaseData.lines.slice(0,currentLineIndex+1).map((line,index)=>(
                <motion.div key={`${currentPhase}-${index}`} initial={{opacity:0, x:-100, scale:0.9}} animate={{opacity:1, x:0, scale:1}} transition={{duration:0.8, delay:index*0.05}} className="text-xs sm:text-sm md:text-base text-center" style={{color:currentPhaseData.color, textShadow:`0 0 6px ${currentPhaseData.color}, 0 0 12px ${currentPhaseData.color}`}}>
                  {getDynamicLine(line)}{cursorVisible && <span className="blink">█</span>}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Progress Bar */}
      <motion.div 
        className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-20 w-64 sm:w-72 md:w-80 px-4 hidden lg:block"
        animate={zoomGlitch ? {
          scale: [1, 2, 3.5, 5, 7, 0],
          y: [0, -80, 120, -200, 150, -300],
          x: [0, 50, -80, 120, -60, 0],
          opacity: [1, 0.9, 0.6, 0.3, 0.1, 0],
          rotate: [0, 10, -15, 25, -20, 0]
        } : {}}
        transition={zoomGlitch ? {
          duration: 0.3,
          ease: "easeInOut"
        } : {}}
      >
        <motion.div 
          className="w-full bg-black/60 border border-gray-600 rounded-full h-3 overflow-hidden"
          animate={isGlitching ? {
            scale: [1, 1.15, 0.85, 1.2, 0.8, 1.1, 0.9, 1],
            x: [0, 5, -8, 12, -6, 9, -4, 0],
            y: [0, 3, -4, 6, -3, 5, -2, 0],
            rotate: [0, 2, -3, 4, -2, 3, -1, 0]
          } : {}}
          transition={isGlitching ? {
            duration: 0.05,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
          style={{
            filter: isGlitching ? 'hue-rotate(30deg) saturate(1.3)' : 'none',
            boxShadow: isGlitching ? `0 0 15px ${currentPhaseData.color}30` : 'none'
          }}
        >
          <motion.div 
            className="h-full rounded-full relative" 
            style={{background:`linear-gradient(90deg, ${currentPhaseData.color}, ${currentPhaseData.color}80)`}} 
            initial={{width:0}} 
            animate={{width:`${progress}%`}} 
            transition={{duration:0.2}}
          >
            <motion.div 
              className="absolute inset-0 bg-white/30" 
              animate={isGlitching ? {
                x: ['-100%','100%'],
                opacity: [0.3, 0.8, 0.3]
              } : {x:['-100%','100%']}} 
              transition={isGlitching ? {
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear'
              } : {duration:1.2, repeat:Infinity, ease:'linear'}}
            />
          </motion.div>
        </motion.div>
        <motion.div 
          className="text-center mt-2 text-sm" 
          style={{
            color: currentPhaseData.color,
            filter: isGlitching ? 'hue-rotate(30deg) saturate(1.3)' : 'none'
          }}
          animate={isGlitching ? {
            opacity: [1, 0.7, 1, 0.8, 1],
            scale: [1, 1.05, 0.95, 1.02, 1]
          } : {}}
          transition={isGlitching ? {
            duration: 0.15,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
        >
          {Math.round(progress)}% Complete
        </motion.div>
      </motion.div>

      {/* Mobile Progress Bar - Above Bottom */}
      <motion.div 
        className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 w-64 sm:w-72 md:w-80 px-4 block lg:hidden"
        animate={zoomGlitch ? {
          scale: [1, 2, 3.5, 5, 7, 0],
          y: [0, -80, 120, -200, 150, -300],
          x: [0, 50, -80, 120, -60, 0],
          opacity: [1, 0.9, 0.6, 0.3, 0.1, 0],
          rotate: [0, 10, -15, 25, -20, 0]
        } : {}}
        transition={zoomGlitch ? {
          duration: 0.3,
          ease: "easeInOut"
        } : {}}
      >
        <motion.div 
          className="w-full bg-black/60 border border-gray-600 rounded-full h-3 overflow-hidden"
          animate={isGlitching ? {
            scale: [1, 1.15, 0.85, 1.2, 0.8, 1.1, 0.9, 1],
            x: [0, 5, -8, 12, -6, 9, -4, 0],
            y: [0, 3, -4, 6, -3, 5, -2, 0],
            rotate: [0, 2, -3, 4, -2, 3, -1, 0]
          } : {}}
          transition={isGlitching ? {
            duration: 0.05,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
          style={{
            filter: isGlitching ? 'hue-rotate(30deg) saturate(1.3)' : 'none',
            boxShadow: isGlitching ? `0 0 15px ${currentPhaseData.color}30` : 'none'
          }}
        >
          <motion.div 
            className="h-full rounded-full relative" 
            style={{background:`linear-gradient(90deg, ${currentPhaseData.color}, ${currentPhaseData.color}80)`}} 
            initial={{width:0}} 
            animate={{width:`${progress}%`}} 
            transition={{duration:0.2}}
          >
            <motion.div 
              className="absolute inset-0 bg-white/30" 
              animate={isGlitching ? {
                x: ['-100%','100%'],
                opacity: [0.3, 0.8, 0.3]
              } : {x:['-100%','100%']}} 
              transition={isGlitching ? {
                duration: 0.8,
                repeat: Infinity,
                ease: 'linear'
              } : {duration:1.2, repeat:Infinity, ease:'linear'}}
            />
          </motion.div>
        </motion.div>
        <motion.div 
          className="text-center mt-2 text-sm" 
          style={{
            color: currentPhaseData.color,
            filter: isGlitching ? 'hue-rotate(30deg) saturate(1.3)' : 'none'
          }}
          animate={isGlitching ? {
            opacity: [1, 0.7, 1, 0.8, 1],
            scale: [1, 1.05, 0.95, 1.02, 1]
          } : {}}
          transition={isGlitching ? {
            duration: 0.15,
            repeat: Infinity,
            repeatType: "reverse"
          } : {}}
        >
          {Math.round(progress)}% Complete
        </motion.div>
      </motion.div>

      {/* Matrix Canvas with Epic Glitch Effects */}
      <motion.canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0" 
        animate={zoomGlitch ? {
          scale: [1, 3, 6, 10, 15, 0],
          rotate: [0, 25, -40, 60, -80, 0],
          opacity: [1, 0.9, 0.6, 0.3, 0.1, 0],
          x: [0, 200, -300, 400, -200, 0],
          y: [0, -150, 250, -400, 200, 0]
        } : {}}
        transition={zoomGlitch ? {
          duration: 0.3,
          ease: "easeInOut"
        } : {}}
        style={{
          filter: isGlitching ? 'hue-rotate(180deg) saturate(2) brightness(1.5) contrast(1.2)' : 'none'
        }}
      />

      {/* Epic Glitch Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none" 
        animate={isGlitching ? {
          opacity: [0, 0.6, 0.2, 0.8, 0.3, 0.9, 0.1, 0],
          scale: [1, 1.3, 0.7, 1.5, 0.6, 1.4, 0.8, 1],
          rotate: [0, 8, -12, 15, -8, 20, -5, 0],
          x: [0, 20, -30, 40, -20, 50, -25, 0],
          y: [0, -15, 25, -35, 15, -40, 20, 0]
        } : {opacity:[0,0.1,0,0.15,0]}} 
        transition={isGlitching ? {
          duration: 0.08,
          repeat: Infinity,
          ease: 'easeInOut'
        } : {duration:0.6, repeat:Infinity, ease:'easeInOut'}} 
        style={{
          background: isGlitching 
            ? `radial-gradient(circle, ${currentPhaseData.color}40, ${currentPhaseData.color}20, transparent)` 
            : `radial-gradient(circle, ${currentPhaseData.color}20, transparent)`,
          filter: isGlitching ? 'hue-rotate(120deg) saturate(1.5) brightness(1.3)' : 'none'
        }}
      />
      
      {/* Zoom Glitch Flash Effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none bg-white"
        initial={{ opacity: 0 }}
        animate={zoomGlitch ? {
          opacity: [0, 1, 0.2, 1, 0.1, 1, 0.05, 0],
          scale: [1, 2, 0.5, 3, 0.3, 4, 0.1, 0],
          rotate: [0, 15, -20, 30, -25, 45, -10, 0]
        } : { opacity: 0 }}
        transition={zoomGlitch ? {
          duration: 0.3,
          ease: "easeInOut"
        } : {}}
      />

    </div>
  );
};

export default SystemHack;


