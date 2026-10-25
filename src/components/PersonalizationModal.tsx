import React, { useRef, useState } from 'react';
import { DEFAULT_CONFIG, generateShareableUrl } from '../data/defaultConfig';
import {
  generateDefaultConfigFileContent,
  downloadConfigFile,
  exportConfigAsJson,
  saveConfigToProject,
} from '../utils/configExport';
import { FONT_OPTIONS, FONT_PRESETS, FontOption, FontPreset } from '../data/fonts';
import { SiteConfig, Song } from '../types';
import { copyToClipboard } from '../utils/clipboard';
import { extractYouTubeId } from '../utils/youtube';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  onSave: (newConfig: SiteConfig) => void;
  isCreator: boolean;
  onToggleCreator: () => void;
}

type TabType = 'fonts' | 'letter' | 'flower_deck' | 'photo_letter' | 'songs' | 'share';

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave,
  isCreator,
  onToggleCreator,
}) => {
  // Tab 0: Fonts & Typography
  const [fontPreset, setFontPreset] = useState(config.fontPreset || 'minimal_chic');
  const [fontFamilyBody, setFontFamilyBody] = useState(config.fontFamilyBody || 'Prompt');
  const [fontFamilyHandwriting, setFontFamilyHandwriting] = useState(config.fontFamilyHandwriting || 'Charm');
  const [fontFamilyDisplay, setFontFamilyDisplay] = useState(config.fontFamilyDisplay || 'Prompt');
  const [fontFilterCategory, setFontFilterCategory] = useState<'all' | 'minimal' | 'handwriting' | 'serif'>('all');

  // Tab 1: Names & Envelope
  const [recipientName, setRecipientName] = useState(config.recipientName);
  const [senderName, setSenderName] = useState(config.senderName);
  const [envelopeTitle, setEnvelopeTitle] = useState(config.envelopeTitle);
  const [envelopeSubtitle, setEnvelopeSubtitle] = useState(config.envelopeSubtitle);
  const [letterStampText, setLetterStampText] = useState(config.letterStampText || 'POSTAGE');
  const [letterPreviewLine, setLetterPreviewLine] = useState(config.letterPreviewLine || 'Dearest one, for your eyes only');
  const [letterSignoffText, setLetterSignoffText] = useState(config.letterSignoffText || 'Always Yours,');
  const [envelopeOpenButtonText, setEnvelopeOpenButtonText] = useState(config.envelopeOpenButtonText || 'Open Letter 💌');

  // Tab 2: Flower transition & Cassette Deck
  const [flowerTitle, setFlowerTitle] = useState(config.flowerTitle || 'Blooming for you...');
  const [flowerSubtitle, setFlowerSubtitle] = useState(config.flowerSubtitle || 'A garden of melodies unfolding');
  const [flowerSkipText, setFlowerSkipText] = useState(config.flowerSkipText || 'Skip →');
  const [journalTagText, setJournalTagText] = useState(config.journalTagText || 'Vintage Journal');
  const [songsKickerText, setSongsKickerText] = useState(config.songsKickerText || 'Side A · Acoustic & Ballads · Dedicated To You');
  const [songsTitle, setSongsTitle] = useState(config.songsTitle || 'Melodies of You & Me');
  const [songsSubtitle, setSongsSubtitle] = useState(config.songsSubtitle || 'A vintage mixtape curated with gentle devotion');
  const [cassetteDeckBrandText, setCassetteDeckBrandText] = useState(config.cassetteDeckBrandText || 'Stereo Cassette Deck');
  const [cassetteSideText, setCassetteSideText] = useState(config.cassetteSideText || 'SIDE A · 45 RPM');
  const [cassetteMixtapeLabel, setCassetteMixtapeLabel] = useState(config.cassetteMixtapeLabel || 'Mixtape No. {index}');
  const [cassetteForSomeoneText, setCassetteForSomeoneText] = useState(config.cassetteForSomeoneText || 'For Someone Special');
  const [cassettePlayingText, setCassettePlayingText] = useState(config.cassettePlayingText || 'Playing Tape');
  const [cassetteReadyText, setCassetteReadyText] = useState(config.cassetteReadyText || 'Tape Ready');
  const [tracklistTitle, setTracklistTitle] = useState(config.tracklistTitle || 'Mixtape Tracklist');
  const [tracklistSubtitle, setTracklistSubtitle] = useState(config.tracklistSubtitle || '{count} Handpicked Songs');

  // Tab 3: Special Letter, Memory Photo & Footer
  const [specialLetterTag, setSpecialLetterTag] = useState(config.specialLetterTag || 'Personal Keepsake');
  const [specialLetterTitle, setSpecialLetterTitle] = useState(config.specialLetterTitle || 'For Someone Truly Special');
  const [specialMessage, setSpecialMessage] = useState(config.specialMessage);
  const [specialLetterSignoff, setSpecialLetterSignoff] = useState(config.specialLetterSignoff || 'With all my love,');
  const [memoryCardTitle, setMemoryCardTitle] = useState(config.memoryCardTitle || 'Botanical Memory');
  const [memoryCardPhotoUrl, setMemoryCardPhotoUrl] = useState(
    config.memoryCardPhotoUrl || '/src/assets/images/vintage_pressed_roses_1792873677915.jpg'
  );
  const [memoryCardQuote, setMemoryCardQuote] = useState(
    config.memoryCardQuote || '"Some memories, like pressed roses, never lose their beauty."'
  );
  const [footerTitle, setFooterTitle] = useState(config.footerTitle || 'Handcrafted with gentle love & vintage songs');
  const [footerSubtitle, setFooterSubtitle] = useState(
    config.footerSubtitle || 'A romantic melody keepsake, kept safe just for you.'
  );

  // Tab 4: Songs
  const [playlist, setPlaylist] = useState<Song[]>(JSON.parse(JSON.stringify(config.playlist)));

  // State
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCleanLink, setCopiedCleanLink] = useState(false);
  const [copiedTsCode, setCopiedTsCode] = useState(false);
  const [isSavingToProject, setIsSavingToProject] = useState(false);
  const [projectSaveSuccess, setProjectSaveSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('fonts');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleApplyPreset = (preset: FontPreset) => {
    setFontPreset(preset.id);
    setFontFamilyBody(preset.bodyFont);
    setFontFamilyHandwriting(preset.handwritingFont);
    setFontFamilyDisplay(preset.displayFont);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('กรุณาเลือกไฟล์รูปภาพ (jpg, png, webp, gif)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const dataUrl = loadEvt.target?.result as string;
      if (dataUrl) {
        setMemoryCardPhotoUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSongChange = (index: number, field: keyof Song, value: string) => {
    const updated = [...playlist];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'youtubeUrl') {
      const extracted = extractYouTubeId(value);
      if (extracted) {
        updated[index].youtubeId = extracted;
      }
    }
    setPlaylist(updated);
  };

  const buildCurrentConfig = (): SiteConfig => {
    return {
      recipientName: recipientName.trim() || 'My Special Person',
      senderName: senderName.trim() || 'Yours Always',
      envelopeTitle: envelopeTitle.trim() || 'A little letter for you',
      envelopeSubtitle: envelopeSubtitle.trim() || 'Tap gently to open your envelope',
      letterStampText: letterStampText.trim() || 'POSTAGE',
      letterPreviewLine: letterPreviewLine.trim() || 'Dearest one, for your eyes only',
      letterSignoffText: letterSignoffText.trim() || 'Always Yours,',
      envelopeOpenButtonText: envelopeOpenButtonText.trim() || 'Open Letter 💌',

      flowerTitle: flowerTitle.trim() || 'Blooming for you...',
      flowerSubtitle: flowerSubtitle.trim() || 'A garden of melodies unfolding',
      flowerSkipText: flowerSkipText.trim() || 'Skip →',

      journalTagText: journalTagText.trim() || 'Vintage Journal',
      songsKickerText: songsKickerText.trim() || 'Side A · Acoustic & Ballads · Dedicated To You',
      songsTitle: songsTitle.trim() || 'Melodies of You & Me',
      songsSubtitle: songsSubtitle.trim() || 'A vintage mixtape curated with gentle devotion',

      cassetteDeckBrandText: cassetteDeckBrandText.trim() || 'Stereo Cassette Deck',
      cassetteSideText: cassetteSideText.trim() || 'SIDE A · 45 RPM',
      cassetteMixtapeLabel: cassetteMixtapeLabel.trim() || 'Mixtape No. {index}',
      cassetteForSomeoneText: cassetteForSomeoneText.trim() || 'For Someone Special',
      cassettePlayingText: cassettePlayingText.trim() || 'Playing Tape',
      cassetteReadyText: cassetteReadyText.trim() || 'Tape Ready',
      cassettePauseText: 'Pause',

      tracklistTitle: tracklistTitle.trim() || 'Mixtape Tracklist',
      tracklistSubtitle: tracklistSubtitle.trim() || '{count} Handpicked Songs',

      specialLetterTag: specialLetterTag.trim() || 'Personal Keepsake',
      specialLetterTitle: specialLetterTitle.trim() || 'For Someone Truly Special',
      specialMessage: specialMessage.trim() || DEFAULT_CONFIG.specialMessage,
      specialLetterSignoff: specialLetterSignoff.trim() || 'With all my love,',

      memoryCardTitle: memoryCardTitle.trim() || 'Botanical Memory',
      memoryCardPhotoUrl: memoryCardPhotoUrl.trim() || DEFAULT_CONFIG.memoryCardPhotoUrl || '',
      memoryCardQuote: memoryCardQuote.trim() || '"Some memories, like pressed roses, never lose their beauty."',

      footerTitle: footerTitle.trim() || 'Handcrafted with gentle love & vintage songs',
      footerSubtitle: footerSubtitle.trim() || 'A romantic melody keepsake, kept safe just for you.',

      fontPreset,
      fontFamilyBody,
      fontFamilyHandwriting,
      fontFamilyDisplay,

      playlist: playlist.map((s) => ({
        ...s,
        youtubeId: extractYouTubeId(s.youtubeUrl) || s.youtubeId || 'GxldQ9eX2wo',
      })),
    };
  };

  const handleSave = () => {
    const newConfig = buildCurrentConfig();
    onSave(newConfig);
    onClose();
  };

  const handleCopyShareLink = async () => {
    const currentConfig = buildCurrentConfig();
    const shareUrl = generateShareableUrl(currentConfig);
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3500);
    }
  };

  const getCleanShortUrl = (): string => {
    try {
      const url = new URL(window.location.href);
      url.search = '';
      url.hash = '';
      if (recipientName && recipientName.trim()) {
        url.searchParams.set('to', recipientName.trim());
      }
      return url.toString();
    } catch {
      return window.location.origin;
    }
  };

  const handleCopyCleanLink = async () => {
    const cleanUrl = getCleanShortUrl();
    const success = await copyToClipboard(cleanUrl);
    if (success) {
      setCopiedCleanLink(true);
      setTimeout(() => setCopiedCleanLink(false), 3500);
    }
  };

  const handleDirectSaveToProject = async () => {
    setIsSavingToProject(true);
    const currentConfig = buildCurrentConfig();
    onSave(currentConfig);
    try {
      const res = await saveConfigToProject(currentConfig);
      if (res.success) {
        setProjectSaveSuccess('✓ บันทึกลง defaultConfig.ts และอัปเดตไฟล์ .ZIP สำเร็จแล้ว!');
      } else {
        setProjectSaveSuccess('บันทึกในเครื่องแล้ว (กดดาวน์โหลด defaultConfig.ts ด้านล่างเพื่อนำไปอัปเดต)');
      }
    } catch {
      setProjectSaveSuccess('บันทึกการตั้งค่าเรียบร้อยแล้ว');
    } finally {
      setIsSavingToProject(false);
      setTimeout(() => setProjectSaveSuccess(null), 4500);
    }
  };

  const handleDownloadTs = () => {
    const currentConfig = buildCurrentConfig();
    downloadConfigFile(currentConfig);
  };

  const handleCopyTsCode = async () => {
    const currentConfig = buildCurrentConfig();
    const code = generateDefaultConfigFileContent(currentConfig);
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedTsCode(true);
      setTimeout(() => setCopiedTsCode(false), 3000);
    }
  };

  const handleExportJson = () => {
    const currentConfig = buildCurrentConfig();
    exportConfigAsJson(currentConfig);
  };

  const handleImportJsonFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      try {
        const parsed = JSON.parse(loadEvt.target?.result as string);
        if (parsed && typeof parsed === 'object') {
          if (parsed.recipientName) setRecipientName(parsed.recipientName);
          if (parsed.senderName) setSenderName(parsed.senderName);
          if (parsed.envelopeTitle) setEnvelopeTitle(parsed.envelopeTitle);
          if (parsed.envelopeSubtitle) setEnvelopeSubtitle(parsed.envelopeSubtitle);
          if (parsed.envelopeOpenButtonText) setEnvelopeOpenButtonText(parsed.envelopeOpenButtonText);
          if (parsed.letterPreviewLine) setLetterPreviewLine(parsed.letterPreviewLine);
          if (parsed.letterStampText) setLetterStampText(parsed.letterStampText);
          if (parsed.letterSignoffText) setLetterSignoffText(parsed.letterSignoffText);
          if (parsed.flowerTitle) setFlowerTitle(parsed.flowerTitle);
          if (parsed.flowerSubtitle) setFlowerSubtitle(parsed.flowerSubtitle);
          if (parsed.flowerSkipText) setFlowerSkipText(parsed.flowerSkipText);
          if (parsed.journalTagText) setJournalTagText(parsed.journalTagText);
          if (parsed.songsKickerText) setSongsKickerText(parsed.songsKickerText);
          if (parsed.songsTitle) setSongsTitle(parsed.songsTitle);
          if (parsed.songsSubtitle) setSongsSubtitle(parsed.songsSubtitle);
          if (parsed.cassetteDeckBrandText) setCassetteDeckBrandText(parsed.cassetteDeckBrandText);
          if (parsed.cassetteSideText) setCassetteSideText(parsed.cassetteSideText);
          if (parsed.cassetteMixtapeLabel) setCassetteMixtapeLabel(parsed.cassetteMixtapeLabel);
          if (parsed.cassetteForSomeoneText) setCassetteForSomeoneText(parsed.cassetteForSomeoneText);
          if (parsed.cassettePlayingText) setCassettePlayingText(parsed.cassettePlayingText);
          if (parsed.cassetteReadyText) setCassetteReadyText(parsed.cassetteReadyText);
          if (parsed.tracklistTitle) setTracklistTitle(parsed.tracklistTitle);
          if (parsed.tracklistSubtitle) setTracklistSubtitle(parsed.tracklistSubtitle);
          if (parsed.playlist) setPlaylist(parsed.playlist);
          if (parsed.specialLetterTag) setSpecialLetterTag(parsed.specialLetterTag);
          if (parsed.specialLetterTitle) setSpecialLetterTitle(parsed.specialLetterTitle);
          if (parsed.specialMessage) setSpecialMessage(parsed.specialMessage);
          if (parsed.specialLetterSignoff) setSpecialLetterSignoff(parsed.specialLetterSignoff);
          if (parsed.memoryCardTitle) setMemoryCardTitle(parsed.memoryCardTitle);
          if (parsed.memoryCardQuote) setMemoryCardQuote(parsed.memoryCardQuote);
          if (parsed.memoryCardPhotoUrl) setMemoryCardPhotoUrl(parsed.memoryCardPhotoUrl);
          if (parsed.footerTitle) setFooterTitle(parsed.footerTitle);
          if (parsed.footerSubtitle) setFooterSubtitle(parsed.footerSubtitle);
          if (parsed.fontPreset) setFontPreset(parsed.fontPreset);
          if (parsed.fontFamilyBody) setFontFamilyBody(parsed.fontFamilyBody);
          if (parsed.fontFamilyHandwriting) setFontFamilyHandwriting(parsed.fontFamilyHandwriting);
          if (parsed.fontFamilyDisplay) setFontFamilyDisplay(parsed.fontFamilyDisplay);
          setProjectSaveSuccess('✓ โหลดการตั้งค่าจากไฟล์ JSON สำเร็จ!');
          setTimeout(() => setProjectSaveSuccess(null), 3500);
        }
      } catch {
        alert('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (!window.confirm('คุณต้องการรีเซ็ตข้อความ ฟอนต์ และรูปภาพทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      return;
    }
    setFontPreset(DEFAULT_CONFIG.fontPreset || 'minimal_chic');
    setFontFamilyBody(DEFAULT_CONFIG.fontFamilyBody || 'Prompt');
    setFontFamilyHandwriting(DEFAULT_CONFIG.fontFamilyHandwriting || 'Charm');
    setFontFamilyDisplay(DEFAULT_CONFIG.fontFamilyDisplay || 'Prompt');

    setRecipientName(DEFAULT_CONFIG.recipientName);
    setSenderName(DEFAULT_CONFIG.senderName);
    setEnvelopeTitle(DEFAULT_CONFIG.envelopeTitle);
    setEnvelopeSubtitle(DEFAULT_CONFIG.envelopeSubtitle);
    setLetterStampText(DEFAULT_CONFIG.letterStampText || 'POSTAGE');
    setLetterPreviewLine(DEFAULT_CONFIG.letterPreviewLine || 'Dearest one, for your eyes only');
    setLetterSignoffText(DEFAULT_CONFIG.letterSignoffText || 'Always Yours,');
    setEnvelopeOpenButtonText(DEFAULT_CONFIG.envelopeOpenButtonText || 'Open Letter 💌');

    setFlowerTitle(DEFAULT_CONFIG.flowerTitle || 'Blooming for you...');
    setFlowerSubtitle(DEFAULT_CONFIG.flowerSubtitle || 'A garden of melodies unfolding');
    setFlowerSkipText(DEFAULT_CONFIG.flowerSkipText || 'Skip →');

    setJournalTagText(DEFAULT_CONFIG.journalTagText || 'Vintage Journal');
    setSongsKickerText(DEFAULT_CONFIG.songsKickerText || 'Side A · Acoustic & Ballads · Dedicated To You');
    setSongsTitle(DEFAULT_CONFIG.songsTitle);
    setSongsSubtitle(DEFAULT_CONFIG.songsSubtitle);

    setCassetteDeckBrandText(DEFAULT_CONFIG.cassetteDeckBrandText || 'Stereo Cassette Deck');
    setCassetteSideText(DEFAULT_CONFIG.cassetteSideText || 'SIDE A · 45 RPM');
    setCassetteMixtapeLabel(DEFAULT_CONFIG.cassetteMixtapeLabel || 'Mixtape No. {index}');
    setCassetteForSomeoneText(DEFAULT_CONFIG.cassetteForSomeoneText || 'For Someone Special');
    setCassettePlayingText(DEFAULT_CONFIG.cassettePlayingText || 'Playing Tape');
    setCassetteReadyText(DEFAULT_CONFIG.cassetteReadyText || 'Tape Ready');

    setTracklistTitle(DEFAULT_CONFIG.tracklistTitle || 'Mixtape Tracklist');
    setTracklistSubtitle(DEFAULT_CONFIG.tracklistSubtitle || '{count} Handpicked Songs');

    setSpecialLetterTag(DEFAULT_CONFIG.specialLetterTag || 'Personal Keepsake');
    setSpecialLetterTitle(DEFAULT_CONFIG.specialLetterTitle);
    setSpecialMessage(DEFAULT_CONFIG.specialMessage);
    setSpecialLetterSignoff(DEFAULT_CONFIG.specialLetterSignoff || 'With all my love,');

    setMemoryCardTitle(DEFAULT_CONFIG.memoryCardTitle || 'Botanical Memory');
    setMemoryCardPhotoUrl(DEFAULT_CONFIG.memoryCardPhotoUrl || '/src/assets/images/vintage_pressed_roses_1792873677915.jpg');
    setMemoryCardQuote(DEFAULT_CONFIG.memoryCardQuote || '"Some memories, like pressed roses, never lose their beauty."');

    setFooterTitle(DEFAULT_CONFIG.footerTitle || 'Handcrafted with gentle love & vintage songs');
    setFooterSubtitle(DEFAULT_CONFIG.footerSubtitle || 'A romantic melody keepsake, kept safe just for you.');

    setPlaylist(JSON.parse(JSON.stringify(DEFAULT_CONFIG.playlist)));
  };

  const filteredFontOptions = FONT_OPTIONS.filter((opt) => {
    if (fontFilterCategory === 'all') return true;
    return opt.category === fontFilterCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/55 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FAF6ED] border-2 border-[#D6C4A5] rounded-2xl shadow-2xl p-4 sm:p-6 text-[#493F39] my-4 max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D98D9C]/30 pb-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#81856A] font-sans-clean font-semibold">
              Creator Customization Studio
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#70434B]">
              ปรับแต่งฟอนต์มินิมอล & ข้อความทั้งเว็บ
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#E7D9BE]/50 hover:bg-[#E7D9BE] flex items-center justify-center text-[#70434B] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 mt-3 border-b border-[#E7D9BE] pb-2 text-xs font-sans-clean overflow-x-auto shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('fonts')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
              activeTab === 'fonts'
                ? 'bg-[#70434B] text-white shadow-xs'
                : 'text-[#70434B] hover:bg-[#E7D9BE]/40'
            }`}
          >
            <span>🔤</span>
            <span>เลือกฟอนต์มินิมอล</span>
          </button>
          <button
            onClick={() => setActiveTab('letter')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'letter'
                ? 'bg-[#D98D9C] text-white shadow-xs'
                : 'text-[#70434B] hover:bg-[#E7D9BE]/40'
            }`}
          >
            1. ซองจดหมาย
          </button>
          <button
            onClick={() => setActiveTab('flower_deck')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'flower_deck'
                ? 'bg-[#D98D9C] text-white shadow-xs'
                : 'text-[#70434B] hover:bg-[#E7D9BE]/40'
            }`}
          >
            2. ดอกไม้ & เทป
          </button>
          <button
            onClick={() => setActiveTab('photo_letter')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'photo_letter'
                ? 'bg-[#D98D9C] text-white shadow-xs'
                : 'text-[#70434B] hover:bg-[#E7D9BE]/40'
            }`}
          >
            3. เปลี่ยนรูป & จดหมาย
          </button>
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'songs'
                ? 'bg-[#D98D9C] text-white shadow-xs'
                : 'text-[#70434B] hover:bg-[#E7D9BE]/40'
            }`}
          >
            4. เพลง YouTube
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'share'
                ? 'bg-[#D98D9C] text-white shadow-xs'
                : 'text-[#70434B] hover:bg-[#E7D9BE]/40'
            }`}
          >
            5. ส่งต่อลิงก์ลับ
          </button>
        </div>

        {/* Tab 0: Fonts & Typography Selection */}
        {activeTab === 'fonts' && (
          <div className="mt-4 space-y-5 overflow-y-auto pr-1 flex-1">
            {/* Live Interactive Typography Preview */}
            <div className="p-4 bg-white/80 rounded-2xl border-2 border-[#D98D9C]/50 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-[#E7D9BE]/70">
                <span className="text-[10px] font-sans-clean uppercase tracking-widest text-[#81856A] font-bold">
                  👀 ตัวอย่างฟอนต์ที่คุณเลือก (Live Typography Preview)
                </span>
                <span className="text-xs text-[#70434B] font-mono font-medium">
                  {fontFamilyBody} + {fontFamilyHandwriting}
                </span>
              </div>

              {/* Sample Headline */}
              <div
                style={{ fontFamily: `'${fontFamilyDisplay}', sans-serif` }}
                className="text-2xl sm:text-3xl text-[#493F39] font-medium leading-tight"
              >
                Melodies of You & Me · บทเพลงของเรา
              </div>

              {/* Sample Handwriting */}
              <div
                style={{ fontFamily: `'${fontFamilyHandwriting}', cursive` }}
                className="text-xl sm:text-2xl text-[#70434B] leading-snug"
              >
                "รักและคิดถึงเธอเสมอ... แด่คนพิเศษของฉัน"
              </div>

              {/* Sample Body Paragraph */}
              <div
                style={{ fontFamily: `'${fontFamilyBody}', sans-serif` }}
                className="text-xs sm:text-sm text-[#493F39]/90 leading-relaxed bg-[#FAF6ED]/70 p-2.5 rounded-xl border border-[#D6C4A5]/40"
              >
                ทุกช่วงเวลาที่เงียบสงบจะอบอุ่นขึ้นเสมอเมื่อคิดถึงเธอ ของขวัญวินเทจชิ้นนี้จัดทำขึ้นด้วยใจเพื่อให้เธอได้ยิ้มทุกครั้งที่เปิดฟัง (ฟอนต์เนื้อหา: {fontFamilyBody})
              </div>
            </div>

            {/* Curated Presets Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-bold text-[#70434B] flex items-center gap-1.5">
                  <span>✨ 1. ชุดฟอนต์สำเร็จรูปสไตล์มินิมอล & วินเทจ (Font Presets)</span>
                </h3>
                <span className="text-[11px] text-[#81856A] font-sans-clean">คลิกเพื่อเลือกทันที</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FONT_PRESETS.map((preset) => {
                  const isSelected = fontPreset === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#F2E8D2] border-[#70434B] shadow-sm ring-1 ring-[#70434B]'
                          : 'bg-white/60 hover:bg-white border-[#D6C4A5]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans-clean text-xs font-bold text-[#70434B]">
                          {preset.name}
                        </span>
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#70434B]" />
                        )}
                      </div>
                      <p className="text-[11px] text-[#81856A] mt-1 leading-snug">
                        {preset.description}
                      </p>
                      <div className="mt-2 pt-1.5 border-t border-[#E7D9BE]/50 flex items-center justify-between text-[11px]">
                        <span
                          style={{ fontFamily: `'${preset.displayFont}', sans-serif` }}
                          className="text-[#493F39] truncate max-w-[120px]"
                        >
                          {preset.previewHeadline}
                        </span>
                        <span
                          style={{ fontFamily: `'${preset.handwritingFont}', cursive` }}
                          className="text-[#D98D9C] truncate max-w-[120px]"
                        >
                          {preset.previewHandwriting}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Individual Font Pickers */}
            <div className="p-4 bg-white/70 rounded-xl border border-[#D6C4A5] space-y-4">
              <h3 className="font-display text-base font-bold text-[#70434B]">
                🎨 2. ปรับเลือกฟอนต์เองตามใจชอบ (Custom Font Mixer)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Body / Main Font Picker */}
                <div>
                  <label className="block text-xs font-sans-clean font-bold text-[#70434B] mb-1">
                    ฟอนต์ข้อความหลักทั้งเว็บ (Body / Primary Font)
                  </label>
                  <p className="text-[10px] text-[#81856A] mb-1.5">
                    ใช้กับเนื้อหาจดหมาย ปุ่ม และข้อมูลทั้งหมด
                  </p>
                  <select
                    value={fontFamilyBody}
                    onChange={(e) => {
                      setFontFamilyBody(e.target.value);
                      setFontPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#70434B] font-medium"
                  >
                    <optgroup label="🌟 Minimalist & Clean (มินิมอล เรียบหรู)">
                      <option value="Prompt">Prompt (มินิมอลยอดนิยม เรียบหรู)</option>
                      <option value="Kanit">Kanit (โมเดิร์น คลีน สบายตา)</option>
                      <option value="Sarabun">Sarabun (มินิมอล สุภาพ อ่านง่าย)</option>
                      <option value="Mitr">Mitr (มินิมอลโค้งมน อบอุ่น)</option>
                      <option value="Bai Jamjuree">Bai Jamjuree (มินิมอลเหลี่ยม นอร์ดิกชิค)</option>
                      <option value="Krub">Krub (คลีน มนกลม สบายใจ)</option>
                      <option value="Chakra Petch">Chakra Petch (มินิมอลคมชัด มีสไตล์)</option>
                    </optgroup>
                    <optgroup label="📖 Classic Serif & Literary (คลาสสิก วรรณกรรม)">
                      <option value="Noto Serif Thai">Noto Serif Thai (วรรณกรรมคลาสสิก)</option>
                      <option value="Trirong">Trirong (หนังสือบทกวี)</option>
                      <option value="Pridi">Pridi (วินเทจ อบอุ่น)</option>
                      <option value="Taviraj">Taviraj (นวนิยายย้อนยุค)</option>
                    </optgroup>
                    <optgroup label="🧸 Soft & Cozy (น่ารัก อบอุ่น)">
                      <option value="Mali">Mali (ไดอารี่ น่ารักละมุน)</option>
                      <option value="Itim">Itim (การ์ตูน สดใส)</option>
                    </optgroup>
                  </select>
                </div>

                {/* Handwriting / Accent Font Picker */}
                <div>
                  <label className="block text-xs font-sans-clean font-bold text-[#70434B] mb-1">
                    ฟอนต์ลายมือ / ตัวเน้นพิเศษ (Handwriting Font)
                  </label>
                  <p className="text-[10px] text-[#81856A] mb-1.5">
                    ใช้กับลายเซ็น คำโปรยหวาน คำคม และชื่อคนพิเศษ
                  </p>
                  <select
                    value={fontFamilyHandwriting}
                    onChange={(e) => {
                      setFontFamilyHandwriting(e.target.value);
                      setFontPreset('custom');
                    }}
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#70434B] font-medium"
                  >
                    <optgroup label="✍️ Handwriting & Cursive (ลายมือโรแมนติก)">
                      <option value="Charm">Charm (ลายมือชดช้อย อ่อนหวาน)</option>
                      <option value="Charmonman">Charmonman (ลายมือประดิษฐ์ หรูหรา)</option>
                      <option value="Itim">Itim (ลายมือน่ารัก นุ่มนวล)</option>
                      <option value="Mali">Mali (ลายมือไดอารี่ อบอุ่น)</option>
                      <option value="Sriracha">Sriracha (ลายมือพู่กันธรรมชาติ)</option>
                    </optgroup>
                    <optgroup label="🌟 Minimalist (มินิมอล เรียบเกลี้ยง)">
                      <option value="Prompt">Prompt (มินิมอล 100%)</option>
                      <option value="Kanit">Kanit (โมเดิร์นคลีน)</option>
                      <option value="Mitr">Mitr (มินิมอลนุ่มนวล)</option>
                      <option value="Bai Jamjuree">Bai Jamjuree (มินิมอลนอร์ดิก)</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Display Headline Font Picker */}
              <div>
                <label className="block text-xs font-sans-clean font-bold text-[#70434B] mb-1">
                  ฟอนต์หัวข้อใหญ่ (Display Headline Font)
                </label>
                <select
                  value={fontFamilyDisplay}
                  onChange={(e) => {
                    setFontFamilyDisplay(e.target.value);
                    setFontPreset('custom');
                  }}
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#70434B] font-medium"
                >
                  <option value="Prompt">Prompt — มินิมอลโมเดิร์น คมชัด เรียบหรู</option>
                  <option value="Kanit">Kanit — โมเดิร์นมีมิติ ชัดเจน</option>
                  <option value="Bai Jamjuree">Bai Jamjuree — มินิมอลเหลี่ยมชิค สไตล์สถาปัตย์</option>
                  <option value="Mitr">Mitr — มินิมอล อบอุ่น นุ่มนวล</option>
                  <option value="Noto Serif Thai">Noto Serif Thai — วรรณกรรมโรแมนติกคลาสสิก</option>
                  <option value="Trirong">Trirong — คลาสสิก ยุค 80s</option>
                  <option value="Pridi">Pridi — วินเทจ อบอุ่น</option>
                  <option value="Mali">Mali — ตัวหนังสือไดอารี่ นุ่มละมุน</option>
                </select>
              </div>
            </div>

            {/* Font Catalog Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-sm font-bold text-[#70434B]">
                  📚 คลังฟอนต์ทั้งหมด (กดเพื่อลองฟังสำเนียงตัวหนังสือ)
                </h4>
                {/* Category Filters */}
                <div className="flex items-center gap-1 text-[11px] font-sans-clean">
                  <button
                    type="button"
                    onClick={() => setFontFilterCategory('all')}
                    className={`px-2 py-0.5 rounded-full cursor-pointer ${
                      fontFilterCategory === 'all'
                        ? 'bg-[#70434B] text-white'
                        : 'bg-[#E7D9BE]/50 text-[#70434B]'
                    }`}
                  >
                    ทั้งหมด
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontFilterCategory('minimal')}
                    className={`px-2 py-0.5 rounded-full cursor-pointer ${
                      fontFilterCategory === 'minimal'
                        ? 'bg-[#70434B] text-white'
                        : 'bg-[#E7D9BE]/50 text-[#70434B]'
                    }`}
                  >
                    มินิมอล
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontFilterCategory('handwriting')}
                    className={`px-2 py-0.5 rounded-full cursor-pointer ${
                      fontFilterCategory === 'handwriting'
                        ? 'bg-[#70434B] text-white'
                        : 'bg-[#E7D9BE]/50 text-[#70434B]'
                    }`}
                  >
                    ลายมือ
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontFilterCategory('serif')}
                    className={`px-2 py-0.5 rounded-full cursor-pointer ${
                      fontFilterCategory === 'serif'
                        ? 'bg-[#70434B] text-white'
                        : 'bg-[#E7D9BE]/50 text-[#70434B]'
                    }`}
                  >
                    คลาสสิก
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredFontOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="p-2.5 bg-white/70 rounded-xl border border-[#D6C4A5]/60 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#70434B] font-sans-clean">
                        {opt.name}
                      </span>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setFontFamilyBody(opt.id);
                            setFontPreset('custom');
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                            fontFamilyBody === opt.id
                              ? 'bg-[#70434B] text-white'
                              : 'bg-[#E7D9BE]/40 text-[#70434B] hover:bg-[#E7D9BE]'
                          }`}
                          title="ตั้งเป็นฟอนต์หลัก"
                        >
                          ตั้งเป็นฟอนต์หลัก
                        </button>
                        {opt.category === 'handwriting' && (
                          <button
                            type="button"
                            onClick={() => {
                              setFontFamilyHandwriting(opt.id);
                              setFontPreset('custom');
                            }}
                            className={`text-[10px] px-2 py-0.5 rounded transition-colors cursor-pointer ${
                              fontFamilyHandwriting === opt.id
                                ? 'bg-[#D98D9C] text-white'
                                : 'bg-[#E7D9BE]/40 text-[#70434B] hover:bg-[#E7D9BE]'
                            }`}
                            title="ตั้งเป็นฟอนต์ลายมือ"
                          >
                            ตั้งเป็นลายมือ
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-[10px] text-[#81856A] mt-0.5">{opt.description}</p>
                    <p
                      style={{ fontFamily: opt.family }}
                      className="text-sm text-[#493F39] mt-2 pt-1 border-t border-[#E7D9BE]/40"
                    >
                      {opt.previewSample}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Names & Envelope */}
        {activeTab === 'letter' && (
          <div className="mt-4 space-y-3.5 overflow-y-auto pr-1 flex-1">
            <div className="p-3 bg-[#FAF4E8] rounded-xl border border-[#D6C4A5]/60 text-xs text-[#81856A]">
              คุณสามารถเขียนเป็น <strong>ภาษาไทย</strong> หรือภาษาอังกฤษได้ทั้งหมด ตัวอักษรจะแสดงผลด้วยฟอนต์ไทยสไตล์วินเทจสวยงาม
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ชื่อคนพิเศษ (Recipient Name)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="เช่น เธอคนพิเศษ หรือ My Dearest"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ชื่อผู้ส่ง (Sender Name)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="เช่น คนที่รักเธอเสมอ หรือ Yours Always"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                ข้อความบนการ์ดหน้าแรก (Envelope Title)
              </label>
              <input
                type="text"
                value={envelopeTitle}
                onChange={(e) => setEnvelopeTitle(e.target.value)}
                placeholder="เช่น A little letter for you"
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
              />
            </div>

            <div>
              <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                คำบรรยายแนะนำด้านล่าง (Envelope Subtitle)
              </label>
              <input
                type="text"
                value={envelopeSubtitle}
                onChange={(e) => setEnvelopeSubtitle(e.target.value)}
                placeholder="เช่น แตะเบา ๆ เพื่อเปิดซองจดหมายของคุณ"
                className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ข้อความตราแสตมป์บนซอง (Stamp Text)
                </label>
                <input
                  type="text"
                  value={letterStampText}
                  onChange={(e) => setLetterStampText(e.target.value)}
                  placeholder="เช่น POSTAGE หรือ LOVE"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ข้อความบนปุ่มเปิดซอง (Open Button)
                </label>
                <input
                  type="text"
                  value={envelopeOpenButtonText}
                  onChange={(e) => setEnvelopeOpenButtonText(e.target.value)}
                  placeholder="เช่น Open Letter 💌 หรือ เปิดอ่านจดหมาย 💌"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  คำโปรยที่โผล่จากซองจดหมาย (Preview Line)
                </label>
                <input
                  type="text"
                  value={letterPreviewLine}
                  onChange={(e) => setLetterPreviewLine(e.target.value)}
                  placeholder="เช่น แด่เธอคนพิเศษ สำหรับเธอคนเดียวเท่านั้น"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  คำลงท้ายบนการ์ดในซอง (Signoff Text)
                </label>
                <input
                  type="text"
                  value={letterSignoffText}
                  onChange={(e) => setLetterSignoffText(e.target.value)}
                  placeholder="เช่น คิดถึงเสมอ, หรือ Always Yours,"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Flower Garden Transition & Cassette Deck */}
        {activeTab === 'flower_deck' && (
          <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Flower Section */}
            <div className="p-3.5 bg-white/70 rounded-xl border border-[#D6C4A5] space-y-3">
              <h3 className="font-display text-sm font-bold text-[#70434B] flex items-center gap-1.5">
                <span>🌸 ข้อความฉากดอกไม้บาน (Flower Transition Scene)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    ข้อความกระซิบตอนดอกไม้บาน (Title)
                  </label>
                  <input
                    type="text"
                    value={flowerTitle}
                    onChange={(e) => setFlowerTitle(e.target.value)}
                    placeholder="เช่น Blooming for you... หรือ เบ่งบานเพื่อเธอ..."
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    คำบรรยายใต้ดอกไม้บาน (Subtitle)
                  </label>
                  <input
                    type="text"
                    value={flowerSubtitle}
                    onChange={(e) => setFlowerSubtitle(e.target.value)}
                    placeholder="เช่น สวนดอกไม้แห่งท่วงทำนองที่กำลังเบ่งบาน"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ข้อความปุ่มข้าม (Skip Button)
                </label>
                <input
                  type="text"
                  value={flowerSkipText}
                  onChange={(e) => setFlowerSkipText(e.target.value)}
                  placeholder="เช่น ข้าม → หรือ Skip →"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            </div>

            {/* Cassette Deck & Page Header Section */}
            <div className="p-3.5 bg-white/70 rounded-xl border border-[#D6C4A5] space-y-3">
              <h3 className="font-display text-sm font-bold text-[#70434B] flex items-center gap-1.5">
                <span>📼 ข้อความบนเครื่องเล่นเทปวินเทจ & หน้ารวมเพลง</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    แท็กหัวเว็บ (Top Tag)
                  </label>
                  <input
                    type="text"
                    value={journalTagText}
                    onChange={(e) => setJournalTagText(e.target.value)}
                    placeholder="เช่น Vintage Journal หรือ บันทึกความทรงจำ"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    แถบหัวข้ออัลบั้ม (Kicker Banner)
                  </label>
                  <input
                    type="text"
                    value={songsKickerText}
                    onChange={(e) => setSongsKickerText(e.target.value)}
                    placeholder="เช่น Side A · บทเพลงพิเศษ · มอบให้เธอคนเดียว"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    ชื่อหัวข้อใหญ่ของเพลง (Songs Title)
                  </label>
                  <input
                    type="text"
                    value={songsTitle}
                    onChange={(e) => setSongsTitle(e.target.value)}
                    placeholder="เช่น Melodies of You & Me หรือ บทเพลงของเรา"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    คำบรรยายใต้ชื่อเพลง (Songs Subtitle)
                  </label>
                  <input
                    type="text"
                    value={songsSubtitle}
                    onChange={(e) => setSongsSubtitle(e.target.value)}
                    placeholder="เช่น มิกซ์เทปย้อนยุคที่คัดสรรมาด้วยหัวใจ"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    ยี่ห้อบนเครื่องเล่นเทป (Deck Brand)
                  </label>
                  <input
                    type="text"
                    value={cassetteDeckBrandText}
                    onChange={(e) => setCassetteDeckBrandText(e.target.value)}
                    placeholder="เช่น Stereo Cassette Deck"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    ข้อความมุมตลับเทป (Deck Side)
                  </label>
                  <input
                    type="text"
                    value={cassetteSideText}
                    onChange={(e) => setCassetteSideText(e.target.value)}
                    placeholder="เช่น SIDE A · 45 RPM"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    ป้ายชื่อตลับเทป (ใช้ &#123;index&#125; เพื่อแทนเลขแทร็ก)
                  </label>
                  <input
                    type="text"
                    value={cassetteMixtapeLabel}
                    onChange={(e) => setCassetteMixtapeLabel(e.target.value)}
                    placeholder="เช่น Mixtape No. {index} หรือ เทปม้วนที่ {index}"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    คำอุทิศลายมือบนตลับ (For Someone)
                  </label>
                  <input
                    type="text"
                    value={cassetteForSomeoneText}
                    onChange={(e) => setCassetteForSomeoneText(e.target.value)}
                    placeholder="เช่น For Someone Special หรือ แด่คนพิเศษของฉัน"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    สถานะกำลังเล่น (Playing Status)
                  </label>
                  <input
                    type="text"
                    value={cassettePlayingText}
                    onChange={(e) => setCassettePlayingText(e.target.value)}
                    placeholder="เช่น กำลังเล่นเพลง หรือ Playing Tape"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    สถานะพร้อมเล่น (Ready Status)
                  </label>
                  <input
                    type="text"
                    value={cassetteReadyText}
                    onChange={(e) => setCassetteReadyText(e.target.value)}
                    placeholder="เช่น เทปพร้อมเล่น หรือ Tape Ready"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    หัวข้อรายการเพลง (Tracklist Title)
                  </label>
                  <input
                    type="text"
                    value={tracklistTitle}
                    onChange={(e) => setTracklistTitle(e.target.value)}
                    placeholder="เช่น Mixtape Tracklist หรือ รายการบทเพลง"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    คำบรรยายจำนวนเพลง (ใช้ &#123;count&#125; เพื่อแทนจำนวน)
                  </label>
                  <input
                    type="text"
                    value={tracklistSubtitle}
                    onChange={(e) => setTracklistSubtitle(e.target.value)}
                    placeholder="เช่น {count} บทเพลงแห่งความทรงจำ"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Bottom Photo, Special Love Letter & Footer */}
        {activeTab === 'photo_letter' && (
          <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
            {/* MEMORY PHOTO CARD CUSTOMIZATION */}
            <div className="p-4 bg-[#FAF4E8] rounded-xl border-2 border-[#D98D9C]/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#D98D9C] font-sans-clean font-bold">
                    ★ เปลี่ยนรูปภาพด้านล่าง (Memory Photo)
                  </span>
                  <h3 className="font-display text-base font-bold text-[#70434B]">
                    รูปภาพคู่ / รูปดอกไม้ความทรงจำด้านล่าง
                  </h3>
                </div>
              </div>

              <p className="text-xs text-[#81856A] leading-relaxed">
                คุณสามารถเลือกไฟล์รูปถ่ายของคุณกับคนพิเศษจากเครื่อง/มือถือได้ทันที หรือวางลิงก์รูปภาพจากอินเทอร์เน็ต
              </p>

              {/* Upload Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-[#70434B] hover:bg-[#5C363D] text-white text-xs font-sans-clean font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <svg className="w-4 h-4 text-[#F0B7C3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>📷 เลือกรูปจากเครื่อง / มือถือ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMemoryCardPhotoUrl('/src/assets/images/vintage_pressed_roses_1792873677915.jpg')}
                  className="text-xs text-[#81856A] hover:text-[#70434B] underline cursor-pointer"
                >
                  ใช้รูปดอกกุหลาบวินเทจเดิม
                </button>
              </div>

              {/* URL fallback input */}
              <div>
                <label className="block text-[11px] font-sans-clean text-[#70434B] mb-1">
                  หรือวาง Image URL (ลิงก์รูปภาพ):
                </label>
                <input
                  type="text"
                  value={memoryCardPhotoUrl}
                  onChange={(e) => setMemoryCardPhotoUrl(e.target.value)}
                  placeholder="https://... หรือ Data URL"
                  className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>

              {/* Live Image Preview */}
              <div className="flex items-center gap-3 pt-2">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#D98D9C]/50 shadow-xs shrink-0 bg-[#E7D9BE]">
                  {memoryCardPhotoUrl ? (
                    <img
                      src={memoryCardPhotoUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-[#81856A]">
                      ไม่มีรูป
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={memoryCardTitle}
                    onChange={(e) => setMemoryCardTitle(e.target.value)}
                    placeholder="หัวข้อการ์ดรูป เช่น Botanical Memory หรือ ภาพความทรงจำของเรา"
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                  <input
                    type="text"
                    value={memoryCardQuote}
                    onChange={(e) => setMemoryCardQuote(e.target.value)}
                    placeholder='คำคมใต้รูป เช่น "Some memories, like pressed roses, never lose their beauty."'
                    className="w-full px-3 py-1.5 text-xs bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>
            </div>

            {/* Special Love Letter Section */}
            <div className="p-3.5 bg-white/70 rounded-xl border border-[#D6C4A5] space-y-3">
              <h3 className="font-display text-sm font-bold text-[#70434B]">
                💌 จดหมายบอกความในใจ (Special Love Letter)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    แท็กหัวการ์ดจดหมาย (Tag)
                  </label>
                  <input
                    type="text"
                    value={specialLetterTag}
                    onChange={(e) => setSpecialLetterTag(e.target.value)}
                    placeholder="เช่น Personal Keepsake หรือ บันทึกแทนใจ"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                    หัวข้อจดหมาย (Letter Title)
                  </label>
                  <input
                    type="text"
                    value={specialLetterTitle}
                    onChange={(e) => setSpecialLetterTitle(e.target.value)}
                    placeholder="เช่น For Someone Truly Special"
                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  เนื้อหาจดหมายพิเศษ (เขียนเป็นภาษาไทยได้เต็มที่)
                </label>
                <textarea
                  rows={6}
                  value={specialMessage}
                  onChange={(e) => setSpecialMessage(e.target.value)}
                  placeholder="เขียนความในใจของคุณที่นี่..."
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:outline-none focus:ring-1 focus:ring-[#D98D9C] font-body leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  คำลงท้ายจดหมายพิเศษ (Signoff)
                </label>
                <input
                  type="text"
                  value={specialLetterSignoff}
                  onChange={(e) => setSpecialLetterSignoff(e.target.value)}
                  placeholder="เช่น ด้วยรักและคิดถึงเสมอ, หรือ With all my love,"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            </div>

            {/* Footer Customization */}
            <div className="p-3.5 bg-white/70 rounded-xl border border-[#D6C4A5] space-y-3">
              <h3 className="font-display text-sm font-bold text-[#70434B]">
                🕊️ ข้อความส่วนท้ายเว็บไซต์ (Footer Messages)
              </h3>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ข้อความบรรทัดแรก (Footer Title)
                </label>
                <input
                  type="text"
                  value={footerTitle}
                  onChange={(e) => setFooterTitle(e.target.value)}
                  placeholder="เช่น Handcrafted with gentle love & vintage songs"
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
              <div>
                <label className="block text-xs font-sans-clean font-medium text-[#70434B] mb-1">
                  ข้อความสำหรับผู้รับ (Footer Subtitle For Recipient)
                </label>
                <input
                  type="text"
                  value={footerSubtitle}
                  onChange={(e) => setFooterSubtitle(e.target.value)}
                  placeholder="เช่น A romantic melody keepsake, kept safe just for you."
                  className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Songs */}
        {activeTab === 'songs' && (
          <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
            <p className="text-xs text-[#81856A]">
              วางลิงก์เพลงจาก YouTube (เช่น https://www.youtube.com/watch?v=... หรือ youtu.be/...) ได้ตามใจชอบ ระบบจะดึงรหัสเพลงให้อัตโนมัติ
            </p>
            {playlist.map((song, idx) => (
              <div key={song.id || idx} className="p-3.5 bg-white/75 rounded-xl border border-[#D6C4A5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#70434B]">แทร็กที่ {idx + 1}</span>
                  <span className="text-[11px] font-mono text-[#81856A]">{song.duration || 'Track'}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={song.title}
                    onChange={(e) => handleSongChange(idx, 'title', e.target.value)}
                    placeholder="ชื่อเพลง (Song Title)"
                    className="px-2.5 py-1.5 text-xs bg-white rounded border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                  <input
                    type="text"
                    value={song.artist}
                    onChange={(e) => handleSongChange(idx, 'artist', e.target.value)}
                    placeholder="ศิลปิน (Artist)"
                    className="px-2.5 py-1.5 text-xs bg-white rounded border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                  />
                </div>
                <input
                  type="text"
                  value={song.youtubeUrl}
                  onChange={(e) => handleSongChange(idx, 'youtubeUrl', e.target.value)}
                  placeholder="YouTube URL (เช่น https://www.youtube.com/watch?v=...)"
                  className="w-full px-2.5 py-1.5 text-xs bg-white rounded border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
                <input
                  type="text"
                  value={song.note || ''}
                  onChange={(e) => handleSongChange(idx, 'note', e.target.value)}
                  placeholder="บันทึกความรู้สึกสั้น ๆ เช่น เพลงที่ฟังแล้วนึกถึงรอยยิ้มเธอเสมอ"
                  className="w-full px-2.5 py-1.5 text-xs bg-white rounded border border-[#D6C4A5] focus:ring-1 focus:ring-[#D98D9C]"
                />
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: Shareable Surprise Link */}
        {activeTab === 'share' && (
          <div className="mt-4 space-y-3.5 overflow-y-auto pr-1 flex-1">
            {/* Global Default & Code Persistence Card */}
            <div className="p-3.5 bg-[#FAF4E8] rounded-xl border-2 border-[#70434B]/30 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs text-[#70434B]">
                  <span>💾</span>
                  <span>บันทึกข้อความลงไฟล์โค้ด (defaultConfig.ts) ให้ผู้เข้าชมทุกคนเห็นเป็นค่าเริ่มต้น</span>
                </div>
                <span className="text-[10px] bg-[#70434B] text-white px-2 py-0.5 rounded-full font-medium">
                  แนะนำสำหรับ Vercel
                </span>
              </div>
              <p className="text-[11px] text-[#493F39] leading-relaxed">
                ข้อความที่คุณปรับแต่งจะถูกบันทึกเป็นค่าเริ่มต้นหลักของระบบ เมื่อนำไป Deploy บน Vercel หรือส่งลิงก์หน้าหลัก (เช่น <strong>https://phakwan.vercel.app</strong>) ทุกคนที่เปิดจากมือถือหรืออุปกรณ์อื่นจะเห็นข้อความของคุณทันทีโดยไม่ต้องพึ่งพา LocalStorage ในเครื่องของพวกเขา
              </p>

              {projectSaveSuccess && (
                <div className="p-2 bg-[#A4AE8E]/25 border border-[#A4AE8E] text-[#493F39] text-xs rounded-lg font-medium flex items-center gap-1.5 animate-fadeIn">
                  <span>✨</span>
                  <span>{projectSaveSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDirectSaveToProject}
                  disabled={isSavingToProject}
                  className="px-3 py-2 bg-[#70434B] hover:bg-[#5C363D] disabled:opacity-60 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <span>💾</span>
                  <span>{isSavingToProject ? 'กำลังบันทึกลงโปรเจกต์...' : 'บันทึกลงโค้ดโปรเจกต์ทันที'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadTs}
                  className="px-3 py-2 bg-[#FAF4E8] hover:bg-[#E7D9BE] text-[#70434B] border border-[#70434B]/40 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>📥</span>
                  <span>ดาวน์โหลด defaultConfig.ts</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] border-t border-[#D6C4A5]/60">
                <button
                  type="button"
                  onClick={handleCopyTsCode}
                  className="text-[#70434B] underline hover:text-[#493F39] cursor-pointer flex items-center gap-1"
                >
                  <span>📋</span>
                  <span>{copiedTsCode ? '✓ คัดลอกโค้ดทั้งไฟล์แล้ว!' : 'คัดลอกโค้ด defaultConfig.ts'}</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="text-[#81856A] hover:text-[#70434B] underline cursor-pointer"
                  >
                    📤 สำรองข้อมูล (JSON)
                  </button>
                  <span className="text-[#D6C4A5]">|</span>
                  <button
                    type="button"
                    onClick={() => jsonFileInputRef.current?.click()}
                    className="text-[#81856A] hover:text-[#70434B] underline cursor-pointer"
                  >
                    📥 นำเข้าข้อมูล (JSON)
                  </button>
                  <input
                    ref={jsonFileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJsonFile}
                  />
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-[#FAF4E8] rounded-xl border border-[#A4AE8E]/40 text-xs text-[#493F39] leading-relaxed">
              <h4 className="font-semibold text-[#70434B] text-sm mb-1 flex items-center gap-1.5">
                <span>🔒 ความเป็นส่วนตัวเฉพาะคุณ (Creator Only):</span>
              </h4>
              <p className="text-[#493F39] mb-2">
                เมื่อคุณส่งลิงก์ด้านล่างนี้ให้คนพิเศษ <strong>คนพิเศษของคุณจะไม่เห็นปุ่ม Customize และจะไม่เห็นปุ่มคัดลอกลิงก์ใด ๆ ทั้งสิ้น!</strong> พวกเขาจะได้รับประสบการณ์เซอร์ไพรส์ที่สมบูรณ์แบบเสมือนเปิดการ์ดวินเทจจริง พร้อมฟอนต์ที่คุณตั้งค่าไว้
              </p>
              <ol className="list-decimal list-inside space-y-1 text-xs text-[#70434B]">
                <li>กดปุ่ม <strong>"คัดลอกลิงก์เซอร์ไพรส์"</strong> ด้านล่าง</li>
                <li>เปิดแอป <strong>LINE, Messenger, หรือ Instagram</strong></li>
                <li>กด <strong>วาง (Paste)</strong> แล้วส่งให้คนพิเศษได้ทันที</li>
              </ol>
            </div>

            {/* Option 1: Clean Short Link (No long hash!) */}
            <div className="p-3 bg-white/80 rounded-xl border border-[#D6C4A5] space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans-clean font-bold text-[#70434B] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A4AE8E]"></span>
                  <span>1. ลิงก์สั้นคลีน (Clean URL — สั้นกระชับ ไม่ยาว)</span>
                </label>
                <span className="text-[10px] text-[#81856A] bg-[#FAF4E8] px-2 py-0.5 rounded-full border border-[#D6C4A5]/60">
                  แนะนำสำหรับส่งในแชท
                </span>
              </div>
              <p className="text-[11px] text-[#493F39]">
                ลิงก์สั้นสะอาดตา ส่งง่าย ไม่มียาวเหยียด ผู้รับเปิดมาจะเห็นชื่อ <strong>{recipientName || 'Phakwan'}</strong> พร้อมเพลงและการ์ดทันที (ซ่อนปุ่มแก้ไขทั้งหมด)
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={getCleanShortUrl()}
                  className="w-full px-2.5 py-1.5 text-xs bg-[#FAF4E8] text-[#493F39] font-mono rounded-lg border border-[#D6C4A5] select-all"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopyCleanLink}
                  className="px-3.5 py-1.5 bg-[#70434B] hover:bg-[#5C363D] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer shadow-xs"
                >
                  {copiedCleanLink ? '✓ คัดลอกแล้ว!' : 'คัดลอกลิงก์สั้น'}
                </button>
              </div>
            </div>

            {/* Option 2: Full Shareable URL with live edits */}
            <div className="p-3 bg-white/60 rounded-xl border border-[#D6C4A5]/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-sans-clean font-medium text-[#70434B]">
                  2. ลิงก์ส่งต่อพร้อมข้อมูลทั้งหมด (Shareable Config URL):
                </label>
                <span className="text-[10px] text-[#81856A]">เปิดที่ไหนก็เห็นตรงกัน 100% ทันที</span>
              </div>
              <p className="text-[11px] text-[#493F39]">
                ลิงก์นี้จะฝังข้อมูลที่คุณแก้ไขทั้งหมดไว้ในลิงก์ ส่งให้ใครเปิดในมือถือเครื่องอื่นจะเห็นข้อความและรูปภาพของคุณทันทีแม้ยังไม่ได้ Deploy ใหม่
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={generateShareableUrl(buildCurrentConfig())}
                  className="w-full px-2.5 py-1.5 text-[11px] bg-[#FAF4E8] text-[#493F39] font-mono rounded-lg border border-[#D6C4A5] select-all truncate"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 bg-[#D98D9C] hover:bg-[#C97B8A] text-white text-xs font-semibold rounded-lg shrink-0 transition-colors cursor-pointer"
                >
                  {copiedLink ? 'คัดลอกแล้ว!' : 'คัดลอก'}
                </button>
              </div>
            </div>

            {/* Vercel .vercel.app Guide */}
            <div className="p-3.5 bg-gradient-to-br from-[#FAF4E8] to-[#F1E4CE] rounded-xl border border-[#CBB897] text-xs space-y-2.5 shadow-xs">
              <div className="flex items-center gap-1.5 text-[#70434B] font-bold text-xs">
                <span className="text-base">🚀</span>
                <span>ต้องการทำเป็นโดเมน .vercel.app (เช่น phakwan.vercel.app)?</span>
              </div>
              <p className="text-[#493F39] text-[11px] leading-relaxed">
                โค้ดชุดนี้เราได้ติดตั้งไฟล์ <strong>vercel.json</strong> และคอมไพล์โครงสร้าง Vite SPA ให้พร้อมขึ้น Vercel ได้ 100% ทันทีครับ:
              </p>
              <div className="bg-white/90 p-2.5 rounded-lg border border-[#D6C4A5]/70 space-y-2 text-[11px] text-[#493F39]">
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#70434B] text-white flex items-center justify-center text-[9px] shrink-0 mt-0.5">1</span>
                  <span>ดาวน์โหลดโฟลเดอร์โปรเจกต์นี้ หรือ Push เข้า GitHub ของคุณ</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#70434B] text-white flex items-center justify-center text-[9px] shrink-0 mt-0.5">2</span>
                  <span>เข้าเว็บ <strong>vercel.com</strong> (ล็อกอินด้วย GitHub) แล้วกด <strong>"Add New... Project"</strong></span>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#70434B] text-white flex items-center justify-center text-[9px] shrink-0 mt-0.5">3</span>
                  <span>ในช่อง <strong>Project Name</strong> พิมพ์คำว่า <strong>phakwan</strong> (หรือ phakwan-letter) แล้วกด <strong>Deploy</strong></span>
                </div>
                <div className="text-[#70434B] font-semibold pt-1 border-t border-[#E7D9BE]">
                  🎉 คุณจะได้เว็บโดเมน: <code className="bg-[#FAF4E8] px-1.5 py-0.5 rounded text-[#70434B] border border-[#D6C4A5] font-mono font-bold">https://phakwan.vercel.app</code> ส่งให้เธออย่างสวยงามและเป็นทางการ!
                </div>
                <div className="pt-2">
                  <a
                    href="/phakwan-letter.zip"
                    download="phakwan-letter.zip"
                    className="w-full py-2.5 px-3 bg-[#70434B] hover:bg-[#5C363D] text-white text-xs font-semibold rounded-lg text-center transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4 text-[#F0B7C3]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>📦 กดดาวน์โหลดไฟล์โปรเจกต์ (.ZIP) ตรงนี้ได้เลย</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick TinyURL Alternative */}
            <div className="p-3 bg-white/70 rounded-xl border border-[#D6C4A5] text-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#70434B] font-semibold text-xs">
                <span>⚡</span>
                <span>หรือย่อลิงก์ชื่อ Phakwan ใน 10 วินาทีผ่าน TinyURL (ไม่ต้องสมัครสมาชิก):</span>
              </div>
              <p className="text-[11px] text-[#81856A]">
                กดคัดลอก "ลิงก์สั้นคลีน" ด้านบน แล้วนำไปวางที่ <a href="https://tinyurl.com" target="_blank" rel="noopener noreferrer" className="text-[#70434B] underline font-medium">tinyurl.com</a> ตั้ง Alias ว่า <code className="font-mono text-[#70434B] font-bold">Phakwan</code> จะได้ <code className="font-mono text-[#70434B]">tinyurl.com/Phakwan</code> ได้ทันทีเช่นกันครับ
              </p>
            </div>

            {/* Toggle Preview Recipient View */}
            <div className="pt-2 border-t border-[#E7D9BE]/50 flex items-center justify-between text-xs">
              <span className="text-[#81856A]">
                {isCreator ? 'ปัจจุบันอยู่ใน: โหมดผู้สร้าง (เห็นปุ่มแก้ไข)' : 'ปัจจุบันอยู่ใน: โหมดผู้รับ (ซ่อนปุ่มแล้ว)'}
              </span>
              <button
                type="button"
                onClick={() => {
                  onToggleCreator();
                  onClose();
                }}
                className="text-xs text-[#70434B] underline font-medium hover:text-[#493F39] cursor-pointer"
              >
                {isCreator ? 'ทดลองสลับไปดูมุมมองผู้รับ (ซ่อนปุ่ม)' : 'สลับกลับมาโหมดผู้สร้าง'}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="mt-4 pt-3 border-t border-[#E7D9BE] flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="text-xs text-[#81856A] hover:text-[#70434B] underline cursor-pointer"
            >
              รีเซ็ตค่าเริ่มต้น (Reset Defaults)
            </button>
            <a
              href="/phakwan-letter.zip"
              download="phakwan-letter.zip"
              className="text-xs text-[#70434B] hover:text-[#493F39] font-medium flex items-center gap-1 underline cursor-pointer"
            >
              <span>📦 ดาวน์โหลดไฟล์ .ZIP</span>
            </a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs rounded-lg text-[#70434B] hover:bg-[#E7D9BE]/50 transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleDirectSaveToProject}
              disabled={isSavingToProject}
              className="px-3 py-1.5 text-xs rounded-lg bg-[#FAF4E8] hover:bg-[#E7D9BE] border border-[#70434B]/40 text-[#70434B] font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>💾</span>
              <span>{isSavingToProject ? 'กำลังบันทึก...' : 'บันทึกลงโค้ดโปรเจกต์'}</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-xs rounded-lg bg-[#70434B] hover:bg-[#5C363D] text-white font-medium transition-colors shadow-xs cursor-pointer"
            >
              บันทึกการเปลี่ยนแปลง (Save)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
