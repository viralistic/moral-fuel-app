import { StyleSheet, View } from 'react-native';

import { getDayViews, getSections, type DayView } from '@/content';
import { getJourneyPosition, isCompleted } from '@/features/progress/progress';
import { useAppState, useStrings } from '@/state/app-state';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { FadeIn } from '@/ui/motion';
import { ProgressBar } from '@/ui/progress-bar';
import { Screen } from '@/ui/screen';
import { AppText } from '@/ui/text';

import { DayRow } from './day-row';

export function JourneyScreen() {
  const strings = useStrings();
  const { state } = useAppState();
  const language = state.preferences.language;
  const days = getDayViews(language);
  const position = getJourneyPosition(days, state.progress);
  const progressLine = strings.today.progressLine(position.completedCount, position.availableCount);

  return (
    <Screen inTabs>
      <View style={styles.header}>
        <AppText variant="display">{strings.journey.title}</AppText>
        <AppText tone="muted">{strings.journey.subtitle}</AppText>
      </View>

      <View style={styles.progress}>
        <AppText variant="small">{progressLine}</AppText>
        <ProgressBar value={position.completedCount} max={position.availableCount} label={progressLine} />
        <AppText variant="caption" tone="muted">
          {strings.today.journeyLine(position.totalDays)}
        </AppText>
      </View>

      {getSections(language).map((section, index) => (
        <FadeIn key={section.id} delay={index * 60}>
          <View style={styles.section}>
            <ChapterHeader
              order={section.order}
              title={section.title}
              description={section.description}
              days={days.filter((day) => day.sectionId === section.id)}
            />
            {days
              .filter((day) => day.sectionId === section.id)
              .map((day) => (
                <DayRow key={day.day} day={day} recommended={day.day === position.current?.day} />
              ))}
          </View>
        </FadeIn>
      ))}
    </Screen>
  );
}

/** Each week is a chapter with its own number, description and progress. */
function ChapterHeader({ order, title, description, days }: { order: number; title: string; description: string; days: DayView[] }) {
  const strings = useStrings();
  const { state } = useAppState();
  const { colors } = useTheme();
  const done = days.filter((day) => isCompleted(state.progress, day.lessonId)).length;
  const progressLabel = strings.journey.chapterProgress(done, days.length);
  return (
    <View style={[styles.chapter, { backgroundColor: colors.surfaceMuted }]}>
      <View style={styles.chapterTop}>
        <AppText variant="display" style={styles.chapterNumber} accessible={false}>
          {order}
        </AppText>
        <View style={styles.chapterText}>
          <AppText variant="overline" tone="muted">
            {strings.journey.week(order)}
          </AppText>
          <AppText variant="title">{title}</AppText>
        </View>
      </View>
      <AppText variant="small" tone="muted">
        {description}
      </AppText>
      <ProgressBar value={done} max={days.length} label={progressLabel} />
      <AppText variant="caption" tone="muted">
        {progressLabel}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, paddingTop: spacing.sm },
  progress: { gap: spacing.xs },
  section: { gap: spacing.xxs },
  chapter: { gap: spacing.sm, borderRadius: radius.lg, padding: spacing.lg, marginTop: spacing.md, marginBottom: spacing.xs },
  chapterTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  chapterNumber: { fontSize: 44, lineHeight: 48 },
  chapterText: { flex: 1, gap: 2 },
});
