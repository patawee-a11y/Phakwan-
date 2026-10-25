import React, { useEffect, useState } from 'react';
import { FlowerPalette, RosePetals } from './RosePetals';
import { RoseLeaves } from './RoseLeaves';
import { RoseStem } from './RoseStem';

interface AnimatedRoseProps {
  delay?: number; // ms to start
  duration?: number; // ms for total growth
  scale?: number;
  flowerScale?: number;
  palette?: FlowerPalette;
  curveType?: 'left' | 'right' | 'center';
  swayDelay?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const AnimatedRose: React.FC<AnimatedRoseProps> = ({
  delay = 0,
  duration = 2200,
  scale = 1,
  flowerScale = 1,
  palette = 'dustyRose',
  curveType = 'center',
  swayDelay = 0,
  className = '',
  style = {},
}) => {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const timer = setTimeout(() => {
      setHasStarted(true);

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const rawProgress = Math.min(1, elapsed / duration);

        // Smooth cubic easing for natural biological growth cadence
        // Starts deliberate, accelerates smoothly, settles gently
        const eased =
          rawProgress < 0.5
            ? 4 * rawProgress * rawProgress * rawProgress
            : 1 - Math.pow(-2 * rawProgress + 2, 3) / 2;

        setProgress(eased);

        if (rawProgress < 1) {
          animationFrameId = requestAnimationFrame(step);
        }
      };

      animationFrameId = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [delay, duration]);

  // Stem grows from 0 to 0.75 of progress
  const stemProgress = Math.min(1, progress / 0.75);
  // Leaves develop between 0.35 and 0.85 of progress
  const leavesProgress = Math.min(1, Math.max(0, (progress - 0.3) / 0.55));
  // Petals bloom between 0.55 and 1.0 of progress
  const petalsProgress = Math.min(1, Math.max(0, (progress - 0.5) / 0.5));

  // Natural subtle ambient sway once bloomed
  const isFullyBloomed = progress >= 0.95;

  return (
    <div
      className={`animated-rose-container pointer-events-none select-none ${className}`}
      style={{
        ...style,
        transform: `${style.transform || ''} scale(${scale})`,
        transformOrigin: 'bottom center',
        opacity: hasStarted ? 1 : 0,
        transition: 'opacity 0.3s ease-in',
      }}
    >
      <svg
        viewBox="0 0 200 340"
        className={`w-full h-full overflow-visible ${
          isFullyBloomed ? 'animate-rose-sway' : ''
        }`}
        style={{
          animationDelay: `${swayDelay}ms`,
        }}
      >
        <defs>
          <linearGradient id="roseLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A4AE8E" />
            <stop offset="60%" stopColor="#7A8462" />
            <stop offset="100%" stopColor="#55603F" />
          </linearGradient>
        </defs>

        {/* 1. Stem growing upward */}
        <RoseStem
          growthProgress={stemProgress}
          curveType={curveType}
        />

        {/* 2. Leaves unfurling from stem nodes */}
        <RoseLeaves
          growthProgress={leavesProgress}
          curveType={curveType}
        />

        {/* 3. Rose Petal Head Blooming atop stem */}
        {progress > 0.45 && (
          <g
            style={{
              transformOrigin: '100px 10px',
              transform: `translate(${
                curveType === 'left' ? -2 : curveType === 'right' ? 2 : 0
              }px, 0px) scale(${flowerScale * Math.min(1, (progress - 0.45) * 2)})`,
              opacity: Math.min(1, (progress - 0.45) * 4),
              transition: 'opacity 0.3s ease-out',
            }}
          >
            <RosePetals
              bloomProgress={petalsProgress}
              palette={palette}
              scale={1}
            />
          </g>
        )}
      </svg>
    </div>
  );
};
