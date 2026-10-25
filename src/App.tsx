import React, { useState } from 'react';
import { SceneLetter } from './components/SceneLetter';
import { SceneFlowerTransition } from './components/SceneFlowerTransition';
import { SceneSongs } from './components/SceneSongs';
import { PersonalizationModal } from './components/PersonalizationModal';
import { DEFAULT_CONFIG, generateShareableUrl, loadSavedConfig, saveConfigToStorage } from './data/defaultConfig';
import { saveConfigToProject } from './utils/configExport';
import { Scene, SiteConfig } from './types';
import { copyToClipboard } from './utils/clipboard';

export default function App() {
  const [scene, setScene] = useState<Scene>('letter');
  const [config, setConfig] = useState<SiteConfig>(() => loadSavedConfig());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Determine whether the current viewer is the Creator or a Recipient
  const [isCreator, setIsCreator] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const search = window.location.search;
    const hash = window.location.hash;

    // 1. If explicit query parameter ?creator=1 or ?edit=1 is present, definitely creator
    if (search.includes('creator') || search.includes('edit')) {
      try {
        localStorage.setItem('romantic_letter_creator_mode', 'true');
      } catch (e) {}
      return true;
    }

    // 2. If a shared hash #conf=... or recipient param ?to= or ?for= is present without creator parameter, this is the recipient!
    // Recipients should NEVER see the customize or copy buttons.
    if (hash.startsWith('#conf=') || search.includes('to=') || search.includes('for=') || search.includes('guest=')) {
      return false;
    }

    // 3. Otherwise check localStorage preference
    try {
      const saved = localStorage.getItem('romantic_letter_creator_mode');
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {}

    // 4. Default for direct root visits by creator
    return true;
  });

  // Keep document title and social preview aligned with recipient's name (e.g. Phakwan)
  React.useEffect(() => {
    const name = config.recipientName?.trim() || 'Phakwan';
    document.title = `For ${name} 💌 - Romantic Vintage Love Letter & Music Player`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `For ${name} 💌 - A Little Letter For You`);
    }
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute('content', `For ${name} 💌 - A Little Letter For You`);
    }
  }, [config.recipientName]);

  const handleToggleCreator = () => {
    setIsCreator((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('romantic_letter_creator_mode', String(next));
      } catch (e) {}
      setToastMessage(
        next
          ? '✨ เข้าสู่โหมดผู้สร้าง (แสดงปุ่ม Customize และ คัดลอกลิงก์)'
          : '🔒 เข้าสู่โหมดผู้รับ (ซ่อนปุ่ม Customize และ คัดลอกลิงก์ทั้งหมดแล้ว)'
      );
      setTimeout(() => setToastMessage(null), 4000);
      return next;
    });
  };

  const handleOpenLetter = () => {
    setScene('flower');
  };

  const handleFlowerTransitionComplete = () => {
    setScene('songs');
  };

  const handleReplay = () => {
    setScene('letter');
  };

  const handleSaveConfig = async (newConfig: SiteConfig) => {
    setConfig(newConfig);
    saveConfigToStorage(newConfig);

    try {
      const result = await saveConfigToProject(newConfig);
      if (result.success) {
        setToastMessage('✓ บันทึกลงโค้ดโปรเจกต์ (defaultConfig.ts) เรียบร้อย! ผู้เข้าชมทุกคนจะเห็นข้อความนี้เป็นค่าเริ่มต้น 💌');
      } else {
        setToastMessage('✓ บันทึกในเบราว์เซอร์แล้ว! สามารถส่ง "ลิงก์ส่งต่อพร้อมข้อมูล" ให้คนพิเศษ หรือดาวน์โหลดไฟล์ไปอัปเดตบน Vercel ได้เลย 💌');
      }
    } catch {
      setToastMessage('✓ บันทึกการตั้งค่าเรียบร้อยแล้ว 💌');
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 6000);
  };

  const handleQuickCopyLink = async () => {
    const url = generateShareableUrl(config);
    const success = await copyToClipboard(url);
    if (success) {
      setToastMessage('✓ คัดลอกลิงก์สำหรับส่งต่อสำเร็จ! (เมื่อคนพิเศษเปิด จะไม่เห็นปุ่ม Customize หรือปุ่มคัดลอก) 💌');
    } else {
      setToastMessage('เปิดหน้าต่าง Customize เพื่อคัดลอกลิงก์');
      setIsSettingsOpen(true);
    }

    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  // Map user-selected fonts to CSS variables for instant global effect
  const fontStyle = {
    '--font-body': config.fontFamilyBody
      ? `'${config.fontFamilyBody}', 'Prompt', sans-serif`
      : `'Prompt', sans-serif`,
    '--font-handwriting': config.fontFamilyHandwriting
      ? `'${config.fontFamilyHandwriting}', 'Charm', cursive`
      : `'Charm', cursive`,
    '--font-display': config.fontFamilyDisplay
      ? `'${config.fontFamilyDisplay}', 'Prompt', serif`
      : `'Prompt', serif`,
    '--font-sans': config.fontFamilyBody
      ? `'${config.fontFamilyBody}', 'Prompt', sans-serif`
      : `'Prompt', sans-serif`,
  } as React.CSSProperties;

  return (
    <div
      style={fontStyle}
      className="min-h-screen w-full bg-[#F8F1E4] text-[#493F39] relative overflow-x-hidden selection:bg-[#F0B7C3]/30"
    >
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-60 max-w-md w-[92%] sm:w-auto px-4 py-3 rounded-2xl bg-[#70434B] text-[#FAF6ED] text-xs sm:text-sm font-sans-clean font-medium shadow-2xl flex items-center justify-between gap-3 border border-[#F0B7C3]/40 transition-all duration-300">
          <div className="flex items-center gap-2">
            <span className="text-[#F0B7C3]">💌</span>
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/70 hover:text-white text-xs px-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Dynamic Scene Rendering */}
      {scene === 'letter' && (
        <SceneLetter
          config={config}
          onOpen={handleOpenLetter}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onCopyLink={handleQuickCopyLink}
          isCreator={isCreator}
          onToggleCreator={handleToggleCreator}
        />
      )}

      {scene === 'flower' && (
        <SceneFlowerTransition
          config={config}
          onTransitionComplete={handleFlowerTransitionComplete}
        />
      )}

      {scene === 'songs' && (
        <SceneSongs
          config={config}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onReplay={handleReplay}
          onCopyLink={handleQuickCopyLink}
          isCreator={isCreator}
          onToggleCreator={handleToggleCreator}
        />
      )}

      {/* Personalization Modal */}
      <PersonalizationModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
        isCreator={isCreator}
        onToggleCreator={handleToggleCreator}
      />
    </div>
  );
}
