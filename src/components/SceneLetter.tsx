import React, { useState } from 'react';
import { SiteConfig } from '../types';

interface SceneLetterProps {
  config: SiteConfig;
  onOpen: () => void;
  onOpenSettings: () => void;
  onCopyLink: () => void;
  isCreator: boolean;
  onToggleCreator: () => void;
}

type OpenStage = 'closed' | 'opening-flap' | 'letter-rising' | 'letter-revealed';

export const SceneLetter: React.FC<SceneLetterProps> = ({
  config,
  onOpen,
  onOpenSettings,
  onCopyLink,
  isCreator,
  onToggleCreator,
}) => {
  const [openStage, setOpenStage] = useState<OpenStage>('closed');
  const [tapCount, setTapCount] = useState(0);

  const handleSecretTap = () => {
    setTapCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        onToggleCreator();
        return 0;
      }
      setTimeout(() => setTapCount(0), 1800);
      return next;
    });
  };

  const handleOpenClick = () => {
    if (openStage !== 'closed') return;

    // Sequence of natural physical opening:
    // 1. Stage: opening-flap (0ms) -> Wax seal unlatches, top flap folds open 180deg upward
    setOpenStage('opening-flap');

    // 2. Stage: letter-rising (650ms) -> Flap is now open, letter paper starts sliding upward from inside the pocket
    setTimeout(() => {
      setOpenStage('letter-rising');
    }, 650);

    // 3. Stage: letter-revealed (1450ms) -> Letter card has fully cleared the envelope pocket, clearly legible
    setTimeout(() => {
      setOpenStage('letter-revealed');
    }, 1450);

    // 4. Stage: Transition to flower scene (2300ms)
    setTimeout(() => {
      onOpen();
    }, 2350);
  };

  const isFlapOpen = openStage !== 'closed';
  const isLetterRising = openStage === 'letter-rising' || openStage === 'letter-revealed';
  const isLetterRevealed = openStage === 'letter-revealed';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-8 select-none overflow-hidden">
      {/* Background delicate floral flourishes at corners (with secret tap to toggle creator mode) */}
      <div
        onClick={handleSecretTap}
        className="absolute top-0 left-0 p-6 opacity-40 md:opacity-60 transition-opacity cursor-default"
        title="Botanical Art"
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#70434B" strokeWidth="0.8">
          <path d="M10,10 Q40,15 50,45 Q55,20 85,15" />
          <circle cx="50" cy="45" r="4" fill="#F0B7C3" fillOpacity="0.5" />
          <circle cx="85" cy="15" r="3" fill="#D98D9C" fillOpacity="0.6" />
          <path d="M10,10 Q15,40 45,50" />
          <circle cx="45" cy="50" r="3.5" fill="#E6A0B0" fillOpacity="0.5" />
          <path d="M25,25 Q35,15 45,22 Q35,32 25,25" fill="#A4AE8E" fillOpacity="0.3" stroke="#81856A" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="absolute bottom-0 right-0 p-6 pointer-events-none opacity-40 md:opacity-60 transition-opacity rotate-180">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#70434B" strokeWidth="0.8">
          <path d="M10,10 Q40,15 50,45 Q55,20 85,15" />
          <circle cx="50" cy="45" r="4" fill="#F0B7C3" fillOpacity="0.5" />
          <circle cx="85" cy="15" r="3" fill="#D98D9C" fillOpacity="0.6" />
          <path d="M10,10 Q15,40 45,50" />
          <circle cx="45" cy="50" r="3.5" fill="#E6A0B0" fillOpacity="0.5" />
          <path d="M25,25 Q35,15 45,22 Q35,32 25,25" fill="#A4AE8E" fillOpacity="0.3" stroke="#81856A" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Top toolbar: ONLY visible to the creator */}
      {isCreator && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={onCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#70434B] bg-[#FAF6ED] hover:bg-[#F2E8D2] rounded-full border border-[#D98D9C]/40 shadow-xs backdrop-blur-xs transition-all duration-200 cursor-pointer"
            title="คัดลอกลิงก์ส่งให้คนพิเศษ"
            aria-label="Copy shareable link"
          >
            <svg className="w-3.5 h-3.5 text-[#D98D9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="font-sans-clean font-medium">คัดลอกลิงก์</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#70434B]/80 hover:text-[#70434B] bg-[#FAF6ED]/80 hover:bg-[#FAF6ED] rounded-full border border-[#D98D9C]/30 shadow-xs backdrop-blur-xs transition-all duration-200 cursor-pointer"
            title="Customize text and songs"
            aria-label="Customize message and songs"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span className="font-sans-clean font-medium">Customize</span>
          </button>
        </div>
      )}

      {/* Main Envelope Presentation */}
      <div className="w-full max-w-md flex flex-col items-center pt-24 sm:pt-28 pb-4">
        {/* Envelope Container (Physical Model) */}
        <div
          onClick={handleOpenClick}
          className={`relative w-72 sm:w-84 h-48 sm:h-56 cursor-pointer select-none transition-transform duration-700 ease-out ${
            openStage !== 'closed' ? 'scale-105' : 'hover:-translate-y-1'
          }`}
          style={{ perspective: '1200px' }}
          role="button"
          tabIndex={0}
          aria-label="Open romantic letter"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenClick();
            }
          }}
        >
          {/* Natural Soft Shadow underneath envelope */}
          <div
            className={`absolute -bottom-5 left-4 right-4 h-6 rounded-[50%] bg-[#493F39]/15 blur-md transition-all duration-700 pointer-events-none ${
              openStage !== 'closed' ? 'scale-110 opacity-70 blur-lg' : 'scale-95 opacity-50'
            }`}
          />

          {/* LAYER 1: Envelope Back Plate (Base) */}
          <div className="absolute inset-0 bg-[#E2D2B8] rounded-xl border border-[#D98D9C]/30 shadow-md overflow-hidden z-1">
            {/* Subtle vintage parchment texture and paper grain */}
            <div className="absolute inset-0 bg-radial from-[#F5ECDC] via-[#E7D9BE] to-[#D8C7A9] opacity-90" />
            {/* Inner pocket cavity shadow */}
            <div className="absolute inset-2 rounded-lg bg-linear-to-b from-[#B8A484]/40 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* LAYER 2: Envelope Top Flap (Lid) with Realistic 3D Fold */}
          {/* When closed: points DOWN (apex at y=112). When open: flips UP around top hinge to point UP (apex at y=-112). */}
          <div
            className="absolute top-0 left-0 right-0 h-[112px] transition-transform duration-750 ease-in-out pointer-events-none"
            style={{
              transformOrigin: 'top center',
              transform: isFlapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
              transformStyle: 'preserve-3d',
              zIndex: isFlapOpen ? 2 : 12,
            }}
          >
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 320 112"
              preserveAspectRatio="none"
            >
              <polygon
                points="0,0 320,0 160,112"
                fill={isFlapOpen ? '#EDE2CB' : '#FAF5EB'}
                stroke="#D6C4A5"
                strokeWidth="1"
              />
              {/* Delicate decorative gold-rose border */}
              <polyline
                points="12,4 308,4 160,104 12,4"
                fill="none"
                stroke="#D98D9C"
                strokeWidth="0.8"
                strokeOpacity={isFlapOpen ? 0.25 : 0.45}
              />
            </svg>
          </div>

          {/* LAYER 3: The Letter Paper Card (Rises smoothly from inside the pocket) */}
          <div
            className="absolute left-3.5 right-3.5 transition-all duration-800 ease-out"
            style={{
              top: '12px',
              height: '88%',
              transform: isLetterRising
                ? isLetterRevealed
                  ? 'translateY(-132px)'
                  : 'translateY(-118px)'
                : 'translateY(0px)',
              zIndex: isLetterRevealed ? 15 : 4,
              boxShadow: isLetterRevealed
                ? '0 12px 28px -6px rgba(73, 63, 57, 0.22), 0 4px 10px rgba(73, 63, 57, 0.1)'
                : '0 2px 6px rgba(73, 63, 57, 0.08)',
            }}
          >
            {/* The Physical Letter Paper */}
            <div className="w-full h-full bg-[#FAF6ED] rounded-lg border border-[#D98D9C]/40 p-3 sm:p-3.5 flex flex-col justify-between overflow-hidden relative">
              {/* Gold/Sage hairline inner border */}
              <div className="absolute inset-1.5 border border-[#A4AE8E]/30 rounded-sm pointer-events-none" />

              {/* Letter Header */}
              <div className="relative z-1 flex justify-between items-start">
                <span className="font-handwriting text-xl sm:text-2xl text-[#70434B] leading-none">
                  Dear {config.recipientName},
                </span>
                <span className="text-[9px] uppercase tracking-widest text-[#81856A] font-sans-clean font-semibold px-1 py-0.5 bg-[#FAF4E8] rounded border border-[#E7D9BE]">
                  {config.letterStampText || 'Special Post'}
                </span>
              </div>

              {/* Letter Content preview */}
              <div className="relative z-1 my-1 px-1 text-center">
                <p className="font-serif italic text-xs sm:text-sm text-[#493F39]/90 line-clamp-2 leading-relaxed">
                  "{config.letterPreviewLine || 'Here are gentle melodies and words kept close for you...'}"
                </p>
              </div>

              {/* Letter Sign-off */}
              <div className="relative z-1 flex justify-between items-end pt-1 border-t border-[#E7D9BE]/50">
                <span className="text-[9px] font-sans-clean text-[#81856A] italic">
                  {config.letterSignoffText || 'With all my love'}
                </span>
                <span className="font-handwriting text-base sm:text-lg text-[#D98D9C]">
                  {config.senderName} ♡
                </span>
              </div>
            </div>
          </div>

          {/* LAYER 4: Front Pocket Flaps (Left, Right, Bottom triangular pocket) */}
          {/* This layer sits in front of the lower portion of the letter card (z-index: 8), so the letter never shows through! */}
          <div className="absolute inset-0 pointer-events-none z-8">
            <svg className="w-full h-full" viewBox="0 0 320 220" preserveAspectRatio="none">
              <defs>
                {/* Pocket shadow pointing upward into cavity */}
                <filter id="pocketShadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="-2" stdDeviation="2.5" floodColor="#493F39" floodOpacity="0.12" />
                </filter>
              </defs>

              {/* Left triangle flap */}
              <polygon
                points="0,0 0,220 160,118"
                fill="#F2E8D2"
                stroke="#E2D2B8"
                strokeWidth="1"
              />
              {/* Right triangle flap */}
              <polygon
                points="320,0 320,220 160,118"
                fill="#EDE1CA"
                stroke="#E2D2B8"
                strokeWidth="1"
              />
              {/* Bottom triangle flap (Folds up over left and right flaps) */}
              <polygon
                points="0,220 320,220 160,108"
                fill="#FAF5EB"
                stroke="#DECDB0"
                strokeWidth="1"
                filter="url(#pocketShadow)"
              />

              {/* Delicate Botanical Vine on front of envelope */}
              <path
                d="M125,178 Q160,158 195,178"
                fill="none"
                stroke="#A4AE8E"
                strokeWidth="1.2"
                strokeDasharray="2.5 2.5"
              />
              <circle cx="160" cy="168" r="2.5" fill="#D98D9C" />
              <circle cx="145" cy="173" r="1.8" fill="#F0B7C3" />
              <circle cx="175" cy="173" r="1.8" fill="#F0B7C3" />
            </svg>
          </div>

          {/* LAYER 5: Wax Seal in Center (Anchored to tip of top flap when closed) */}
          <div
            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-400 ease-out ${
              openStage !== 'closed'
                ? 'opacity-0 scale-75 pointer-events-none'
                : 'opacity-100 scale-100 hover:scale-105'
            }`}
            style={{ zIndex: 14 }}
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#D98D9C] shadow-lg flex items-center justify-center p-0.5 border border-[#70434B]/30 overflow-hidden group">
              <img
                src="/src/assets/images/vintage_wax_seal_roses_1792873678797.jpg"
                alt="Rose Wax Seal"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full mix-blend-multiply opacity-90 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/30" />
            </div>
          </div>
        </div>

        {/* Text Details Beneath Envelope */}
        <div className="mt-8 text-center px-4">
          <p className="font-handwriting text-2xl sm:text-3xl text-[#70434B]">
            To: {config.recipientName}
          </p>
          <h1 className="font-display text-xl sm:text-2xl font-medium tracking-wide text-[#493F39] mt-1">
            {config.envelopeTitle}
          </h1>
          <p className="font-body text-xs sm:text-sm text-[#81856A] mt-1 max-w-xs mx-auto">
            {config.envelopeSubtitle}
          </p>

          {/* Elegant Open Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleOpenClick}
              disabled={openStage !== 'closed'}
              className={`group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FAF6ED] text-[#70434B] text-sm font-sans-clean font-medium tracking-wide border border-[#D98D9C]/50 shadow-sm hover:shadow-md hover:bg-[#F8F1E4] active:scale-98 transition-all duration-200 cursor-pointer ${
                openStage !== 'closed' ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#D98D9C] group-hover:scale-125 transition-transform" />
              <span>
                {openStage === 'closed'
                  ? (config.envelopeOpenButtonText || 'Open Letter')
                  : openStage === 'opening-flap'
                  ? 'Opening...'
                  : 'Reading Letter...'}
              </span>
              <svg
                className={`w-3.5 h-3.5 text-[#D98D9C] transition-transform duration-300 ${
                  openStage !== 'closed' ? 'translate-x-1' : 'group-hover:translate-x-0.5'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
