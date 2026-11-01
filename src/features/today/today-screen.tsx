import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { getDayViews, getLesson, getLessonText, getSections, topicLabel, type DayView } from '@/content';
import { useOpenLesson } from '@/features/lesson/use-open-lesson';
import { daysForInterest, getJourneyPosition } from '@/features/progress/progress';
import { useAppState, useStrings } from '@/state/app-state';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Icon, type IconName } from '@/ui/icon';
import { FadeIn } from '@/ui/motion';
import { ProgressBar } from '@/ui/progress-bar';
import { Screen } from '@/ui/screen';
import { AppText } from '@/ui/text';
import { Wordmark } from '@/ui/wordmark';

import { greetingFor } from './greeting';
import { LessonHero } from './lesson-hero';

export function TodayScreen() {
  const strings = useStrings();
  const router = useRouter();
  const { state, storageProblem } = useAppState();
  const { colors } = useTheme();
  const { language, interest, dailyMinutes } = state.preferences;
  const days = getDayViews(language);
  const position = getJourneyPosition(days, state.progress);
  const shownDay = position.current ?? position.nextPlanned;
  const section = getSections(language).find((s) => s.id === shownDay?.sectionId);
  const lesson = position.current?.lessonId ? getLesson(position.current.lessonId) : undefined;
  const [learn, , live] = lesson ? getLessonText(lesson, language).steps : [];
  const suggestions = daysForInterest(days, interest).filter((d) => d.day !== position.current?.day).slice(0, 3);
  const progressLine = strings.today.progressLine(position.completedCount, position.availableCount);

  return (
    <Screen inTabs>
      <View style={styles.header}>
        <View style={styles.brand}>
          <Wordmark />
        </View>
        <AppText variant="display">{greetingFor(new Date().getHours(), strings)}</AppText>
        {shownDay && section ? (
          <AppText tone="muted">{strings.today.dayLine(shownDay.day, position.totalDays, section.title)}</AppText>
        ) : null}
      </View>

      {storageProblem ? (
        <Card tone="outline">
          <AppText variant="small" tone="danger">
            {strings.today.storageProblem}
          </AppText>
        </Card>
      ) : null}

      <FadeIn>
        {position.current ? (
          <LessonHero day={position.current} progress={position.currentProgress} dailyMinutes={dailyMinutes} />
        ) : (
          <Card tone="muted">
            <Icon name="leaf" size={24} color={colors.primary} />
            <AppText variant="title">{strings.today.allDoneTitle}</AppText>
            {position.nextPlanned ? (
              <AppText tone="muted">{strings.today.allDoneBody(position.nextPlanned.day)}</AppText>
            ) : null}
            <Button label={strings.today.allDoneCta} variant="secondary" onPress={() => router.navigate('/journey')} />
          </Card>
        )}
      </FadeIn>

      {learn?.kind === 'learn' ? (
        <FadeIn delay={80}>
          <View style={styles.quoteBlock}>
            <AppText variant="overline" tone="accent">
              {strings.today.thought}
            </AppText>
            <View style={[styles.quote, { borderLeftColor: colors.accent }]}>
              <AppText variant="quote">{learn.bigIdea}</AppText>
            </View>
          </View>
        </FadeIn>
      ) : null}

      {live?.kind === 'live' ? (
        <FadeIn delay={140}>
          <View style={[styles.action, { borderColor: colors.border }]}>
            <View style={[styles.actionIcon, { backgroundColor: colors.accentSoft }]}>
              <Icon name="walk" size={20} color={colors.primary} />
            </View>
            <View style={styles.actionText}>
              <AppText variant="overline" tone="muted">
                {strings.today.action}
              </AppText>
              <AppText variant="bodyStrong">{live.action.title}</AppText>
              <AppText variant="small" tone="muted">
                {live.action.description}
              </AppText>
              <AppText variant="caption" tone="muted" style={styles.italic}>
                {strings.today.actionNote}
              </AppText>
            </View>
          </View>
        </FadeIn>
      ) : null}

      <View style={styles.block}>
        <AppText variant="overline" tone="muted">
          {strings.today.progress}
        </AppText>
        <AppText variant="heading">{progressLine}</AppText>
        <ProgressBar value={position.completedCount} max={position.availableCount} label={progressLine} />
        <AppText variant="caption" tone="muted">
          {strings.today.journeyLine(position.totalDays)}
        </AppText>
      </View>

      {interest && suggestions.length > 0 ? (
        <View style={styles.block}>
          <AppText variant="overline" tone="muted">
            {strings.today.interest(topicLabel(interest, language))}
          </AppText>
          {suggestions.map((day) => (
            <Suggestion key={day.day} day={day} />
          ))}
        </View>
      ) : null}

      <View style={styles.links}>
        <EntryLink icon="journey" title={strings.today.journey} hint={strings.today.journeyHint} onPress={() => router.navigate('/journey')} />
        <EntryLink icon="explore" title={strings.today.explore} hint={strings.today.exploreHint} onPress={() => router.navigate('/explore')} />
      </View>

      <View style={styles.beta}>
        <Icon name="info" size={14} color={colors.textMuted} />
        <AppText variant="caption" tone="muted" style={styles.betaText}>
          {strings.common.beta}
        </AppText>
      </View>
    </Screen>
  );
}

function Suggestion({ day }: { day: DayView }) {
  const strings = useStrings();
  const { colors } = useTheme();
  const openLesson = useOpenLesson();
  const content = (
    <>
      <View style={styles.suggestionText}>
        <AppText variant="caption" tone="muted">
          {strings.common.day(day.day)}
        </AppText>
        <AppText variant="bodyStrong" tone={day.available ? 'default' : 'muted'}>
          {day.title}
        </AppText>
      </View>
      {day.available ? (
        <Icon name="chevronRight" size={16} color={colors.textMuted} />
      ) : (
        <Badge label={strings.common.comingSoon} tone="soon" icon="clock" />
      )}
    </>
  );
  if (!day.available || !day.lessonId) {
    return (
      <View
        style={[styles.suggestion, { borderColor: colors.border }]}
        accessible
        accessibilityLabel={`${strings.common.day(day.day)}: ${day.title}. ${strings.common.comingSoon}.`}>
        {content}
      </View>
    );
  }
  const lessonId = day.lessonId;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${strings.common.day(day.day)}: ${day.title}`}
      onPress={() => openLesson(lessonId)}
      style={({ pressed }) => [styles.suggestion, { borderColor: colors.border }, pressed && { backgroundColor: colors.surfaceMuted }]}>
      {content}
    </Pressable>
  );
}

function EntryLink({ icon, title, hint, onPress }: { icon: IconName; title: string; hint: string; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${hint}`}
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { backgroundColor: colors.surfaceMuted },
      ]}>
      <Icon name={icon} size={22} color={colors.primary} />
      <AppText variant="bodyStrong">{title}</AppText>
      <AppText variant="caption" tone="muted">
        {hint}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, paddingTop: spacing.sm },
  brand: { paddingBottom: spacing.md },
  quoteBlock: { gap: spacing.sm, paddingVertical: spacing.xs },
  quote: { borderLeftWidth: 2, paddingLeft: spacing.md },
  action: { flexDirection: 'row', gap: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: spacing.lg },
  actionIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  actionText: { flex: 1, gap: spacing.xxs },
  italic: { fontStyle: 'italic' },
  block: { gap: spacing.sm },
  suggestion: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 56,
  },
  suggestionText: { flex: 1, gap: 2 },
  links: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  link: {
    flexGrow: 1,
    flexBasis: 150,
    gap: spacing.xxs,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radius.lg,
    padding: spacing.md,
    minHeight: 96,
  },
  beta: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start', paddingTop: spacing.sm },
  betaText: { flex: 1 },
});
