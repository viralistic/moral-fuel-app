import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { topicLabel, type DayView } from '@/content';
import { useOpenLesson } from '@/features/lesson/use-open-lesson';
import { dayStatus, type DayStatus } from '@/features/progress/progress';
import { useAppState, useStrings } from '@/state/app-state';
import { fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Badge } from '@/ui/badge';
import { Icon } from '@/ui/icon';
import { AppText } from '@/ui/text';

/**
 * One journey day, shared by Journey and Explore. Written lessons open; planned days never do,
 * they can only reveal their learning objective.
 */
export function DayRow({ day, showTopics, recommended }: { day: DayView; showTopics?: boolean; recommended?: boolean }) {
  const strings = useStrings();
  const { state } = useAppState();
  const { colors } = useTheme();
  const openLesson = useOpenLesson();
  const [objectiveOpen, setObjectiveOpen] = useState(false);
  const status = dayStatus(day, state.progress);
  const step = (state.progress[day.lessonId ?? '']?.stepIndex ?? 0) + 1;
  const badge = useBadge(status, step);
  const planned = status === 'coming-soon';
  const meta = [day.passage, day.readingMinutes ? strings.common.minutes(day.readingMinutes) : null]
    .filter(Boolean)
    .join(' · ');

  const body = (
    <>
      <View
        style={[
          styles.marker,
          status === 'completed'
            ? { backgroundColor: colors.primary, borderColor: colors.primary }
            : { borderColor: planned ? colors.border : colors.primary },
        ]}>
        {status === 'completed' ? (
          <Icon name="check" size={16} color={colors.onPrimary} />
        ) : (
          <AppText variant="small" tone={planned ? 'muted' : 'default'} style={styles.markerText}>
            {day.day}
          </AppText>
        )}
      </View>
      <View style={styles.text}>
        <AppText variant="heading" tone={planned ? 'muted' : 'default'} style={styles.title} accessibilityRole="text">
          {day.title}
        </AppText>
        <AppText variant="small" tone="muted">
          {day.summary}
        </AppText>
        {meta ? (
          <AppText variant="caption" tone="muted">
            {meta}
          </AppText>
        ) : null}
        {showTopics ? (
          <AppText variant="caption" tone="muted">
            {day.topics.map((t) => topicLabel(t, state.preferences.language)).join(' · ')}
          </AppText>
        ) : null}
        <View style={styles.badges}>
          {recommended ? <Badge label={strings.journey.recommended} tone="active" icon="chevronRight" /> : null}
          <Badge {...badge} />
        </View>
      </View>
      {planned ? null : <Icon name="chevronRight" size={16} color={colors.textMuted} />}
    </>
  );

  const label = `${strings.common.day(day.day)}: ${day.title}. ${recommended ? `${strings.journey.recommended}. ` : ''}${badge.label}.`;

  if (!planned && day.lessonId) {
    const lessonId = day.lessonId;
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => openLesson(lessonId)}
        style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.surfaceMuted }]}>
        {body}
      </Pressable>
    );
  }

  return (
    <View style={styles.planned}>
      <View style={styles.row} accessible accessibilityLabel={label}>
        {body}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${objectiveOpen ? strings.journey.hideObjective : strings.journey.showObjective}: ${day.title}`}
        accessibilityState={{ expanded: objectiveOpen }}
        onPress={() => setObjectiveOpen((open) => !open)}
        hitSlop={8}
        style={styles.objectiveToggle}>
        <AppText variant="caption" tone="accent" style={styles.toggleText}>
          {objectiveOpen ? strings.journey.hideObjective : strings.journey.showObjective}
        </AppText>
      </Pressable>
      {objectiveOpen ? (
        <View style={[styles.objective, { borderLeftColor: colors.accent }]}>
          <AppText variant="overline" tone="muted">
            {strings.journey.objective}
          </AppText>
          <AppText variant="small">{day.objective}</AppText>
        </View>
      ) : null}
    </View>
  );
}

function useBadge(status: DayStatus, step: number) {
  const strings = useStrings();
  switch (status) {
    case 'completed':
      return { label: strings.common.completed, tone: 'done', icon: 'check' } as const;
    case 'in-progress':
      return { label: strings.common.inProgress(step), tone: 'neutral' } as const;
    case 'available':
      return { label: strings.common.available, tone: 'neutral' } as const;
    case 'coming-soon':
      return { label: strings.common.comingSoon, tone: 'soon', icon: 'clock' } as const;
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
  },
  planned: { paddingBottom: spacing.xs },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  markerText: { fontFamily: fonts.semibold },
  text: { flex: 1, gap: spacing.xxs },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  title: { fontSize: 19, lineHeight: 25 },
  objectiveToggle: { marginLeft: 36 + spacing.md + spacing.xs, minHeight: 32, justifyContent: 'center', alignSelf: 'flex-start' },
  toggleText: { fontFamily: fonts.medium },
  objective: {
    marginLeft: 36 + spacing.md + spacing.xs,
    borderLeftWidth: 2,
    paddingLeft: spacing.sm,
    gap: spacing.xxs,
    marginTop: spacing.xxs,
  },
});
