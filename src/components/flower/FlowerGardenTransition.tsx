import React, { useEffect, useState } from 'react';
import { AnimatedRose } from './AnimatedRose';
import { FlowerPalette } from './RosePetals';

import { SiteConfig } from '../../types';

interface FlowerGardenTransitionProps {
  onTransitionComplete: () => void;
  config?: SiteConfig;
}

interface RoseConfig {
  id: string;
  delay: number;
  duration: number;
  scale: number;
  palette: FlowerPalette;
  curveType: 'left' | 'right' | 'center';
  positionStyle: React.CSSProperties;
  layer: 'background' | 'midground' | 'foreground';
  swayDelay: number;
}

export const FlowerGardenTransition: React.FC<FlowerGardenTransitionProps> = ({
  onTransitionComplete,
  config,
}) => {
  // Phase tracking for overall sequence
  // 1: Primary center sprout
  // 2: Primary bloom & side growth
  // 3: Multi-layer full garden bloom & petal drift
  // 4: Immersive expansion & transition to Songs
  const [gardenPhase, setGardenPhase] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    // Stage 1 -> 2: Side flowers sprout
    const t1 = setTimeout(() => {
      setGardenPhase(2);
    }, 1200);

    // Stage 2 -> 3: Full garden flourishes with drifting petals
    const t2 = setTimeout(() => {
      setGardenPhase(3);
    }, 2800);

    // Stage 3 -> 4: Gentle immersion expansion
    const t3 = setTimeout(() => {
      setGardenPhase(4);
    }, 4600);

    // Auto transition to Scene C after full bloom experience
    const tEnd = setTimeout(() => {
      onTransitionComplete();
    }, 5600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(tEnd);
    };
  }, [onTransitionComplete]);

  // Orchestrated individual roses across 3 distinct depth layers
  const roses: RoseConfig[] = [
    // --- Central Hero Rose (Sprouts first in center of screen) ---
    {
      id: 'center-hero',
      delay: 100,
      duration: 2200,
      scale: 1.15,
      palette: 'dustyRose',
      curveType: 'center',
      positionStyle: {
        bottom: '0%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '240px',
        height: '380px',
        zIndex: 25,
      },
      layer: 'midground',
      swayDelay: 0,
    },

    // --- Background Layer (Smaller, soft, distant) ---
    {
      id: 'bg-left',
      delay: 1100,
      duration: 2400,
      scale: 0.72,
      palette: 'creamWhite',
      curveType: 'left',
      positionStyle: {
        bottom: '8%',
        left: '26%',
        width: '180px',
        height: '280px',
        zIndex: 10,
        opacity: 0.85,
        filter: 'blur(0.4px)',
      },
      layer: 'background',
      swayDelay: 400,
    },
    {
      id: 'bg-right',
      delay: 1350,
      duration: 2400,
      scale: 0.75,
      palette: 'blushPink',
      curveType: 'right',
      positionStyle: {
        bottom: '10%',
        right: '25%',
        width: '180px',
        height: '280px',
        zIndex: 10,
        opacity: 0.85,
        filter: 'blur(0.4px)',
      },
      layer: 'background',
      swayDelay: 800,
    },

    // --- Midground Layer (Flanking the hero rose) ---
    {
      id: 'mid-left',
      delay: 750,
      duration: 2300,
      scale: 0.95,
      palette: 'blushPink',
      curveType: 'right',
      positionStyle: {
        bottom: '2%',
        left: '12%',
        width: '210px',
        height: '330px',
        zIndex: 20,
      },
      layer: 'midground',
      swayDelay: 600,
    },
    {
      id: 'mid-right',
      delay: 900,
      duration: 2300,
      scale: 0.98,
      palette: 'dustyRose',
      curveType: 'left',
      positionStyle: {
        bottom: '3%',
        right: '13%',
        width: '210px',
        height: '330px',
        zIndex: 20,
      },
      layer: 'midground',
      swayDelay: 1100,
    },

    // --- Foreground Layer (Large, lush framing branches closer to viewer) ---
    {
      id: 'fg-far-left',
      delay: 1600,
      duration: 2200,
      scale: 1.35,
      palette: 'vintageBurgundy',
      curveType: 'left',
      positionStyle: {
        bottom: '-4%',
        left: '-4%',
        width: '260px',
        height: '400px',
        zIndex: 30,
      },
      layer: 'foreground',
      swayDelay: 300,
    },
    {
      id: 'fg-far-right',
      delay: 1800,
      duration: 2200,
      scale: 1.38,
      palette: 'blushPink',
      curveType: 'right',
      positionStyle: {
        bottom: '-5%',
        right: '-5%',
        width: '260px',
        height: '400px',
        zIndex: 30,
      },
      layer: 'foreground',
      swayDelay: 900,
    },
  ];

  // Floating drifting loose petals
  const driftingPetals = [
    { left: '15%', delay: '0.4s', dur: '5.2s', size: 'w-7 h-7', rot: '35deg' },
    { left: '30%', delay: '1.2s', dur: '4.8s', size: 'w-9 h-9', rot: '-20deg' },
    { left: '50%', delay: '0.8s', dur: '5.5s', size: 'w-8 h-8', rot: '45deg' },
    { left: '70%', delay: '1.6s', dur: '4.5s', size: 'w-10 h-10', rot: '-35deg' },
    { left: '85%', delay: '2.0s', dur: '5.0s', size: 'w-8 h-8', rot: '15deg' },
    { left: '22%', delay: '2.5s', dur: '4.9s', size: 'w-6 h-6', rot: '55deg' },
    { left: '60%', delay: '2.8s', dur: '5.1s', size: 'w-8 h-8', rot: '-40deg' },
  ];

  return (
    <div
      onClick={onTransitionComplete}
      className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center bg-[#F8F1E4] select-none cursor-pointer"
      title="Click anytime to continue to Songs"
    >
      {/* Background Soft Warm Parchment Gradient */}
      <div className="absolute inset-0 bg-radial from-[#FAF6ED] via-[#F8F1E4] to-[#E7D9BE]/60 pointer-events-none" />

      {/* Tender Whisper Caption at top */}
      <div
        className={`absolute top-10 text-center z-40 transition-all duration-1000 pointer-events-none ${
          gardenPhase >= 2 ? 'opacity-90 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <p className="font-handwriting text-3xl sm:text-5xl text-[#70434B] drop-shadow-xs">
          {config?.flowerTitle || 'Blooming for you...'}
        </p>
        <p className="font-body italic text-xs text-[#81856A] mt-1">
          {config?.flowerSubtitle || 'A garden of melodies unfolding'}
        </p>
      </div>

      {/* Main Living Botanical Canvas */}
      <div
        className={`relative w-full h-full max-w-6xl mx-auto transition-transform duration-1400 ease-out ${
          gardenPhase === 4 ? 'scale-110 opacity-90' : 'scale-100 opacity-100'
        }`}
      >
        {/* Render Each Distinct Animated Rose */}
        {roses.map((rose) => (
          <div
            key={rose.id}
            className="absolute"
            style={rose.positionStyle}
          >
            <AnimatedRose
              delay={rose.delay}
              duration={rose.duration}
              scale={rose.scale}
              palette={rose.palette}
              curveType={rose.curveType}
              swayDelay={rose.swayDelay}
              className="w-full h-full"
            />
          </div>
        ))}

        {/* Floating Drifting Loose Petals Layer (Phase 3+) */}
        {gardenPhase >= 2 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-35">
            {driftingPetals.map((petal, i) => (
              <div
                key={i}
                className={`absolute top-0 ${petal.size} rounded-[45%_55%_65%_35%/40%_50%_60%_50%] bg-[#F0B7C3]/85 border border-[#D98D9C]/40 shadow-xs`}
                style={{
                  left: petal.left,
                  animation: `float-petal ${petal.dur} ease-in-out infinite`,
                  animationDelay: petal.delay,
                  transform: `rotate(${petal.rot})`,
                }}
              >
                <div className="w-full h-full rounded-full bg-linear-to-br from-white/40 via-transparent to-[#70434B]/20" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Soft Vignette Overlay to merge with vintage scrapbook tone */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#F8F1E4]/20 to-[#F8F1E4]/70 pointer-events-none z-35" />

      {/* Skip Button for accessibility */}
      <div className="absolute bottom-6 right-6 z-50">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTransitionComplete();
          }}
          className="text-xs font-sans-clean text-[#70434B] hover:text-[#493F39] bg-[#FAF6ED]/80 hover:bg-[#FAF6ED] backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#D98D9C]/40 shadow-xs transition-all cursor-pointer"
        >
          {config?.flowerSkipText || 'Skip →'}
        </button>
      </div>
    </div>
  );
};
