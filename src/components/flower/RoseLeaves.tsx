import React from 'react';

interface RoseLeavesProps {
  growthProgress: number; // 0 to 1
  curveType?: 'left' | 'right' | 'center';
}

export const RoseLeaves: React.FC<RoseLeavesProps> = ({
  growthProgress,
  curveType = 'center',
}) => {
  // Lower leaf set triggers around growthProgress 0.45
  const lowerLeafFactor = Math.min(1, Math.max(0, (growthProgress - 0.4) * 2.2));
  // Upper leaf set triggers around growthProgress 0.70
  const upperLeafFactor = Math.min(1, Math.max(0, (growthProgress - 0.65) * 2.5));

  // Anchor coordinates on the stem
  const lowerAnchor = curveType === 'left' ? { x: 88, y: 195 } : { x: 106, y: 195 };
  const upperAnchor = curveType === 'left' ? { x: 92, y: 110 } : { x: 104, y: 110 };

  return (
    <g className="rose-leaves-group select-none">
      {/* Lower Leaf (Right branch) */}
      <g
        style={{
          transformOrigin: `${lowerAnchor.x}px ${lowerAnchor.y}px`,
          transform: `scale(${lowerLeafFactor}) rotate(${
            (1 - lowerLeafFactor) * -35
          }deg)`,
          opacity: lowerLeafFactor,
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out',
        }}
      >
        {/* Leaf Petiole (small stem) */}
        <path
          d={`M${lowerAnchor.x},${lowerAnchor.y} Q${lowerAnchor.x + 15},${lowerAnchor.y - 8} ${lowerAnchor.x + 28},${lowerAnchor.y - 12}`}
          fill="none"
          stroke="#7A8462"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Leaf Blade with subtle serrated silhouette */}
        <path
          d={`M${lowerAnchor.x + 28},${lowerAnchor.y - 12} 
              C${lowerAnchor.x + 38},${lowerAnchor.y - 25} ${lowerAnchor.x + 58},${lowerAnchor.y - 28} ${lowerAnchor.x + 72},${lowerAnchor.y - 16}
              C${lowerAnchor.x + 58},${lowerAnchor.y} ${lowerAnchor.x + 40},${lowerAnchor.y + 2} ${lowerAnchor.x + 28},${lowerAnchor.y - 12} Z`}
          fill="url(#roseLeafGrad)"
          stroke="#5C6647"
          strokeWidth="1"
        />

        {/* Midrib and Lateral Veins */}
        <path
          d={`M${lowerAnchor.x + 28},${lowerAnchor.y - 12} Q${lowerAnchor.x + 50},${lowerAnchor.y - 16} ${lowerAnchor.x + 72},${lowerAnchor.y - 16}`}
          fill="none"
          stroke="#97A37E"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d={`M${lowerAnchor.x + 40},${lowerAnchor.y - 14} Q${lowerAnchor.x + 46},${lowerAnchor.y - 22} ${lowerAnchor.x + 52},${lowerAnchor.y - 24}
              M${lowerAnchor.x + 48},${lowerAnchor.y - 15} Q${lowerAnchor.x + 54},${lowerAnchor.y - 8} ${lowerAnchor.x + 60},${lowerAnchor.y - 6}
              M${lowerAnchor.x + 56},${lowerAnchor.y - 16} Q${lowerAnchor.x + 62},${lowerAnchor.y - 22} ${lowerAnchor.x + 66},${lowerAnchor.y - 20}`}
          fill="none"
          stroke="#97A37E"
          strokeWidth="0.75"
          opacity="0.65"
        />

        {/* Tiny paired lateral leaflet */}
        <path
          d={`M${lowerAnchor.x + 18},${lowerAnchor.y - 9} 
              C${lowerAnchor.x + 24},${lowerAnchor.y - 18} ${lowerAnchor.x + 36},${lowerAnchor.y - 18} ${lowerAnchor.x + 42},${lowerAnchor.y - 10}
              C${lowerAnchor.x + 34},${lowerAnchor.y - 3} ${lowerAnchor.x + 24},${lowerAnchor.y - 2} ${lowerAnchor.x + 18},${lowerAnchor.y - 9} Z`}
          fill="url(#roseLeafGrad)"
          stroke="#5C6647"
          strokeWidth="0.8"
        />
      </g>

      {/* Upper Leaf (Left branch) */}
      <g
        style={{
          transformOrigin: `${upperAnchor.x}px ${upperAnchor.y}px`,
          transform: `scale(${upperLeafFactor}) rotate(${
            (1 - upperLeafFactor) * 40
          }deg)`,
          opacity: upperLeafFactor,
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease-out',
        }}
      >
        {/* Leaf Petiole */}
        <path
          d={`M${upperAnchor.x},${upperAnchor.y} Q${upperAnchor.x - 14},${upperAnchor.y - 6} ${upperAnchor.x - 26},${upperAnchor.y - 10}`}
          fill="none"
          stroke="#7A8462"
          strokeWidth="1.8"
          strokeLinecap="round"
        />

        {/* Leaf Blade */}
        <path
          d={`M${upperAnchor.x - 26},${upperAnchor.y - 10} 
              C${upperAnchor.x - 36},${upperAnchor.y - 22} ${upperAnchor.x - 56},${upperAnchor.y - 24} ${upperAnchor.x - 68},${upperAnchor.y - 12}
              C${upperAnchor.x - 54},${upperAnchor.y + 4} ${upperAnchor.x - 36},${upperAnchor.y + 4} ${upperAnchor.x - 26},${upperAnchor.y - 10} Z`}
          fill="url(#roseLeafGrad)"
          stroke="#5C6647"
          strokeWidth="1"
        />

        {/* Midrib and Veins */}
        <path
          d={`M${upperAnchor.x - 26},${upperAnchor.y - 10} Q${upperAnchor.x - 46},${upperAnchor.y - 13} ${upperAnchor.x - 68},${upperAnchor.y - 12}`}
          fill="none"
          stroke="#97A37E"
          strokeWidth="1.1"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d={`M${upperAnchor.x - 36},${upperAnchor.y - 11} Q${upperAnchor.x - 42},${upperAnchor.y - 18} ${upperAnchor.x - 48},${upperAnchor.y - 20}
              M${upperAnchor.x - 44},${upperAnchor.y - 12} Q${upperAnchor.x - 50},${upperAnchor.y - 5} ${upperAnchor.x - 56},${upperAnchor.y - 4}
              M${upperAnchor.x - 52},${upperAnchor.y - 12} Q${upperAnchor.x - 58},${upperAnchor.y - 18} ${upperAnchor.x - 62},${upperAnchor.y - 16}`}
          fill="none"
          stroke="#97A37E"
          strokeWidth="0.75"
          opacity="0.65"
        />
      </g>
    </g>
  );
};
