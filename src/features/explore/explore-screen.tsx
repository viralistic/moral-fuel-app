import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { getDayViews, topicLabel } from '@/content';
import { DayRow } from '@/features/journey/day-row';
import type { TopicId } from '@/models/content';
import { useAppState, useStrings } from '@/state/app-state';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Button } from '@/ui/button';
import { Chip } from '@/ui/choice';
import { Icon } from '@/ui/icon';
import { Screen } from '@/ui/screen';
import { SearchField } from '@/ui/search-field';
import { AppText } from '@/ui/text';

import { journeyTopics, searchDays } from './search';

export function ExploreScreen() {
  const strings = useStrings();
  const { state } = useAppState();
  const { colors } = useTheme();
  const language = state.preferences.language;
  const days = getDayViews(language);
  const [query, setQuery] = useState('');
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const results = searchDays(days, { query, topic, onlyAvailable, language });
  const filtered = query.trim().length > 0 || topic !== null || onlyAvailable;

  const reset = () => {
    setQuery('');
    setTopic(null);
    setOnlyAvailable(false);
  };

  return (
    <Screen inTabs>
      <View style={styles.header}>
        <AppText variant="display">{strings.explore.title}</AppText>
        <AppText tone="muted">{strings.explore.subtitle}</AppText>
      </View>

      <SearchField
        value={query}
        onChangeText={setQuery}
        placeholder={strings.explore.search}
        clearLabel={strings.explore.clearSearch}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
        <Chip label={strings.explore.onlyAvailable} selected={onlyAvailable} onPress={() => setOnlyAvailable((v) => !v)} />
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Chip label={strings.explore.allTopics} selected={topic === null} onPress={() => setTopic(null)} />
        {journeyTopics(days).map((t) => (
          <Chip key={t} label={topicLabel(t, language)} selected={topic === t} onPress={() => setTopic(topic === t ? null : t)} />
        ))}
      </ScrollView>

      <AppText variant="caption" tone="muted" accessibilityLiveRegion="polite">
        {strings.explore.results(results.length)}
      </AppText>

      {results.length === 0 ? (
        <View style={[styles.empty, { borderColor: colors.border }]}>
          <Icon name="search" size={28} color={colors.textMuted} />
          <AppText variant="heading">{strings.explore.emptyTitle}</AppText>
          <AppText tone="muted" style={styles.center}>
            {query.trim() ? strings.explore.emptyQuery(query.trim()) : strings.explore.emptyFilter}
          </AppText>
          {filtered ? <Button label={strings.explore.reset} variant="secondary" onPress={reset} /> : null}
        </View>
      ) : (
        <View>
          {results.map((day) => (
            <DayRow key={day.day} day={day} showTopics />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, paddingTop: spacing.sm },
  chips: { gap: spacing.xs, alignItems: 'center', paddingRight: spacing.lg },
  divider: { width: 1, height: 24, marginHorizontal: spacing.xxs },
  empty: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
  },
  center: { textAlign: 'center' },
});
