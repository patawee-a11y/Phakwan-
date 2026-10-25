import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { defineConfig, Plugin } from 'vite';

function saveConfigPlugin(): Plugin {
  return {
    name: 'save-config-api',
    configureServer(server) {
      server.middlewares.use('/api/save-default-config', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const config = JSON.parse(body);
              const targetPath = path.resolve(process.cwd(), 'src/data/defaultConfig.ts');

              // Format clean TypeScript code
              const jsonStr = JSON.stringify(config, null, 2);
              const content = `import { SiteConfig } from '../types';
import { extractYouTubeId } from '../utils/youtube';

export const DEFAULT_CONFIG: SiteConfig = ${jsonStr};

const STORAGE_KEY = 'romantic_letter_app_config_v2';

export function loadSavedConfig(): SiteConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  try {
    const rawPath = window.location.pathname.replace(/^\\/+|\\/+$/g, '').toLowerCase();
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
    
    if (config.recipientName) {
      url.searchParams.set('to', config.recipientName.trim());
    }

    const json = JSON.stringify(config);
    const encoded = btoa(encodeURIComponent(json));
    url.hash = \`conf=\${encoded}\`;

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
          id: p.id || \`custom-\${idx}\`,
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
`;
              fs.writeFileSync(targetPath, content, 'utf-8');

              // Run background repackaging of zip
              exec('python3 scripts/update_zip.py', (zipErr) => {
                if (zipErr) console.warn('Could not auto-update zip:', zipErr);
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, message: 'บันทึกการตั้งค่าลง src/data/defaultConfig.ts และอัปเดตไฟล์ ZIP เรียบร้อยแล้ว' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: err?.message || String(err) }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), saveConfigPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname || '.', '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

