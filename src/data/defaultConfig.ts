import { SiteConfig } from '../types';
import { extractYouTubeId } from '../utils/youtube';

export const DEFAULT_CONFIG: SiteConfig = {
  // Scene A: The Letter
  recipientName: 'Phakwan',
  senderName: 'จากคนึงหา',
  envelopeTitle: 'A little letter for you',
  envelopeSubtitle: 'แตะซองจดหมายเบา ๆ เพื่อเปิดดูสิ่งที่ซ่อนไว้',
  envelopeOpenButtonText: 'เปิดจดหมาย',
  letterPreviewLine: 'นี่คือท่วงทำนองและความรู้สึกที่เก็บไว้ให้เธอ...',
  letterStampText: 'จดหมายพิเศษ',
  letterSignoffText: 'ด้วยรักทั้งหมดของหัวใจ',

  // Scene B: Flower Transition
  flowerTitle: 'ดอกไม้บานเพื่อเธอ...',
  flowerSubtitle: 'สวนแห่งท่วงทำนองที่ค่อย ๆ คลี่บาน',
  flowerSkipText: 'ข้ามไปหน้าเพลง →',

  // Scene C: Songs Page
  journalTagText: '· สมุดบันทึกวินเทจ',
  songsKickerText: 'SIDE A · ท่วงทำนองหวานซึ้ง · มอบให้เธอคนเดียว',
  songsTitle: 'Songs for you',
  songsSubtitle: 'เทปเพลงคาสเซ็ทที่คัดสรรมาเพื่อหัวใจของเธอ',
  cassetteDeckBrandText: 'Stereo Cassette Deck',
  cassetteSideText: 'SIDE A · 45 RPM',
  cassetteMixtapeLabel: 'Mixtape No.',
  cassetteForSomeoneText: 'For Someone Special',
  cassettePlayingText: 'กำลังเล่นเทปเพลง...',
  cassetteReadyText: 'เทปพร้อมเล่น',
  cassettePauseText: 'หยุดชั่วคราว',

  // Tracklist
  tracklistTitle: 'รายการเพลงในม้วนเทป',
  tracklistSubtitle: 'เพลงที่คัดสรรมาให้เธอ',
  playlist: [
    {
      id: 'song-1',
      title: 'Until I Found You',
      artist: 'Stephen Sanchez',
      youtubeUrl: 'https://www.youtube.com/watch?v=GxldQ9eX2wo',
      youtubeId: 'GxldQ9eX2wo',
      note: 'เพลงโปรดที่ทำให้นึกถึงเธอเสมอ',
      duration: '2:57',
    },
    {
      id: 'song-2',
      title: 'La Vie En Rose',
      artist: 'Daniela Andrade (Acoustic)',
      youtubeUrl: 'https://www.youtube.com/watch?v=3Ba_WoSZXvw',
      youtubeId: '3Ba_WoSZXvw',
      note: 'โลกที่เป็นสีชมพูหวานละมุนเมื่อมีเธอ',
      duration: '3:05',
    },
    {
      id: 'song-3',
      title: 'Can’t Take My Eyes Off You',
      artist: 'Joseph Vincent (Acoustic)',
      youtubeUrl: 'https://www.youtube.com/watch?v=k_l2k9K2xR4',
      youtubeId: 'k_l2k9K2xR4',
      note: 'ไม่อาจละสายตาไปจากเธอได้เลย',
      duration: '3:45',
    },
  ],

  // Special Letter Card
  specialLetterTag: 'จดหมายจากใจ',
  specialLetterTitle: 'ถึงเธอ... คนที่แสนพิเศษ',
  specialMessage: `ทุกช่วงเวลาที่เงียบสงบจะอบอุ่นขึ้นเสมอเมื่อคิดถึงเธอ

ฉันตั้งใจรวบรวมของขวัญวินเทจชิ้นเล็ก ๆ และบทเพลงแสนละมุนเหล่านี้ เพื่อคอยเตือนว่าเธอนั้นมีค่าและเป็นที่รักมากแค่ไหน ไม่ว่าจะเปิดฟังเวลาใด ขอให้รู้ว่ามีใครคนหนึ่งกำลังส่งยิ้มและส่งความรักทั้งหมดไปให้นะ

ขอบคุณที่เข้ามาเป็นส่วนที่แสนหวานที่สุดในชีวิตของฉันเสมอมา`,
  specialLetterSignoff: 'รักและคิดถึงเสมอ,',

  // Memory Photo Card (Bottom)
  memoryCardTitle: 'ภาพความทรงจำของเรา',
  memoryCardQuote: '"ความทรงจำบางอย่าง ก็เหมือนดอกไม้แห้งที่ไม่เคยสูญเสียความงดงาม"',
  memoryCardPhotoUrl: '/src/assets/images/vintage_pressed_roses_1792873677915.jpg',

  // Footer
  footerTitle: 'สร้างสรรค์ด้วยความรักและท่วงทำนองวินเทจ',
  footerSubtitle: 'ความทรงจำที่เก็บไว้เพื่อเธอคนเดียวเสมอไป',

  // Typography
  fontPreset: 'minimal_chic',
  fontFamilyBody: 'Prompt',
  fontFamilyHandwriting: 'Charm',
  fontFamilyDisplay: 'Prompt',
};

const STORAGE_KEY = 'romantic_letter_app_config_v2';

export function loadSavedConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  try {
    // 1. Check path slug or query param (e.g. /phakwan or ?to=phakwan or ?name=phakwan)
    const rawPath = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
    const searchParams = new URLSearchParams(window.location.search);
    const toParam = searchParams.get('to') || searchParams.get('for') || searchParams.get('name') || searchParams.get('recipient');

    let slugRecipient: string | null = null;
    if (rawPath === 'phakwan' || rawPath.includes('phakwan')) {
      slugRecipient = 'Phakwan';
    } else if (toParam) {
      slugRecipient = decodeURIComponent(toParam);
    } else if (rawPath && !['index.html', '', 'app'].includes(rawPath)) {
      slugRecipient = decodeURIComponent(rawPath);
    }

    const hash = window.location.hash;
    if (hash && hash.startsWith('#conf=')) {
      const encoded = hash.slice(6);
      const decodedJson = decodeURIComponent(atob(encoded));
      const parsed = JSON.parse(decodedJson);
      if (parsed && typeof parsed === 'object') {
        const merged = {
          ...DEFAULT_CONFIG,
          ...parsed,
          ...(slugRecipient ? { recipientName: slugRecipient } : {}),
        };
        return sanitizeConfig(merged);
      }
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const config = sanitizeConfig({
          ...DEFAULT_CONFIG,
          ...parsed,
          ...(slugRecipient ? { recipientName: slugRecipient } : {}),
        });
        return config;
      }
    }

    if (slugRecipient) {
      return {
        ...DEFAULT_CONFIG,
        recipientName: slugRecipient,
      };
    }
  } catch (err) {
    console.warn('Could not parse saved config, using default', err);
  }

  return DEFAULT_CONFIG;
}

export function saveConfigToStorage(config: SiteConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Failed to save config to localStorage', err);
  }
}

export function generateShareableUrl(config: SiteConfig): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.delete('creator');
    url.searchParams.delete('edit');
    
    // Ensure recipient name is explicitly visible in the query string
    if (config.recipientName) {
      url.searchParams.set('to', config.recipientName.trim());
    }

    // Only serialize changes (diff) against DEFAULT_CONFIG to keep the URL ultra short!
    const diff: Partial<SiteConfig> = {};
    let hasDiff = false;

    (Object.keys(DEFAULT_CONFIG) as (keyof SiteConfig)[]).forEach((key) => {
      if (JSON.stringify(config[key]) !== JSON.stringify(DEFAULT_CONFIG[key])) {
        diff[key] = config[key] as any;
        hasDiff = true;
      }
    });

    if (hasDiff) {
      const json = JSON.stringify(diff);
      const encoded = btoa(encodeURIComponent(json));
      url.hash = `conf=${encoded}`;
    } else {
      url.hash = '';
    }

    return url.toString();
  } catch (err) {
    console.error('Failed to generate shareable URL', err);
    return window.location.href;
  }
}

export function sanitizeConfig(raw: Partial<SiteConfig>): SiteConfig {
  return {
    recipientName: raw.recipientName || DEFAULT_CONFIG.recipientName,
    senderName: raw.senderName || DEFAULT_CONFIG.senderName,
    envelopeTitle: raw.envelopeTitle || DEFAULT_CONFIG.envelopeTitle,
    envelopeSubtitle: raw.envelopeSubtitle || DEFAULT_CONFIG.envelopeSubtitle,
    envelopeOpenButtonText: raw.envelopeOpenButtonText || DEFAULT_CONFIG.envelopeOpenButtonText,
    letterPreviewLine: raw.letterPreviewLine || DEFAULT_CONFIG.letterPreviewLine,
    letterStampText: raw.letterStampText || DEFAULT_CONFIG.letterStampText,
    letterSignoffText: raw.letterSignoffText || DEFAULT_CONFIG.letterSignoffText,

    flowerTitle: raw.flowerTitle || DEFAULT_CONFIG.flowerTitle,
    flowerSubtitle: raw.flowerSubtitle || DEFAULT_CONFIG.flowerSubtitle,
    flowerSkipText: raw.flowerSkipText || DEFAULT_CONFIG.flowerSkipText,

    journalTagText: raw.journalTagText || DEFAULT_CONFIG.journalTagText,
    songsKickerText: raw.songsKickerText || DEFAULT_CONFIG.songsKickerText,
    songsTitle: raw.songsTitle || DEFAULT_CONFIG.songsTitle,
    songsSubtitle: raw.songsSubtitle || DEFAULT_CONFIG.songsSubtitle,
    cassetteDeckBrandText: raw.cassetteDeckBrandText || DEFAULT_CONFIG.cassetteDeckBrandText,
    cassetteSideText: raw.cassetteSideText || DEFAULT_CONFIG.cassetteSideText,
    cassetteMixtapeLabel: raw.cassetteMixtapeLabel || DEFAULT_CONFIG.cassetteMixtapeLabel,
    cassetteForSomeoneText: raw.cassetteForSomeoneText || DEFAULT_CONFIG.cassetteForSomeoneText,
    cassettePlayingText: raw.cassettePlayingText || DEFAULT_CONFIG.cassettePlayingText,
    cassetteReadyText: raw.cassetteReadyText || DEFAULT_CONFIG.cassetteReadyText,
    cassettePauseText: raw.cassettePauseText || DEFAULT_CONFIG.cassettePauseText,

    tracklistTitle: raw.tracklistTitle || DEFAULT_CONFIG.tracklistTitle,
    tracklistSubtitle: raw.tracklistSubtitle || DEFAULT_CONFIG.tracklistSubtitle,
    playlist: (raw.playlist && raw.playlist.length > 0
      ? raw.playlist.map((p, idx) => ({
          id: p.id || `custom-${idx}`,
          title: p.title || 'Untitled Melody',
          artist: p.artist || 'Special Artist',
          youtubeUrl: p.youtubeUrl || '',
          youtubeId: extractYouTubeId(p.youtubeUrl || '') || p.youtubeId || 'GxldQ9eX2wo',
          note: p.note || '',
          duration: p.duration || '',
        }))
      : DEFAULT_CONFIG.playlist),

    specialLetterTag: raw.specialLetterTag || DEFAULT_CONFIG.specialLetterTag,
    specialLetterTitle: raw.specialLetterTitle || DEFAULT_CONFIG.specialLetterTitle,
    specialMessage: raw.specialMessage || DEFAULT_CONFIG.specialMessage,
    specialLetterSignoff: raw.specialLetterSignoff || DEFAULT_CONFIG.specialLetterSignoff,

    memoryCardTitle: raw.memoryCardTitle || DEFAULT_CONFIG.memoryCardTitle,
    memoryCardQuote: raw.memoryCardQuote || DEFAULT_CONFIG.memoryCardQuote,
    memoryCardPhotoUrl: raw.memoryCardPhotoUrl || DEFAULT_CONFIG.memoryCardPhotoUrl,

    footerTitle: raw.footerTitle || DEFAULT_CONFIG.footerTitle,
    footerSubtitle: raw.footerSubtitle || DEFAULT_CONFIG.footerSubtitle,

    fontPreset: raw.fontPreset || DEFAULT_CONFIG.fontPreset,
    fontFamilyBody: raw.fontFamilyBody || DEFAULT_CONFIG.fontFamilyBody,
    fontFamilyHandwriting: raw.fontFamilyHandwriting || DEFAULT_CONFIG.fontFamilyHandwriting,
    fontFamilyDisplay: raw.fontFamilyDisplay || DEFAULT_CONFIG.fontFamilyDisplay,
  };
}
