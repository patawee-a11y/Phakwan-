import React, { useState } from 'react';
import { SiteConfig, Song } from '../types';
import { VintageCassettePlayer } from './VintageCassettePlayer';
import { PhotoLightboxModal } from './PhotoLightboxModal';

interface SceneSongsProps {
  config: SiteConfig;
  onOpenSettings: () => void;
  onReplay: () => void;
  onCopyLink: () => void;
  isCreator: boolean;
  onToggleCreator: () => void;
}

export const SceneSongs: React.FC<SceneSongsProps> = ({
  config,
  onOpenSettings,
  onReplay,
  onCopyLink,
  isCreator,
  onToggleCreator,
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [tapCount, setTapCount] = useState(0);
  const [lightbox, setLightbox] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title?: string;
    caption?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
    caption: '',
  });

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

  const playlist = config.playlist;
  const currentSong = playlist[currentSongIndex] || playlist[0];

  const handleNextSong = () => {
    setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrevSong = () => {
    setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  const handleSelectSong = (index: number) => {
    setCurrentSongIndex(index);
  };

  return (
    <div className="relative min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8 selection:bg-[#F0B7C3]/30">
      {/* Decorative Botanical Flourishes in background */}
      <div className="fixed top-0 right-0 w-44 sm:w-64 h-44 sm:h-64 pointer-events-none opacity-25 lg:opacity-40 z-0">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#70434B]">
          <path d="M180,20 Q120,40 100,100 Q80,160 20,180" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="14" fill="#F0B7C3" fillOpacity="0.5" />
          <circle cx="150" cy="40" r="8" fill="#D98D9C" fillOpacity="0.4" />
          <circle cx="40" cy="160" r="10" fill="#E6A0B0" fillOpacity="0.5" />
          <path d="M120,60 Q150,80 140,110 Q110,90 120,60" fill="#A4AE8E" fillOpacity="0.3" stroke="#81856A" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="fixed bottom-0 left-0 w-44 sm:w-64 h-44 sm:h-64 pointer-events-none opacity-25 lg:opacity-40 z-0">
        <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-[#70434B]">
          <path d="M20,180 Q80,160 100,100 Q120,40 180,20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="12" fill="#F0B7C3" fillOpacity="0.4" />
          <circle cx="50" cy="160" r="8" fill="#D98D9C" fillOpacity="0.4" />
          <circle cx="160" cy="40" r="10" fill="#E6A0B0" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Top Bar for Scrapbook Utility */}
      <header className="relative z-10 max-w-5xl mx-auto flex items-center justify-between pb-6 border-b border-[#D6C4A5]/40">
        <div className="flex items-center gap-2">
          <span className="font-handwriting text-2xl sm:text-3xl text-[#70434B]">
            {config.recipientName}
          </span>
          <span className="text-xs uppercase tracking-widest text-[#81856A] font-sans-clean hidden sm:inline">
            · {config.journalTagText || 'Vintage Journal'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isCreator && (
            <>
              <button
                onClick={onCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans-clean font-medium text-[#70434B] bg-[#FAF6ED] hover:bg-[#F2E8D2] border border-[#D98D9C]/40 shadow-2xs transition-colors cursor-pointer"
                title="คัดลอกลิงก์ส่งให้คนพิเศษ"
              >
                <svg className="w-3.5 h-3.5 text-[#D98D9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>คัดลอกลิงก์</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans-clean font-medium text-[#70434B] bg-[#FAF6ED] hover:bg-[#F2E8D2] border border-[#D98D9C]/40 shadow-2xs transition-colors cursor-pointer"
                title="Customize songs and letter"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                <span>Customize</span>
              </button>
            </>
          )}

          <button
            onClick={onReplay}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-sans-clean font-medium text-[#70434B] bg-[#FAF6ED] hover:bg-[#F2E8D2] border border-[#D98D9C]/40 shadow-2xs transition-colors cursor-pointer"
            title="Return to envelope"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <span className="hidden sm:inline">Envelope</span>
          </button>
        </div>
      </header>

      {/* Main Title Banner */}
      <section className="relative z-10 max-w-5xl mx-auto text-center pt-8 pb-8">
        <div className="inline-flex items-center gap-2 mb-2 text-xs uppercase tracking-widest text-[#81856A] font-sans-clean font-semibold">
          <span>{config.songsKickerText || 'Side A · Acoustic & Ballads · Dedicated To You'}</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal text-[#493F39] tracking-tight">
          {config.songsTitle}
        </h1>
        <p className="font-handwriting text-xl sm:text-2xl text-[#70434B] mt-1.5">
          {config.songsSubtitle}
        </p>
      </section>

      {/* 2-Column Responsive Layout */}
      <main className="relative z-10 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Vintage Cassette Player + Tracklist (7 cols on desktop) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Cassette Deck Card */}
          <div className="relative">
            {/* Washi tape visual anchor on top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-5 washi-tape z-20 pointer-events-none rounded-xs" />

            <VintageCassettePlayer
              currentSong={currentSong}
              playlist={playlist}
              currentIndex={currentSongIndex}
              config={config}
              onSelectSong={handleSelectSong}
              onNextSong={handleNextSong}
              onPrevSong={handlePrevSong}
            />
          </div>

          {/* Interactive Playlist / Tracklist */}
          <div className="bg-[#FAF6ED] rounded-2xl p-4 sm:p-5 border border-[#D6C4A5] shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7D9BE]">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-[#70434B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                <h2 className="font-display text-lg font-bold text-[#493F39]">
                  {config.tracklistTitle || 'Mixtape Tracklist'}
                </h2>
              </div>
              <span className="text-[11px] font-sans-clean font-medium text-[#81856A]">
                {(config.tracklistSubtitle || '{count} Handpicked Songs').replace('{count}', String(playlist.length))}
              </span>
            </div>

            <div className="mt-3 divide-y divide-[#E7D9BE]/50">
              {playlist.map((song, idx) => {
                const isSelected = idx === currentSongIndex;
                return (
                  <button
                    key={song.id || idx}
                    onClick={() => handleSelectSong(idx)}
                    className={`w-full py-3 px-2 sm:px-3 rounded-xl flex items-center justify-between text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-[#F2E8D2] border border-[#D98D9C]/50 shadow-2xs'
                        : 'hover:bg-[#F8F1E4] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      {/* Track Number / Playing indicator */}
                      <div
                        className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-mono font-semibold ${
                          isSelected
                            ? 'bg-[#70434B] text-[#FAF6ED]'
                            : 'bg-[#E7D9BE] text-[#70434B]'
                        }`}
                      >
                        {isSelected ? '▶' : `${idx + 1}`}
                      </div>

                      <div className="min-w-0">
                        <p className={`text-sm font-serif font-medium truncate ${isSelected ? 'text-[#70434B] font-semibold' : 'text-[#493F39]'}`}>
                          {song.title}
                        </p>
                        <p className="text-xs text-[#81856A] italic truncate">
                          {song.artist}
                        </p>
                        {song.note && (
                          <p className="text-[11px] text-[#D98D9C] truncate mt-0.5 font-body">
                            "{song.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono text-[#81856A]">
                        {song.duration || 'Track'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Special Romantic Letter & Botanical Scrapbook (5 cols on desktop) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Handcrafted Love Letter Card */}
          <div className="relative bg-[#FAF6ED] rounded-2xl p-5 sm:p-7 border border-[#D6C4A5] shadow-lg">
            {/* Scrapbook Tape Accent */}
            <div className="absolute -top-3 right-6 w-24 h-5 washi-tape pointer-events-none rotate-3 rounded-xs" />

            {/* Letter Header with Stamp */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E7D9BE]">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#81856A] font-sans-clean font-semibold">
                  {config.specialLetterTag || 'Personal Keepsake'}
                </p>
                <h2 className="font-display text-2xl font-bold text-[#70434B] mt-0.5">
                  {config.specialLetterTitle}
                </h2>
                <p className="font-handwriting text-lg text-[#D98D9C]">
                  To: {config.recipientName}
                </p>
              </div>

              {/* Decorative Stamp */}
              <button
                type="button"
                onClick={() =>
                  setLightbox({
                    isOpen: true,
                    imageUrl: '/src/assets/images/vintage_wax_seal_roses_1792873678797.jpg',
                    title: 'Vintage Wax Seal Stamp',
                    caption: 'ตราประทับขี้ผึ้งกุหลาบวินเทจแห่งความทรงจำพิเศษ',
                  })
                }
                className="w-12 h-12 rounded-full overflow-hidden border border-[#D98D9C]/50 shadow-xs shrink-0 cursor-pointer hover:scale-110 hover:shadow-md transition-all active:scale-95 group/stamp relative"
                title="แตะเพื่อดูตราประทับขี้ผึ้ง"
                aria-label="View wax seal stamp"
              >
                <img
                  src="/src/assets/images/vintage_wax_seal_roses_1792873678797.jpg"
                  alt="Wax seal emblem"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute inset-0 bg-[#70434B]/25 opacity-0 group-hover/stamp:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px]">
                  🔍
                </span>
              </button>
            </div>

            {/* Letter Body Text */}
            <div className="py-4 font-body text-sm sm:text-base leading-relaxed text-[#493F39] whitespace-pre-line">
              {config.specialMessage}
            </div>

            {/* Handwritten Signature */}
            <div className="pt-3 border-t border-[#E7D9BE]/60 flex justify-end items-center">
              <div className="text-right">
                <span className="block text-xs font-body italic text-[#81856A]">
                  {config.specialLetterSignoff || 'With all my love,'}
                </span>
                <span className="font-handwriting text-2xl sm:text-3xl text-[#70434B] leading-none">
                  {config.senderName}
                </span>
              </div>
            </div>
          </div>

          {/* Dried Flower Scrapbook Keepsake Card / Memory Photo */}
          <div className="relative bg-[#FAF6ED] rounded-2xl p-4 border border-[#D6C4A5] shadow-md overflow-hidden group">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#A4AE8E]" />
                <h3 className="font-display text-base font-bold text-[#493F39]">
                  {config.memoryCardTitle || 'Botanical Memory'}
                </h3>
              </div>
              {isCreator && (
                <button
                  onClick={onOpenSettings}
                  className="text-[11px] font-sans-clean text-[#70434B] hover:text-[#D98D9C] underline cursor-pointer"
                >
                  เปลี่ยนรูปภาพ / ข้อความ
                </button>
              )}
            </div>
            
            {/* Clickable Photo with hover effects and view-full badge */}
            <div
              role="button"
              tabIndex={0}
              onClick={() =>
                setLightbox({
                  isOpen: true,
                  imageUrl: config.memoryCardPhotoUrl || '/src/assets/images/vintage_pressed_roses_1792873677915.jpg',
                  title: config.memoryCardTitle || 'ภาพความทรงจำของเรา',
                  caption: config.memoryCardQuote || '"ความทรงจำบางอย่าง ก็เหมือนดอกไม้แห้งที่ไม่เคยสูญเสียความงดงาม"',
                })
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setLightbox({
                    isOpen: true,
                    imageUrl: config.memoryCardPhotoUrl || '/src/assets/images/vintage_pressed_roses_1792873677915.jpg',
                    title: config.memoryCardTitle || 'ภาพความทรงจำของเรา',
                    caption: config.memoryCardQuote || '"ความทรงจำบางอย่าง ก็เหมือนดอกไม้แห้งที่ไม่เคยสูญเสียความงดงาม"',
                  });
                }
              }}
              className="relative h-52 sm:h-64 w-full rounded-xl overflow-hidden border border-[#D98D9C]/30 shadow-inner bg-[#F2E8D2] cursor-pointer group/photo transition-all duration-300"
              title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
              aria-label="Click to view full photo"
            >
              <img
                src={config.memoryCardPhotoUrl || '/src/assets/images/vintage_pressed_roses_1792873677915.jpg'}
                alt="Romantic Memory Photo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover/photo:scale-106 transition-transform duration-500"
              />

              {/* View Full Photo Badge */}
              <div className="absolute top-2.5 right-2.5 bg-[#FAF6ED]/95 backdrop-blur-xs text-[#70434B] text-[11px] font-sans-clean font-medium px-2.5 py-1 rounded-full border border-[#D6C4A5] shadow-xs flex items-center gap-1.5 opacity-90 group-hover/photo:opacity-100 group-hover/photo:scale-105 transition-all">
                <svg className="w-3.5 h-3.5 text-[#D98D9C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                </svg>
                <span>แตะดูรูปเต็ม</span>
              </div>

              {/* Quote Caption Overlay */}
              <div className="absolute bottom-2 left-2 right-2 bg-[#FAF6ED]/92 backdrop-blur-xs py-2 px-3 rounded-lg border border-[#D6C4A5]/60 text-center shadow-xs group-hover/photo:bg-[#FAF6ED]/98 transition-colors">
                <p className="font-handwriting text-base sm:text-lg text-[#70434B]">
                  {config.memoryCardQuote || '"Some memories, like pressed roses, never lose their beauty."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Gentle Footer */}
      <footer className="relative z-10 max-w-5xl mx-auto mt-12 pt-6 pb-6 text-center border-t border-[#D6C4A5]/40 text-xs text-[#81856A] font-body">
        <p className="font-handwriting text-lg sm:text-xl text-[#70434B] flex items-center justify-center gap-1.5">
          <span>{config.footerTitle || 'Handcrafted with gentle love & vintage songs'}</span>
          <button
            onClick={handleSecretTap}
            className="inline-block text-[#D98D9C] hover:text-[#70434B] cursor-default transition-transform active:scale-125"
            title="A little heart"
            aria-label="Secret toggle"
          >
            ♡
          </button>
        </p>
        {isCreator ? (
          <p className="text-[11px] mt-1 font-sans-clean text-[#81856A]">
            Creator Mode Active · Click Customize to edit or generate surprise links.
          </p>
        ) : (
          <p className="text-[11px] mt-1 font-sans-clean text-[#81856A]/80">
            {config.footerSubtitle || 'A romantic melody keepsake, kept safe just for you.'}
          </p>
        )}
      </footer>

      {/* Full-Screen Romantic Photo Lightbox Modal */}
      <PhotoLightboxModal
        isOpen={lightbox.isOpen}
        imageUrl={lightbox.imageUrl}
        title={lightbox.title}
        caption={lightbox.caption}
        onClose={() => setLightbox((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
