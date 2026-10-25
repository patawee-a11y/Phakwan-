import React from 'react';

export type FlowerPalette = 'dustyRose' | 'blushPink' | 'creamWhite' | 'vintageBurgundy';

interface RosePetalsProps {
  bloomProgress: number; // 0 (closed bud) to 1 (fully blossomed English rose)
  palette?: FlowerPalette;
  scale?: number;
}

export const RosePetals: React.FC<RosePetalsProps> = ({
  bloomProgress,
  palette = 'dustyRose',
  scale = 1,
}) => {
  // Easing progress smoothly
  const p = Math.min(1, Math.max(0, bloomProgress));

  // Sepals open early: 0.1 -> 0.4
  const sepalsProgress = Math.min(1, Math.max(0, (p - 0.05) * 3));
  // Outer petals open: 0.25 -> 0.75
  const outerProgress = Math.min(1, Math.max(0, (p - 0.2) * 2));
  // Mid petals open: 0.45 -> 0.9
  const midProgress = Math.min(1, Math.max(0, (p - 0.4) * 2));
  // Inner core unfolds: 0.6 -> 1.0
  const innerProgress = Math.min(1, Math.max(0, (p - 0.55) * 2.2));

  // Palette Gradients
  const gradPrefix = `rose-${palette}`;

  return (
    <g
      className="rose-petals-bloom-head"
      style={{
        transformOrigin: '100px 10px',
        transform: `scale(${scale})`,
      }}
    >
      <defs>
        {/* Dusty Rose Gradient */}
        <linearGradient id={`${gradPrefix}-outer`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={palette === 'creamWhite' ? '#FFFBF5' : palette === 'blushPink' ? '#FEE4E9' : palette === 'vintageBurgundy' ? '#8C4F5B' : '#E8A3B1'} />
          <stop offset="60%" stopColor={palette === 'creamWhite' ? '#F4E7D3' : palette === 'blushPink' ? '#F3B4C0' : palette === 'vintageBurgundy' ? '#6E3A44' : '#D98D9C'} />
          <stop offset="100%" stopColor={palette === 'creamWhite' ? '#D6C4A5' : palette === 'blushPink' ? '#DA899B' : palette === 'vintageBurgundy' ? '#4E242C' : '#A95867'} />
        </linearGradient>

        <linearGradient id={`${gradPrefix}-mid`} x1="30%" y1="0%" x2="70%" y2="100%">
          <stop offset="0%" stopColor={palette === 'creamWhite' ? '#FAF4EA' : palette === 'blushPink' ? '#FAD5DC' : palette === 'vintageBurgundy' ? '#9E5B68' : '#F0B7C3'} />
          <stop offset="70%" stopColor={palette === 'creamWhite' ? '#E8D4BA' : palette === 'blushPink' ? '#E49CA9' : palette === 'vintageBurgundy' ? '#70434B' : '#D27F90'} />
          <stop offset="100%" stopColor={palette === 'creamWhite' ? '#CCA883' : palette === 'blushPink' ? '#CA7889' : palette === 'vintageBurgundy' ? '#4E242C' : '#944655'} />
        </linearGradient>

        <radialGradient id={`${gradPrefix}-core`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={palette === 'creamWhite' ? '#F8E9D2' : palette === 'blushPink' ? '#FCE3E8' : palette === 'vintageBurgundy' ? '#BD7280' : '#F7CBD3'} />
          <stop offset="60%" stopColor={palette === 'creamWhite' ? '#DFC29D' : palette === 'blushPink' ? '#DF94A3' : palette === 'vintageBurgundy' ? '#7E3F4C' : '#D78494'} />
          <stop offset="100%" stopColor={palette === 'creamWhite' ? '#B88F60' : palette === 'blushPink' ? '#B8586B' : palette === 'vintageBurgundy' ? '#401C23' : '#75323E'} />
        </radialGradient>
      </defs>

      {/* --- LAYER 0: Calyx Sepals (green leaflets underneath that peel back) --- */}
      <g
        className="rose-sepals"
        style={{
          transformOrigin: '100px 10px',
          opacity: Math.min(1, p * 3),
        }}
      >
        {/* Left sepal */}
        <path
          d="M96,12 C88,14 74,24 64,36 C76,28 90,20 98,15 Z"
          fill="#6F7B57"
          stroke="#4F583E"
          strokeWidth="0.8"
          style={{
            transformOrigin: '98px 14px',
            transform: `rotate(${sepalsProgress * -38}deg) scale(${0.7 + sepalsProgress * 0.3})`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.3, 1)',
          }}
        />
        {/* Right sepal */}
        <path
          d="M104,12 C112,14 126,24 136,36 C124,28 110,20 102,15 Z"
          fill="#6F7B57"
          stroke="#4F583E"
          strokeWidth="0.8"
          style={{
            transformOrigin: '102px 14px',
            transform: `rotate(${sepalsProgress * 38}deg) scale(${0.7 + sepalsProgress * 0.3})`,
            transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.3, 1)',
          }}
        />
        {/* Bottom sepal */}
        <path
          d="M98,15 C98,25 99,38 100,48 C101,38 102,25 102,15 Z"
          fill="#626D4D"
          stroke="#4F583E"
          strokeWidth="0.8"
          style={{
            transformOrigin: '100px 15px',
            transform: `scaleY(${0.6 + sepalsProgress * 0.4})`,
          }}
        />
      </g>

      {/* --- LAYER 1: Outermost Petals (Large curved petals that flare wide) --- */}
      <g
        className="rose-outer-petals"
        style={{
          transformOrigin: '100px 0px',
          transform: `scale(${0.35 + outerProgress * 0.65})`,
          opacity: Math.min(1, p * 2.5),
          transition: 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Outer Petal 1 (Far Left Flange) */}
        <path
          d="M96,6 C78,-6 52,4 42,24 C34,40 46,62 66,66 C82,70 94,54 96,28 Z"
          fill={`url(#${gradPrefix}-outer)`}
          stroke="rgba(112, 67, 75, 0.3)"
          strokeWidth="0.8"
          style={{
            transformOrigin: '96px 20px',
            transform: `rotate(${outerProgress * -26}deg) translateY(${outerProgress * 4}px)`,
          }}
        />

        {/* Outer Petal 2 (Far Right Flange) */}
        <path
          d="M104,6 C122,-6 148,4 158,24 C166,40 154,62 134,66 C118,70 106,54 104,28 Z"
          fill={`url(#${gradPrefix}-outer)`}
          stroke="rgba(112, 67, 75, 0.3)"
          strokeWidth="0.8"
          style={{
            transformOrigin: '104px 20px',
            transform: `rotate(${outerProgress * 26}deg) translateY(${outerProgress * 4}px)`,
          }}
        />

        {/* Outer Petal 3 (Top Left Cap) */}
        <path
          d="M98,4 C82,-20 62,-26 50,-14 C40,-2 46,24 64,30 C80,36 96,20 98,4 Z"
          fill={`url(#${gradPrefix}-outer)`}
          stroke="rgba(112, 67, 75, 0.25)"
          strokeWidth="0.8"
          style={{
            transformOrigin: '98px 10px',
            transform: `rotate(${outerProgress * -16}deg) scale(${0.7 + outerProgress * 0.3})`,
          }}
        />

        {/* Outer Petal 4 (Top Right Cap) */}
        <path
          d="M102,4 C118,-20 138,-26 150,-14 C160,-2 154,24 136,30 C120,36 104,20 102,4 Z"
          fill={`url(#${gradPrefix}-outer)`}
          stroke="rgba(112, 67, 75, 0.25)"
          strokeWidth="0.8"
          style={{
            transformOrigin: '102px 10px',
            transform: `rotate(${outerProgress * 16}deg) scale(${0.7 + outerProgress * 0.3})`,
          }}
        />

        {/* Outer Petal 5 (Bottom Cradle Petal) */}
        <path
          d="M72,28 C74,48 84,68 100,72 C116,68 126,48 128,28 C120,38 100,42 72,28 Z"
          fill={`url(#${gradPrefix}-outer)`}
          stroke="rgba(112, 67, 75, 0.2)"
          strokeWidth="0.8"
          style={{
            transformOrigin: '100px 30px',
            transform: `translateY(${outerProgress * 6}px)`,
          }}
        />
      </g>

      {/* --- LAYER 2: Mid-tier Cupped Petals (Volumetric petals) --- */}
      <g
        className="rose-mid-petals"
        style={{
          transformOrigin: '100px 6px',
          transform: `scale(${0.45 + midProgress * 0.55})`,
          opacity: Math.min(1, p * 3),
          transition: 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
        }}
      >
        {/* Mid Petal Left */}
        <path
          d="M98,8 C82,-4 68,2 62,18 C58,32 70,44 86,42 C96,40 100,24 98,8 Z"
          fill={`url(#${gradPrefix}-mid)`}
          stroke="rgba(112, 67, 75, 0.3)"
          strokeWidth="0.75"
          style={{
            transformOrigin: '98px 12px',
            transform: `rotate(${midProgress * -14}deg)`,
          }}
        />

        {/* Mid Petal Right */}
        <path
          d="M102,8 C118,-4 132,2 138,18 C142,32 130,44 114,42 C104,40 100,24 102,8 Z"
          fill={`url(#${gradPrefix}-mid)`}
          stroke="rgba(112, 67, 75, 0.3)"
          strokeWidth="0.75"
          style={{
            transformOrigin: '102px 12px',
            transform: `rotate(${midProgress * 14}deg)`,
          }}
        />

        {/* Mid Petal Top Overlap */}
        <path
          d="M84,-2 C88,-16 100,-22 112,-20 C122,-18 124,-6 116,4 C104,12 88,8 84,-2 Z"
          fill={`url(#${gradPrefix}-mid)`}
          stroke="rgba(112, 67, 75, 0.25)"
          strokeWidth="0.75"
          style={{
            transformOrigin: '100px -6px',
            transform: `scale(${0.6 + midProgress * 0.4})`,
          }}
        />

        {/* Mid Petal Bottom Curve */}
        <path
          d="M82,18 C84,32 94,44 104,44 C114,44 120,32 118,18 C110,26 94,26 82,18 Z"
          fill={`url(#${gradPrefix}-mid)`}
          stroke="rgba(112, 67, 75, 0.25)"
          strokeWidth="0.75"
          style={{
            transformOrigin: '100px 20px',
            transform: `translateY(${midProgress * 3}px)`,
          }}
        />
      </g>

      {/* --- LAYER 3: Dense Heart Spiral & Inner Petals --- */}
      <g
        className="rose-inner-core"
        style={{
          transformOrigin: '100px 6px',
          transform: `scale(${0.5 + innerProgress * 0.5}) rotate(${(1 - innerProgress) * 45}deg)`,
          transition: 'transform 0.5s cubic-bezier(0.3, 1.2, 0.6, 1)',
        }}
      >
        {/* Core spiral cup outer */}
        <path
          d="M88,4 C88,-8 100,-12 108,-10 C116,-8 118,2 114,10 C108,18 92,16 88,4 Z"
          fill={`url(#${gradPrefix}-core)`}
          stroke="rgba(112, 67, 75, 0.4)"
          strokeWidth="0.8"
        />

        {/* Swirling Inner Lip 1 */}
        <path
          d="M93,-2 C95,-8 104,-10 109,-6 C112,-2 110,6 104,8 C98,10 92,4 93,-2 Z"
          fill={`url(#${gradPrefix}-core)`}
          stroke="rgba(112, 67, 75, 0.35)"
          strokeWidth="0.7"
        />

        {/* Swirling Inner Lip 2 (Dense spiral center) */}
        <path
          d="M97,0 C98,-4 103,-5 106,-3 C108,-1 107,3 104,4 C100,5 97,3 97,0 Z"
          fill={palette === 'vintageBurgundy' ? '#4A1D25' : palette === 'creamWhite' ? '#A67B4E' : '#944150'}
        />

        {/* Center shadow dot */}
        <circle cx="102" cy="1" r="2.2" fill="rgba(60, 20, 28, 0.85)" />
      </g>
    </g>
  );
};
