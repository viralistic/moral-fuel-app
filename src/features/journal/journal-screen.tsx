import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { formatDay, formatTime } from '@/i18n/format';
import { useAppState, useStrings } from '@/state/app-state';
import { useJournal } from '@/state/journal';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { confirm } from '@/ui/confirm';
import { Icon } from '@/ui/icon';
import { Screen } from '@/ui/screen';
import { SearchField } from '@/ui/search-field';
import { AppText } from '@/ui/text';

import { buildJournalExport } from './export';
import { groupByDay, searchEntries, type JournalEntry } from './journal';
import { lessonRef } from './lesson-ref';
import { shareText } from './share';

export function JournalScreen() {
  const strings = useStrings();
  const router = useRouter();
  const { state } = useAppState();
  const journal = useJournal();
  const { colors } = useTheme();
  const language = state.preferences.language;
  const [query, setQuery] = useState('');
  const [exportFailed, setExportFailed] = useState(false);
  const results = searchEntries(journal.entries, query, (id) => lessonRef(id, language)?.title);

  const openEntry = (id: string) => router.push({ pathname: '/journal/[id]', params: { id } });

  const exportJournal = async () => {
    const ok = await confirm({
      title: strings.journal.exportConfirmTitle,
      message: strings.journal.exportConfirmBody,
      confirmLabel: strings.journal.exportConfirm,
      cancelLabel: strings.common.cancel,
    });
    if (!ok) return;
    const heading = (entry: JournalEntry) => {
      const lesson = lessonRef(entry.lessonId, language);
      const date = formatDay(entry.createdAt, language);
      return lesson ? `${date} · ${strings.journal.fromLesson(lesson.day, lesson.title)}` : date;
    };
    try {
      setExportFailed(false);
      await shareText(strings.journal.exportHeader, buildJournalExport(journal.entries, strings.journal.exportHeader, heading));
    } catch {
      setExportFailed(true);
    }
  };

  const startOver = async () => {
    const ok = await confirm({
      title: strings.journal.startOverConfirmTitle,
      message: strings.journal.startOverConfirmBody,
      confirmLabel: strings.journal.startOver,
      cancelLabel: strings.common.cancel,
      destructive: true,
    });
    if (ok) await journal.actions.startOver();
  };

  return (
    <Screen inTabs>
      <View style={styles.header}>
        <AppText variant="display">{strings.journal.title}</AppText>
        <View style={styles.note}>
          <Icon name="lock" size={14} color={colors.textMuted} />
          <AppText variant="small" tone="muted" style={styles.flex}>
            {journal.persists ? strings.journal.subtitle : strings.journal.subtitleWeb}
          </AppText>
        </View>
      </View>

      {journal.status === 'loading' ? (
        <View style={styles.center} accessibilityLiveRegion="polite">
          <ActivityIndicator color={colors.primary} />
          <AppText tone="muted">{strings.journal.loading}</AppText>
        </View>
      ) : journal.status === 'unreadable' ? (
        <Card tone="outline">
          <AppText variant="heading">{strings.journal.unreadableTitle}</AppText>
          <AppText tone="muted">{strings.journal.unreadableBody}</AppText>
          <Button label={strings.journal.startOver} variant="danger" onPress={startOver} />
        </Card>
      ) : (
        <>
          <Button
            label={strings.journal.newEntry}
            icon="pencil"
            iconPosition="start"
            onPress={() => openEntry('new')}
          />

          {journal.saveFailed ? (
            <AppText variant="small" tone="danger" accessibilityLiveRegion="polite">
              {strings.journal.saveFailed}
            </AppText>
          ) : null}

          {journal.entries.length === 0 ? (
            <View style={[styles.empty, { borderColor: colors.border }]}>
              <Icon name="journal" size={28} color={colors.textMuted} />
              <AppText variant="heading">{strings.journal.emptyTitle}</AppText>
              <AppText tone="muted" style={styles.centerText}>
                {strings.journal.emptyBody}
              </AppText>
            </View>
          ) : (
            <>
              <SearchField
                value={query}
                onChangeText={setQuery}
                placeholder={strings.journal.search}
                clearLabel={strings.journal.clearSearch}
              />
              <AppText variant="caption" tone="muted" accessibilityLiveRegion="polite">
                {results.length === 0 ? strings.journal.noResults(query.trim()) : strings.journal.count(results.length)}
              </AppText>
              {groupByDay(results).map((group) => (
                <View key={group.day} style={styles.group}>
                  <AppText variant="overline" tone="accent">
                    {formatDay(group.entries[0].createdAt, language)}
                  </AppText>
                  {group.entries.map((entry) => (
                    <EntryRow key={entry.id} entry={entry} onPress={() => openEntry(entry.id)} />
                  ))}
                </View>
              ))}
              <View style={[styles.export, { borderTopColor: colors.border }]}>
                <Button label={strings.journal.export} variant="secondary" icon="share" iconPosition="start" onPress={exportJournal} />
                <AppText variant="caption" tone="muted">
                  {strings.journal.exportHint}
                </AppText>
                {exportFailed ? (
                  <AppText variant="small" tone="danger">
                    {strings.journal.exportFailed}
                  </AppText>
                ) : null}
              </View>
            </>
          )}
        </>
      )}
    </Screen>
  );
}

function EntryRow({ entry, onPress }: { entry: JournalEntry; onPress: () => void }) {
  const strings = useStrings();
  const { state } = useAppState();
  const { colors } = useTheme();
  const language = state.preferences.language;
  const lesson = lessonRef(entry.lessonId, language);
  const tag = lesson ? strings.journal.fromLesson(lesson.day, lesson.title) : undefined;
  const time = formatTime(entry.createdAt, language);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[tag, time, entry.body.slice(0, 120)].filter(Boolean).join(', ')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.entry,
        { backgroundColor: colors.surface, borderColor: colors.border },
        pressed && { backgroundColor: colors.surfaceMuted },
      ]}>
      <View style={styles.entryHead}>
        <AppText variant="caption" tone={tag ? 'accent' : 'muted'} style={styles.flex} numberOfLines={1}>
          {tag ?? time}
        </AppText>
        {tag ? (
          <AppText variant="caption" tone="muted">
            {time}
          </AppText>
        ) : null}
      </View>
      <AppText numberOfLines={3}>{entry.body}</AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: { gap: spacing.xs, paddingTop: spacing.sm },
  note: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  flex: { flex: 1 },
  center: { alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.xl },
  centerText: { textAlign: 'center' },
  empty: { alignItems: 'center', gap: spacing.sm, padding: spacing.xl, borderWidth: 1, borderStyle: 'dashed', borderRadius: radius.lg },
  group: { gap: spacing.sm },
  entry: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  entryHead: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center' },
  export: { gap: spacing.xs, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.lg },
});
