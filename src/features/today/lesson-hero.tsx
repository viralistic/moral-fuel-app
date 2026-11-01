import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import type { DayView } from '@/content';
import { useOpenLesson } from '@/features/lesson/use-open-lesson';
import { LESSON_STEP_COUNT } from '@/features/progress/progress';
import type { LessonProgress } from '@/models/user';
import { useStrings } from '@/state/app-state';
import { spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { ProgressBar } from '@/ui/progress-bar';
import { AppText } from '@/ui/text';

interface Props {
  day: DayView;
  progress: LessonProgress | null;
  dailyMinutes: number | null;
}

/** The lesson to start or resume today. */
export function LessonHero({ day, progress, dailyMinutes }: Props) {
  const strings = useStrings();
  const openLesson = useOpenLesson();
  const router = useRouter();
  const { colors } = useTheme();
  const resuming = progress?.status === 'in-progress';
  const step = (progress?.stepIndex ?? 0) + 1;
  const showPace = !!dailyMinutes && !!day.readingMinutes && dailyMinutes < day.readingMinutes;

  return (
    <Card tone="feature" style={styles.card}>
      <AppText variant="overline" tone="muted">
        {resuming ? strings.today.resumeLesson : strings.today.newLesson}
      </AppText>
      <AppText variant="title">
        {day.title}
      </AppText>
      <AppText tone="muted">{day.summary}</AppText>
      <AppText variant="caption" tone="muted">
        {[day.passage, day.readingMinutes ? strings.common.minutes(day.readingMinutes) : null].filter(Boolean).join(' · ')}
      </AppText>
      {resuming ? (
        <View style={styles.progress}>
          <ProgressBar
            value={step - 1}
            max={LESSON_STEP_COUNT}
            label={strings.common.stepOf(step, LESSON_STEP_COUNT)}
          />
        </View>
      ) : null}
      <View style={styles.cta}>
        <Button
          variant="primary"
          label={resuming ? strings.today.resume(step) : strings.today.start}
          icon="chevronRight"
          onPress={() => day.lessonId && openLesson(day.lessonId)}
        />
      </View>
      {day.lessonId ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${strings.bible.read}: ${day.passage}`}
          onPress={() => router.push({ pathname: '/bible/[lessonId]', params: { lessonId: day.lessonId! } })}
          hitSlop={8}
          style={({ pressed }) => [styles.read, pressed && styles.pressed]}>
          <Icon name="book" size={18} color={colors.accent} />
          <AppText variant="bodyStrong">
            {strings.bible.read}
          </AppText>
        </Pressable>
      ) : null}
      {showPace ? (
        <AppText variant="caption" tone="muted">
          {strings.today.pace(day.readingMinutes!, dailyMinutes!)}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { padding: spacing.lg, gap: spacing.sm },
  progress: { paddingTop: spacing.xs },
  cta: { paddingTop: spacing.sm },
  read: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, minHeight: 44 },
  pressed: { opacity: 0.7 },
});
