import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

/** `feature` marks the one card a screen is about, such as today's lesson. */
type Tone = 'surface' | 'muted' | 'feature' | 'outline';

export function Card({ tone = 'surface', children, style }: { tone?: Tone; children: ReactNode; style?: StyleProp<ViewStyle> }) {
  const { colors } = useTheme();
  const look = {
    surface: { backgroundColor: colors.surface, borderColor: colors.border },
    muted: { backgroundColor: colors.surfaceMuted, borderColor: colors.surfaceMuted },
    feature: { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
    outline: { backgroundColor: 'transparent', borderColor: colors.border },
  }[tone];
  return <View style={[styles.card, look, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.md, borderWidth: 1, padding: spacing.lg, gap: spacing.sm },
});
