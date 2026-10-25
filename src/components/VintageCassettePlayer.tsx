import React, { useEffect, useRef, useState } from 'react';
import { PlayerStatus, SiteConfig, Song } from '../types';

interface VintageCassettePlayerProps {
  currentSong: Song;
  playlist: Song[];
  currentIndex: number;
  config?: SiteConfig;
  onSelectSong: (index: number) => void;
  onNextSong: () => void;
  onPrevSong: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const VintageCassettePlayer: React.FC<VintageCassettePlayerProps> = ({
  currentSong,
  playlist,
  currentIndex,
  config,
  onSelectSong,
  onNextSong,
  onPrevSong,
}) => {
  const [playerStatus, setPlayerStatus] = useState<PlayerStatus>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showVideoEmbed, setShowVideoEmbed] = useState<boolean>(false);
  const [volume] = useState<number>(85);
  const [hasApiError, setHasApiError] = useState<boolean>(false);

  const playerRef = useRef<any>(null);
  const isReadyRef = useRef<boolean>(false);
  const pendingVideoIdRef = useRef<string | null>(null);
  const containerId = useRef(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const timerRef = useRef<number | null>(null);

  // Store latest callbacks to eliminate stale closure bugs
  const callbacksRef = useRef({ onNextSong, onPrevSong, currentSong });
  callbacksRef.current = { onNextSong, onPrevSong, currentSong };

  // Initialize YouTube Iframe Player ONCE on mount
  useEffect(() => {
    let isMounted = true;

    const setupPlayer = () => {
      if (!isMounted) return;
      if (!window.YT || !window.YT.Player) return;

      const element = document.getElementById(containerId.current);
      if (!element) return;

      // Clean up previous instance if any
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // ignore
        }
        playerRef.current = null;
        isReadyRef.current = false;
      }

      try {
        playerRef.current = new window.YT.Player(containerId.current, {
          height: '100%',
          width: '100%',
          videoId: currentSong.youtubeId || 'GxldQ9eX2wo',
          playerVars: {
            playsinline: 1,
            rel: 0,
            controls: 1,
            modestbranding: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              isReadyRef.current = true;
              setHasApiError(false);
              try {
                event.target.setVolume(volume);
              } catch (e) {}

              // If a track was selected while player was initializing, load it now
              if (pendingVideoIdRef.current) {
                const pendingId = pendingVideoIdRef.current;
                pendingVideoIdRef.current = null;
                try {
                  event.target.loadVideoById({
                    videoId: pendingId,
                    startSeconds: 0,
                  });
                  setPlayerStatus('playing');
                } catch (e) {
                  try {
                    event.target.cueVideoById(pendingId);
                    setPlayerStatus('paused');
                  } catch (err) {}
                }
              } else {
                setPlayerStatus('idle');
              }
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              // YT.PlayerState:
              // -1 = unstarted, 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
              const state = event.data;
              if (state === 1) {
                setPlayerStatus('playing');
                setHasApiError(false);
                try {
                  const d = event.target.getDuration();
                  if (d && d > 0) setDuration(d);
                } catch (e) {}
              } else if (state === 2) {
                setPlayerStatus('paused');
              } else if (state === 0) {
                setPlayerStatus('ended');
                callbacksRef.current.onNextSong();
              } else if (state === 3) {
                setPlayerStatus('loading');
              } else if (state === 5) {
                // Video cued and ready
                setPlayerStatus('paused');
                setHasApiError(false);
                try {
                  const d = event.target.getDuration();
                  if (d && d > 0) setDuration(d);
                } catch (e) {}
              } else if (state === -1) {
                // Unstarted
              }
            },
            onError: (err: any) => {
              if (!isMounted) return;
              console.warn('YouTube Player Event Error:', err?.data);
              setHasApiError(true);
              setPlayerStatus('error');
            },
          },
        });
      } catch (err) {
        console.error('Failed to create YouTube player', err);
        setHasApiError(true);
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      // Install callback without clobbering existing ones
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof prevCallback === 'function') {
          try {
            prevCallback();
          } catch (e) {}
        }
        setupPlayer();
      };

      if (!document.getElementById('yt-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'yt-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    }

    return () => {
      isMounted = false;
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
        playerRef.current = null;
        isReadyRef.current = false;
      }
    };
  }, []); // Run ONCE on mount

  // Watch for track change: seamlessly load and play new song
  useEffect(() => {
    if (!currentSong.youtubeId) return;

    setHasApiError(false);
    setCurrentTime(0);

    if (isReadyRef.current && playerRef.current) {
      setPlayerStatus('loading');
      try {
        if (typeof playerRef.current.loadVideoById === 'function') {
          playerRef.current.loadVideoById({
            videoId: currentSong.youtubeId,
            startSeconds: 0,
          });
          // Also explicitly attempt playback in case browser needs playVideo
          setTimeout(() => {
            if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
              try {
                playerRef.current.playVideo();
              } catch (e) {}
            }
          }, 150);
        } else if (typeof playerRef.current.cueVideoById === 'function') {
          playerRef.current.cueVideoById(currentSong.youtubeId);
          setPlayerStatus('paused');
        }
      } catch (err) {
        console.warn('Error loading new video', err);
        setHasApiError(true);
        setPlayerStatus('error');
      }
    } else {
      // Player not ready yet; queue this video to start as soon as onReady fires
      pendingVideoIdRef.current = currentSong.youtubeId;
    }
  }, [currentSong.youtubeId, currentIndex]);

  // Watchdog: Never let playerStatus stay stuck in 'loading' forever
  useEffect(() => {
    if (playerStatus === 'loading') {
      const timeout = setTimeout(() => {
        if (playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
          try {
            const s = playerRef.current.getPlayerState();
            if (s === 1) {
              setPlayerStatus('playing');
              return;
            }
            if (s === 2 || s === 5) {
              setPlayerStatus('paused');
              return;
            }
          } catch (e) {}
        }
        // Fallback: unstick status so controls are active
        setPlayerStatus('paused');
      }, 3500);

      return () => clearTimeout(timeout);
    }
  }, [playerStatus]);

  // Track playback time
  useEffect(() => {
    if (playerStatus === 'playing') {
      timerRef.current = window.setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const cur = playerRef.current.getCurrentTime();
            if (typeof cur === 'number' && !isNaN(cur)) {
              setCurrentTime(cur);
            }
            const dur = playerRef.current.getDuration();
            if (typeof dur === 'number' && dur > 0) {
              setDuration(dur);
            }
          } catch (e) {}
        }
      }, 400);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [playerStatus]);

  const handlePlay = () => {
    setHasApiError(false);
    if (isReadyRef.current && playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
      } catch (e) {
        console.warn('Play error', e);
      }
    }
    setPlayerStatus('playing');
  };

  const handlePause = () => {
    if (isReadyRef.current && playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      try {
        playerRef.current.pauseVideo();
      } catch (e) {
        console.warn('Pause error', e);
      }
    }
    setPlayerStatus('paused');
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (isReadyRef.current && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      try {
        playerRef.current.seekTo(val, true);
      } catch (e) {}
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const isPlaying = playerStatus === 'playing';

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Tape Deck Enclosure */}
      <div className="relative bg-[#EDE3D0] rounded-2xl p-4 sm:p-5 border-2 border-[#D6C4A5] shadow-xl">
        {/* Metallic Corner Screws */}
        <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[#B8A88E] border border-[#8C7B65] flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-[#6B5C47]" />
        </div>
        <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#B8A88E] border border-[#8C7B65] flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-[#6B5C47] rotate-45" />
        </div>
        <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-[#B8A88E] border border-[#8C7B65] flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-[#6B5C47] -rotate-30" />
        </div>
        <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-[#B8A88E] border border-[#8C7B65] flex items-center justify-center pointer-events-none">
          <div className="w-1.5 h-0.5 bg-[#6B5C47] rotate-90" />
        </div>

        {/* Brand Kicker / Deck Model */}
        <div className="flex items-center justify-between px-2 pb-2 text-[11px] uppercase tracking-wider text-[#81856A] font-sans-clean font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D98D9C]" />
            {config?.cassetteDeckBrandText || 'Stereo Cassette Deck'}
          </span>
          <span className="text-[#70434B]/70 font-mono text-[10px]">
            {config?.cassetteSideText || 'SIDE A · 45 RPM'}
          </span>
        </div>

        {/* Vintage Cassette Shell */}
        <div className="relative bg-[#38312B] rounded-xl p-3 border-2 border-[#4A413A] shadow-inner text-white overflow-hidden">
          {/* Cassette Paper Label */}
          <div className="relative bg-[#FAF5E8] text-[#493F39] rounded-lg p-2.5 border border-[#D98D9C]/40 shadow-sm">
            {/* Header Stripe */}
            <div className="flex items-center justify-between border-b border-[#D98D9C]/30 pb-1.5 mb-2">
              <span className="text-[10px] uppercase tracking-widest text-[#70434B] font-sans-clean font-bold">
                {(config?.cassetteMixtapeLabel || 'Mixtape No. {index}').replace('{index}', String(currentIndex + 1))}
              </span>
              <span className="font-handwriting text-base text-[#D98D9C] px-1">
                {config?.cassetteForSomeoneText || 'For Someone Special'}
              </span>
            </div>

            {/* Song Title and Artist display */}
            <div className="text-center py-1">
              <h3 className="font-display text-lg sm:text-xl font-bold text-[#493F39] leading-tight truncate">
                {currentSong.title}
              </h3>
              <p className="font-body italic text-xs text-[#70434B] truncate">
                {currentSong.artist}
              </p>
            </div>

            {/* Cassette Acrylic Window with Dual Rotating Spools */}
            <div className="relative mt-2 bg-[#1F1B18] rounded-md h-20 sm:h-22 border border-[#52473E] shadow-inner flex items-center justify-around px-4 overflow-hidden">
              {/* Tape ribbon between reels */}
              <div className="absolute top-1/2 left-16 right-16 h-1 bg-[#422918] -translate-y-1/2 z-0" />

              {/* Left Spool */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full border-2 border-[#E7D9BE]/80 bg-[#2B241E] flex items-center justify-center shadow-md transition-transform ${
                    isPlaying ? 'animate-tape-spin' : ''
                  }`}
                >
                  {/* Cog teeth */}
                  <div className="relative w-8 h-8 rounded-full border border-dashed border-[#F8F1E4] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#E7D9BE]" />
                    <div className="absolute w-1 h-2 bg-[#FAF6ED] -top-1" />
                    <div className="absolute w-1 h-2 bg-[#FAF6ED] -bottom-1" />
                    <div className="absolute w-2 h-1 bg-[#FAF6ED] -left-1" />
                    <div className="absolute w-2 h-1 bg-[#FAF6ED] -right-1" />
                  </div>
                </div>
              </div>

              {/* Center Tape Ruler Marks */}
              <div className="z-10 flex flex-col items-center gap-0.5 opacity-60 pointer-events-none">
                <div className="flex gap-1 text-[8px] text-[#A4AE8E] font-mono">
                  <span>100</span>
                  <span>50</span>
                  <span>0</span>
                </div>
                <div className="w-12 h-0.5 bg-[#A4AE8E]/40" />
              </div>

              {/* Right Spool */}
              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full border-2 border-[#E7D9BE]/80 bg-[#2B241E] flex items-center justify-center shadow-md transition-transform ${
                    isPlaying ? 'animate-tape-spin' : ''
                  }`}
                >
                  {/* Cog teeth */}
                  <div className="relative w-8 h-8 rounded-full border border-dashed border-[#F8F1E4] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-[#E7D9BE]" />
                    <div className="absolute w-1 h-2 bg-[#FAF6ED] -top-1" />
                    <div className="absolute w-1 h-2 bg-[#FAF6ED] -bottom-1" />
                    <div className="absolute w-2 h-1 bg-[#FAF6ED] -left-1" />
                    <div className="absolute w-2 h-1 bg-[#FAF6ED] -right-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Note attached to song */}
            {currentSong.note && (
              <p className="mt-2 text-center text-[11px] font-body italic text-[#81856A] truncate">
                "{currentSong.note}"
              </p>
            )}
          </div>
        </div>

        {/* Progress & Time Indicator */}
        <div className="mt-3 px-1">
          <div className="flex justify-between items-center text-xs font-mono text-[#70434B] mb-1">
            <span>{formatTime(currentTime)}</span>
            <span className="text-[10px] uppercase tracking-wider font-sans-clean font-semibold text-[#81856A]">
              {playerStatus === 'loading'
                ? 'กำลังโหลด...'
                : isPlaying
                ? config?.cassettePlayingText || 'กำลังเล่นเทปเพลง...'
                : playerStatus === 'error'
                ? 'ข้อจำกัดการเล่น'
                : config?.cassetteReadyText || 'เทปพร้อมเล่น'}
            </span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-[#D6C4A5] rounded-lg appearance-none cursor-pointer accent-[#D98D9C]"
            aria-label="Seek track"
          />
        </div>

        {/* Physical Vintage Push Buttons (Tactile Controls) */}
        <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-2.5">
          {/* PREVIOUS */}
          <button
            onClick={onPrevSong}
            className="flex flex-col items-center justify-center py-2.5 px-1 bg-[#F5ECDC] hover:bg-[#FAF4E8] active:translate-y-0.5 active:shadow-inner text-[#493F39] rounded-lg border border-[#C7B596] shadow-md transition-all cursor-pointer"
            aria-label="Previous Track"
            title="เพลงก่อนหน้า"
          >
            <svg className="w-4 h-4 text-[#70434B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
            <span className="text-[9px] uppercase font-sans-clean font-bold tracking-tight text-[#81856A] mt-1">
              Rew
            </span>
          </button>

          {/* PLAY */}
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border shadow-md transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#E0D0B7] border-[#A89679] shadow-inner translate-y-0.5 text-[#70434B] opacity-80 cursor-default'
                : 'bg-[#F0B7C3]/30 hover:bg-[#F0B7C3]/50 active:translate-y-0.5 active:shadow-inner border-[#D98D9C] text-[#70434B]'
            }`}
            aria-label="Play Track"
            title="เล่นเพลง"
          >
            <svg className="w-4 h-4 text-[#70434B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-[9px] uppercase font-sans-clean font-bold tracking-tight text-[#70434B] mt-1">
              Play
            </span>
          </button>

          {/* PAUSE */}
          <button
            onClick={handlePause}
            disabled={!isPlaying && playerStatus !== 'loading'}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border shadow-md transition-all cursor-pointer ${
              !isPlaying && playerStatus === 'paused'
                ? 'bg-[#E0D0B7] border-[#A89679] shadow-inner translate-y-0.5 text-[#493F39]'
                : isPlaying || playerStatus === 'loading'
                ? 'bg-[#F5ECDC] hover:bg-[#FAF4E8] active:translate-y-0.5 active:shadow-inner border-[#C7B596] text-[#493F39]'
                : 'bg-[#F5ECDC]/60 border-[#C7B596]/60 text-[#493F39]/50 cursor-not-allowed'
            }`}
            aria-label="Pause Track"
            title="หยุดเพลงชั่วคราว"
          >
            <svg className="w-4 h-4 text-[#70434B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <span className="text-[9px] uppercase font-sans-clean font-bold tracking-tight text-[#81856A] mt-1">
              Pause
            </span>
          </button>

          {/* NEXT */}
          <button
            onClick={onNextSong}
            className="flex flex-col items-center justify-center py-2.5 px-1 bg-[#F5ECDC] hover:bg-[#FAF4E8] active:translate-y-0.5 active:shadow-inner text-[#493F39] rounded-lg border border-[#C7B596] shadow-md transition-all cursor-pointer"
            aria-label="Next Track"
            title="เพลงถัดไป"
          >
            <svg className="w-4 h-4 text-[#70434B]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
            <span className="text-[9px] uppercase font-sans-clean font-bold tracking-tight text-[#81856A] mt-1">
              F.Fwd
            </span>
          </button>

          {/* TOGGLE VIDEO VIEW / EJECT */}
          <button
            onClick={() => setShowVideoEmbed(!showVideoEmbed)}
            className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-lg border shadow-md transition-all cursor-pointer ${
              showVideoEmbed
                ? 'bg-[#70434B] text-[#FAF6ED] border-[#70434B]'
                : 'bg-[#F5ECDC] hover:bg-[#FAF4E8] active:translate-y-0.5 active:shadow-inner text-[#493F39] border-[#C7B596]'
            }`}
            aria-label="Toggle YouTube Video Screen"
            title="สลับโหมดดูคลิปวิดีโอ YouTube"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-[9px] uppercase font-sans-clean font-bold tracking-tight mt-1">
              {showVideoEmbed ? 'Tape' : 'Video'}
            </span>
          </button>
        </div>

        {/* Error Fallback Notice if YouTube blocks inline embedding */}
        {hasApiError && (
          <div className="mt-3 p-2 bg-[#F8F1E4] border border-[#D98D9C] rounded-lg text-xs text-[#70434B] flex items-center justify-between gap-2">
            <span>วิดีโอมีข้อจำกัดสิทธิ์บนเว็บนี้</span>
            <a
              href={`https://www.youtube.com/watch?v=${currentSong.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold hover:text-[#493F39] inline-flex items-center gap-1 shrink-0"
            >
              เปิดฟังบน YouTube &rarr;
            </a>
          </div>
        )}

        {/* YouTube Video Screen */}
        {/* Kept mounted with valid dimensions so browser audio never throttles or stops */}
        <div
          className={`mt-3 transition-all duration-300 rounded-xl overflow-hidden border border-[#A4AE8E]/60 bg-black/90 shadow-md ${
            showVideoEmbed
              ? 'relative w-full h-48 sm:h-56 opacity-100'
              : 'fixed -left-[9999px] -top-[9999px] w-[320px] h-[180px] opacity-0 pointer-events-none'
          }`}
        >
          <div id={containerId.current} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
