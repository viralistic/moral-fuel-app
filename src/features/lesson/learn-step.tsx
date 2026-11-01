import { StyleSheet, View } from 'react-native';

import { formatReference } from '@/content';
import { BiblePassageAccordion } from '@/features/bible/passage-accordion';
import type { BibleReference, LanguageCode, LearnStep as LearnContent } from '@/models/content';
import { useStrings } from '@/state/app-state';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { AppText } from '@/ui/text';

interface LearnStepProps {
  title: string;
  passage: BibleReference;
  related: BibleReference[];
  step: LearnContent;
  language: LanguageCode;
}

/** Text, explanation and application stay visibly apart: summary card, plain explanation, example card. */
export function LearnStep({ title, passage, related, step, language }: LearnStepProps) {
  const strings = useStrings();
  const { colors } = useTheme();
  return (
    <View style={styles.stack}>
      <AppText variant="display">{title}</AppText>
      <BiblePassageAccordion reference={passage} />

      <View style={styles.idea}>
        <View style={[styles.rule, { backgroundColor: colors.accent }]} />
        <View style={styles.ideaText}>
          <AppText variant="overline" tone="accent">
            {strings.lesson.bigIdea}
          </AppText>
          <AppText variant="quote">{step.bigIdea}</AppText>
        </View>
      </View>

      <Card tone="muted">
        <AppText variant="heading">{strings.lesson.text}</AppText>
        <AppText variant="caption" tone="muted">
          {strings.lesson.textNote}
        </AppText>
        <AppText>{step.passageSummary}</AppText>
      </Card>

      <View style={styles.section}>
        <AppText variant="overline" tone="muted">
          {strings.lesson.context}
        </AppText>
        <AppText variant="small" tone="muted">
          {step.context}
        </AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="heading">{strings.lesson.explanation}</AppText>
        <AppText variant="caption" tone="muted">
          {strings.lesson.explanationNote}
        </AppText>
        {step.explanation.map((paragraph) => (
          <AppText key={paragraph}>{paragraph}</AppText>
        ))}
      </View>

      <Card tone="outline">
        <View style={styles.iconTitle}>
          <Icon name="lightbulb" size={20} color={colors.accentText} />
          <AppText variant="heading">{strings.lesson.example}</AppText>
        </View>
        <AppText>{step.example}</AppText>
      </Card>

      {related.length > 0 ? (
        <View style={styles.section}>
          <AppText variant="overline" tone="muted">
            {strings.lesson.related}
          </AppText>
          {related.map((ref) => (
            <BiblePassageAccordion key={formatReference(ref, language)} reference={ref} />
          ))}
        </View>
      ) : null}

      {step.traditionNote ? (
        <View style={[styles.note, { borderTopColor: colors.border }]}>
          <AppText variant="overline" tone="muted">
            {strings.lesson.tradition}
          </AppText>
          <AppText variant="small" tone="muted">
            {step.traditionNote}
          </AppText>
        </View>
      ) : null}

      {step.careNote ? (
        <View
          accessible
          accessibilityLabel={`${strings.lesson.care}. ${step.careNote}`}
          style={[styles.care, { backgroundColor: colors.surfaceMuted }]}>
          <View style={styles.iconTitle}>
            <Icon name="heart" size={18} color={colors.primary} />
            <AppText variant="bodyStrong">{strings.lesson.care}</AppText>
          </View>
          <AppText variant="small">{step.careNote}</AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stack: { gap: spacing.lg },
  idea: { flexDirection: 'row', gap: spacing.md },
  rule: { width: 3, borderRadius: radius.pill },
  ideaText: { flex: 1, gap: spacing.xs },
  section: { gap: spacing.sm },
  iconTitle: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  note: { gap: spacing.xxs, paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth },
  care: { gap: spacing.xs, padding: spacing.md, borderRadius: radius.md },
});
