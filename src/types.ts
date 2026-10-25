export type Scene = 'letter' | 'flower' | 'songs';

export interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeUrl: string; // Full URL or 11-char video ID
  youtubeId: string;  // Extracted 11-char ID
  note?: string;
  duration?: string;
}

export interface SiteConfig {
  // Scene A: The Letter
  recipientName: string;
  senderName: string;
  envelopeTitle: string;
  envelopeSubtitle: string;
  envelopeOpenButtonText: string;
  letterPreviewLine: string;
  letterStampText: string;
  letterSignoffText: string;

  // Scene B: Flower Transition
  flowerTitle: string;
  flowerSubtitle: string;
  flowerSkipText: string;

  // Scene C: Songs Page
  journalTagText: string;
  songsKickerText: string;
  songsTitle: string;
  songsSubtitle: string;
  cassetteDeckBrandText: string;
  cassetteSideText: string;
  cassetteMixtapeLabel: string;
  cassetteForSomeoneText: string;
  cassettePlayingText: string;
  cassetteReadyText: string;
  cassettePauseText?: string;

  // Tracklist
  tracklistTitle: string;
  tracklistSubtitle: string;
  playlist: Song[];

  // Special Letter Card
  specialLetterTag: string;
  specialLetterTitle: string;
  specialMessage: string;
  specialLetterSignoff: string;

  // Memory Photo Card (Bottom)
  memoryCardTitle: string;
  memoryCardQuote: string;
  memoryCardPhotoUrl: string;

  // Footer
  footerTitle: string;
  footerSubtitle: string;

  // Typography / Font Selection
  fontPreset?: string;
  fontFamilyBody?: string;
  fontFamilyHandwriting?: string;
  fontFamilyDisplay?: string;
}

export type PlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error';
