import type { ImageSourcePropType } from 'react-native';

import type { LocalizedContent } from '@/models/content';

/**
 * The media library: brand photography supplied by the designer. Screens use these through this
 * module, never with a direct require, so alt text travels with every image. Black-and-white only;
 * see styling/STYLE_GUIDE.md for how photos are framed.
 */
export interface MediaItem {
  id: string;
  source: ImageSourcePropType;
  /** Describes the photo for screen readers. */
  alt: LocalizedContent<string>;
}

export const MEDIA = {
  handRingsSky: {
    id: 'handRingsSky',
    source: require('../../assets/images/media/hand-rings-sky.jpg'),
    alt: { nl: 'Zwart-witfoto van een man die zijn hand met ringen naar de camera uitstrekt, tegen een lichte lucht.' },
  },
  locsHandPortrait: {
    id: 'locsHandPortrait',
    source: require('../../assets/images/media/locs-hand-portrait.jpg'),
    alt: { nl: 'Zwart-witportret van een man met dreadlocks die een hand voor zijn mond houdt.' },
  },
} as const satisfies Record<string, MediaItem>;

export type MediaId = keyof typeof MEDIA;
