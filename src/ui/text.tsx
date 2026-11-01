import { Text, type TextProps } from 'react-native';

import { typography, type ColorTokens, type TextVariant } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

type Tone = 'default' | 'muted' | 'accent' | 'danger';

const toneColor: Record<Tone, keyof ColorTokens> = {
  default: 'text',
  muted: 'textMuted',
  accent: 'accentText',
  danger: 'danger',
};

/** Large display text may grow with the system font size, but not so far that one word fills a line. */
const scaleCap: Partial<Record<TextVariant, number>> = { display: 1.5, title: 1.6, heading: 1.8, scripture: 2 };

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: Tone;
}

export function AppText({ variant = 'body', tone = 'default', style, ...props }: AppTextProps) {
  const { colors } = useTheme();
  const isHeading = variant === 'display' || variant === 'title' || variant === 'heading';
  return (
    <Text
      accessibilityRole={isHeading ? 'header' : undefined}
      maxFontSizeMultiplier={scaleCap[variant]}
      style={[typography[variant], { color: colors[toneColor[tone]] }, style]}
      {...props}
    />
  );
}
