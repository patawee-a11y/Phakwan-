import React, { useEffect, useState } from 'react';

interface PhotoLightboxModalProps {
  isOpen: boolean;
  imageUrl: string;
  title?: string;
  caption?: string;
  onClose: () => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  isOpen,
  imageUrl,
  title,
  caption,
  onClose,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) {
      setIsZoomed(false);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6 bg-[#1A1412]/85 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Top Floating Controls Bar */}
      <div
        className="fixed top-4 right-4 sm:top-6 sm:right-6 z-80 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toggle Zoom button */}
        <button
          onClick={() => setIsZoomed((prev) => !prev)}
          className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#FAF6ED]/90 hover:bg-[#FAF6ED] text-[#70434B] border border-[#D98D9C]/50 shadow-lg text-xs font-sans-clean font-medium flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
          title={isZoomed ? 'ซูมออก' : 'ซูมเข้า'}
          aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {isZoomed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            )}
          </svg>
          <span className="hidden sm:inline">{isZoomed ? 'ซูมออก' : 'ซูมเข้า'}</span>
        </button>

        {/* Open Original in New Tab */}
        <a
          href={imageUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 sm:px-3 sm:py-2 rounded-full bg-[#FAF6ED]/90 hover:bg-[#FAF6ED] text-[#70434B] border border-[#D98D9C]/50 shadow-lg text-xs font-sans-clean font-medium flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
          title="เปิดรูปต้นฉบับในแท็บใหม่"
          aria-label="Open original image"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          <span className="hidden sm:inline">เปิดรูปเต็ม</span>
        </a>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FAF6ED]/90 hover:bg-[#FAF6ED] text-[#70434B] hover:text-[#493F39] border border-[#D98D9C]/50 shadow-lg flex items-center justify-center transition-transform active:scale-95 cursor-pointer backdrop-blur-xs"
          title="ปิด (Esc)"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Polaroid / Vintage Frame Card */}
      <div
        className="relative max-w-2xl w-full max-h-[92vh] flex flex-col items-center bg-[#FAF6ED] rounded-2xl p-4 sm:p-6 border-2 border-[#D6C4A5] shadow-2xl overflow-hidden transition-all duration-300 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Washi tape visual anchor on top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 washi-tape z-20 pointer-events-none rounded-xs rotate-1" />

        {/* Vintage Header */}
        <div className="w-full flex items-center justify-between pb-3 mb-2 border-b border-[#E7D9BE]/80 text-[#70434B]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A4AE8E]" />
            <h3 className="font-display text-base sm:text-lg font-bold text-[#493F39]">
              {title || 'ภาพความทรงจำพิเศษ'}
            </h3>
          </div>
          <span className="text-[11px] font-sans-clean text-[#81856A] uppercase tracking-wider">
            Vintage Keepsake
          </span>
        </div>

        {/* Photo Canvas Container */}
        <div
          className={`relative w-full rounded-xl overflow-hidden bg-[#241E1A] border border-[#D98D9C]/40 shadow-inner flex items-center justify-center transition-all ${
            isZoomed
              ? 'max-h-[68vh] overflow-auto cursor-zoom-out'
              : 'max-h-[62vh] sm:max-h-[68vh] cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed((prev) => !prev)}
          title={isZoomed ? 'คลิกเพื่อลดขนาด' : 'คลิกเพื่อซูมดูใกล้ ๆ'}
        >
          <img
            src={imageUrl}
            alt={title || 'Romantic Photo'}
            referrerPolicy="no-referrer"
            className={`max-w-full max-h-[60vh] sm:max-h-[66vh] object-contain transition-transform duration-300 select-none ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 hover:scale-102'
            }`}
          />

          {/* Quick zoom badge in corner */}
          <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-[#1A1412]/75 backdrop-blur-xs text-[11px] font-sans-clean font-medium text-[#FAF6ED] pointer-events-none flex items-center gap-1 border border-white/20">
            <svg className="w-3 h-3 text-[#F0B7C3]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
            </svg>
            <span>{isZoomed ? 'คลิกเพื่อย่อ' : 'คลิกเพื่อซูม'}</span>
          </div>
        </div>

        {/* Romantic Caption & Quote Section */}
        {caption && (
          <div className="w-full mt-3 pt-3 border-t border-[#E7D9BE]/80 text-center">
            <p className="font-handwriting text-lg sm:text-xl text-[#70434B] leading-relaxed">
              {caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
