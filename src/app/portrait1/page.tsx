'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InteractivePixelPortrait from '@/components/InteractivePixelPortrait';
import TypewriterEffect from '@/components/TypewriterEffect';

export default function Portrait1Page() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isAutoRedirecting, setIsAutoRedirecting] = useState(false);
  const [showTypewriter, setShowTypewriter] = useState(false);

  const handleBackToMain = () => {
    setIsRedirecting(true);
    // Use Next.js router for better navigation
    router.push('/?stage=landing');
  };

  // Foolproof redirect detection using sessionStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const navigationKey = 'portrait_navigation';
      const isNavigated = sessionStorage.getItem(navigationKey);
      
      if (!isNavigated) {
        // No navigation flag - this is a refresh or direct access
        console.log('🚀 No navigation flag found - this is a refresh/direct access, redirecting...');
        setIsAutoRedirecting(true);
        
        // Redirect immediately
        setTimeout(() => {
          router.replace('/?stage=landing');
        }, 100);
        
        return;
      } else {
        // Navigation flag exists - this is normal navigation
        console.log('✅ Normal navigation to portrait, showing content');
        // Clear the flag so next refresh will redirect
        sessionStorage.removeItem(navigationKey);
        
        // Start typewriter effect after a short delay
        setTimeout(() => {
          setShowTypewriter(true);
        }, 500);
      }
    }
  }, [router]);

  // Show loading screen while redirecting
  if (isAutoRedirecting || isRedirecting) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-400 text-lg">Redirecting to main page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Back button */}
      <button
        onClick={handleBackToMain}
        className="fixed top-3 left-3 z-50 bg-black/80 hover:bg-black/90 text-white px-3 py-1.5 text-sm rounded-md border border-gray-600/50 hover:border-gray-500 transition-all duration-200 backdrop-blur-sm hover:scale-105"
      >
        Back
      </button>

      {/* Portrait section - no borders, seamless */}
      <div className="flex flex-col lg:flex-row h-[90vh] max-h-[800px] max-w-7xl w-full gap-8">
        {/* Left side - Portrait (flowing in background) */}
        <div className="flex-1 flex items-center justify-center p-2">
          <div className="w-full h-full">
            <InteractivePixelPortrait />
          </div>
        </div>

        {/* Right side - Text content without box */}
        <div className="flex-1 flex flex-col justify-center space-y-6 p-8">
          {/* Title */}
          {showTypewriter ? (
            <TypewriterEffect
              lines={['MEET HASSAN']}
              speed={100}
              onComplete={() => console.log('Title complete')}
              className="text-4xl font-bold text-white"
            />
          ) : (
            <h2 className="text-4xl font-bold text-green-400">
              Meet Hassan
            </h2>
          )}
          
          {/* Subtitle */}
          {showTypewriter ? (
            <TypewriterEffect
              lines={['DIGITAL IDENTITY MATRIX']}
              speed={80}
              onComplete={() => console.log('Subtitle complete')}
              className="text-xl text-green-600"
            />
          ) : (
            <h3 className="text-xl text-green-300">
              Digital Identity Matrix
            </h3>
          )}
          
          {/* Description */}
          <div className="space-y-4 text-gray-300">
            {showTypewriter ? (
              <TypewriterEffect
                lines={[
                  'Hover over the matrix portrait to witness the digital explosion effect.',
                  'Each pixel represents a fragment of digital identity, coming alive through',
                  'interactive technology.'
                ]}
                speed={50}
                onComplete={() => console.log('Description complete')}
                className="text-lg leading-relaxed text-white"
              />
            ) : (
              <p className="text-lg leading-relaxed">
                Hover over the matrix portrait to witness the digital explosion effect. 
                Each pixel represents a fragment of digital identity, coming alive through 
                interactive technology.
              </p>
            )}
            
            {showTypewriter ? (
              <TypewriterEffect
                lines={['Built with React, Three.js, and advanced canvas manipulation techniques.']}
                speed={60}
                onComplete={() => console.log('Tech complete')}
                className="text-sm text-green-800"
              />
            ) : (
              <p className="text-sm text-gray-400">
                Built with React, Three.js, and advanced canvas manipulation techniques.
              </p>
            )}
          </div>

          {/* Features */}
          <div className="space-y-2">
            {showTypewriter ? (
              <TypewriterEffect
                lines={[
                  '• Interactive Pixel Explosion',
                  '• Real-time Canvas Animation',
                  '• Matrix Digital Rain Effect'
                ]}
                speed={70}
                onComplete={() => console.log('Features complete')}
                className="text-green-500 text-sm"
              />
            ) : (
              <>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Interactive Pixel Explosion</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Real-time Canvas Animation</span>
                </div>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">Matrix Digital Rain Effect</span>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}