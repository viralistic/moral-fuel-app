import { StyleSheet, View } from 'react-native';

import { radius } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

/** An outlined pill with a white fill inset, the same shape as the loader's bar. */
export function ProgressBar({ value, max, label }: { value: number; max: number; label: string }) {
  const { colors } = useTheme();
  const ratio = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: value }}
      style={[styles.track, { borderColor: colors.borderStrong }]}>
      <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: colors.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: { height: 10, borderRadius: radius.pill, borderWidth: 1, padding: 2, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: radius.pill },
});
