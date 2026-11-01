import { StyleSheet, View } from 'react-native';

import { LESSON_STEP_COUNT } from '@/features/progress/progress';
import { useStrings } from '@/state/app-state';
import { fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { AppText } from '@/ui/text';

/** Leer / Overdenk / Leef. The current step is bold and named, so colour is never the only cue. */
export function StepIndicator({ step }: { step: number }) {
  const strings = useStrings();
  const { colors } = useTheme();
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${strings.common.stepOf(step + 1, LESSON_STEP_COUNT)}: ${strings.lesson.steps[step]}`}
      accessibilityValue={{ min: 1, max: LESSON_STEP_COUNT, now: step + 1 }}
      style={styles.row}>
      {strings.lesson.steps.map((label, index) => {
        const reached = index <= step;
        return (
          <View key={label} style={styles.part}>
            <View style={[styles.bar, { backgroundColor: reached ? colors.primary : colors.border }]} />
            <AppText variant="caption" tone={index === step ? 'default' : 'muted'} style={index === step && styles.current}>
              {label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.xs },
  part: { flex: 1, gap: spacing.xxs },
  bar: { height: 5, borderRadius: radius.pill },
  current: { fontFamily: fonts.semibold },
});
