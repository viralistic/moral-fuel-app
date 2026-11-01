import { StyleSheet, View } from 'react-native';

import { useStrings } from '@/state/app-state';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Icon } from '@/ui/icon';
import { AppText } from '@/ui/text';
import { Wordmark } from '@/ui/wordmark';

import { StepFrame } from './step-frame';

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const strings = useStrings();
  const { colors } = useTheme();
  const { welcome } = strings.onboarding;

  return (
    <StepFrame step={0} onBack={() => {}} ctaLabel={welcome.cta} onCta={onNext}>
      <View style={styles.hero}>
        <Wordmark width={176} />
        <AppText variant="overline" tone="muted">
          {strings.brand.promise}
        </AppText>
        <AppText variant="display">{welcome.title}</AppText>
        <AppText variant="small" tone="muted">
          {welcome.body}
        </AppText>
      </View>

      <View style={styles.points}>
        {welcome.points.map((point, index) => (
          <View
            key={point.title}
            style={[styles.point, { backgroundColor: colors.surface, borderColor: colors.border }]}
            accessible
            accessibilityLabel={`${point.title}. ${point.body}`}>
            <View style={[styles.pointIndex, { backgroundColor: colors.surfaceMuted }]}>
              <AppText variant="heading" tone="accent">
                {index + 1}
              </AppText>
            </View>
            <View style={styles.pointText}>
              <AppText variant="heading">{point.title}</AppText>
              <AppText variant="small" tone="muted">
                {point.body}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.note}>
        <Icon name="lock" size={18} color={colors.textMuted} />
        <AppText variant="small" tone="muted" style={styles.noteText}>
          {welcome.note}
        </AppText>
      </View>
    </StepFrame>
  );
}

const styles = StyleSheet.create({
  hero: { gap: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.xs },
  points: { gap: spacing.sm },
  point: { flexDirection: 'row', gap: spacing.md, alignItems: 'center', borderWidth: 1, borderRadius: radius.md, padding: spacing.md },
  pointIndex: { width: 44, height: 44, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  pointText: { flex: 1, gap: 2 },
  note: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  noteText: { flex: 1 },
});
