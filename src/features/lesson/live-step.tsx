import { StyleSheet, View } from 'react-native';

import type { LiveStep as LiveContent } from '@/models/content';
import { useStrings } from '@/state/app-state';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { AppText } from '@/ui/text';

/** One small action. The prayer is offered, never required. */
export function LiveStep({ step }: { step: LiveContent }) {
  const strings = useStrings();
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      <Card tone="feature">
        <View style={styles.title}>
          <Icon name="walk" size={20} color={colors.accent} />
          <AppText variant="overline" tone="muted">
            {strings.lesson.actionTitle}
          </AppText>
        </View>
        <AppText variant="title">
          {step.action.title}
        </AppText>
        <AppText tone="muted">{step.action.description}</AppText>
      </Card>

      {step.prayer ? (
        <View style={styles.block}>
          <AppText variant="heading">{strings.lesson.prayer}</AppText>
          <AppText variant="small" tone="muted">
            {strings.lesson.prayerNote}
          </AppText>
          <AppText variant="quote">{step.prayer}</AppText>
        </View>
      ) : null}

      <AppText variant="small" tone="muted">
        {strings.lesson.finishNote}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.lg },
  title: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  block: { gap: spacing.sm },
});
