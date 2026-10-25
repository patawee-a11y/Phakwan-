import React from 'react';

interface RoseStemProps {
  growthProgress: number; // 0 to 1
  curveType?: 'left' | 'right' | 'center';
  stemColor?: string;
  thornColor?: string;
}

export const RoseStem: React.FC<RoseStemProps> = ({
  growthProgress,
  curveType = 'center',
  stemColor = '#7A8462',
  thornColor = '#5F684C',
}) => {
  // Approximate path length for dashoffset
  const pathLength = 320;
  const strokeDashoffset = pathLength * (1 - Math.min(1, Math.max(0, growthProgress)));

  // Different organic curves for varied stem growth
  const stemPath =
    curveType === 'left'
      ? 'M100,320 C95,260 80,180 90,100 C95,65 92,30 100,5'
      : curveType === 'right'
      ? 'M100,320 C108,260 120,180 110,100 C105,65 108,30 100,5'
      : 'M100,320 C98,250 104,170 98,95 C95,60 99,30 100,5';

  return (
    <g className="rose-stem-group">
      {/* Stem Shadow / depth */}
      <path
        d={stemPath}
        fill="none"
        stroke="#4C543B"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: 0.4,
          transform: 'translate(1px, 1px)',
        }}
      />

      {/* Main Stem with organic taper */}
      <path
        d={stemPath}
        fill="none"
        stroke={stemColor}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      />

      {/* Highlight line along the stem */}
      <path
        d={stemPath}
        fill="none"
        stroke="#A4AE8E"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: 'stroke-dashoffset 0.8s cubic-bezier(0.25, 1, 0.5, 1)',
          opacity: 0.7,
          transform: 'translate(-0.8px, -0.5px)',
        }}
      />

      {/* Botanical Rose Thorns that emerge as stem grows past them */}
      {growthProgress > 0.35 && (
        <path
          d={
            curveType === 'right'
              ? 'M106,210 Q98,214 96,220 Q104,217 106,213'
              : 'M92,210 Q84,214 82,220 Q90,217 92,213'
          }
          fill={thornColor}
          stroke={thornColor}
          strokeWidth="0.8"
          className="transition-all duration-500 ease-out"
          style={{ opacity: Math.min(1, (growthProgress - 0.35) * 3) }}
        />
      )}

      {growthProgress > 0.65 && (
        <path
          d={
            curveType === 'left'
              ? 'M95,140 Q103,144 105,150 Q97,147 95,143'
              : 'M105,140 Q113,144 115,150 Q107,147 105,143'
          }
          fill={thornColor}
          stroke={thornColor}
          strokeWidth="0.8"
          className="transition-all duration-500 ease-out"
          style={{ opacity: Math.min(1, (growthProgress - 0.65) * 3) }}
        />
      )}
    </g>
  );
};
