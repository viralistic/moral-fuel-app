import { openBrowserAsync } from 'expo-web-browser';
import { StyleSheet, Text, View } from 'react-native';

import { BGT } from '@/content/bible';
import type { BiblePassage, BibleTextBlock } from '@/models/bible';
import { useStrings } from '@/state/app-state';
import { fonts, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Button } from '@/ui/button';
import { AppText } from '@/ui/text';

/** Poetry lines follow each other closely; everything else gets paragraph spacing. */
function spaceBefore(block: BibleTextBlock, previous: BibleTextBlock | undefined) {
  if (!previous) return 0;
  if (block.kind === 'paragraph' && block.style === 'poetry' && previous.kind === 'paragraph' && previous.style === 'poetry') {
    return 0;
  }
  return block.kind === 'break' ? 0 : spacing.md;
}

/** The passage as the source prints it: headings, paragraphs and poetry lines with verse markers, then the source. */
export function PassageText({ passage }: { passage: BiblePassage }) {
  const strings = useStrings();
  const { colors } = useTheme();

  if (passage.blocks.length === 0) {
    return (
      <View style={styles.missing}>
        <AppText tone="muted">{strings.bible.missing}</AppText>
        <Button
          variant="secondary"
          label={strings.bible.openSource}
          icon="chevronRight"
          onPress={() => openBrowserAsync(passage.sourceUrl)}
        />
      </View>
    );
  }

  return (
    <View>
      {passage.blocks.map((block, index) => {
        const marginTop = spaceBefore(block, passage.blocks[index - 1]);
        if (block.kind === 'break') return <View key={index} style={styles.break} />;
        if (block.kind === 'heading') {
          return (
            <AppText key={index} variant="bodyStrong" style={{ marginTop }}>
              {block.text}
            </AppText>
          );
        }
        return (
          <AppText key={index} variant="scripture" style={[{ marginTop }, block.style === 'poetry' && styles.poetry]}>
            {block.verses.map((verse, position) => (
              <Text key={position}>
                {verse.label ? (
                  <Text
                    accessibilityLabel={strings.bible.verse(verse.label)}
                    style={[styles.verse, { color: colors.accentText }]}>
                    {verse.label}
                    {' '}
                  </Text>
                ) : null}
                {verse.text}
                {position < block.verses.length - 1 ? ' ' : ''}
              </Text>
            ))}
          </AppText>
        );
      })}
      <AppText variant="caption" tone="muted" style={styles.source}>
        {strings.bible.source(BGT.name, BGT.copyright)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  missing: { gap: spacing.md },
  break: { height: spacing.md },
  poetry: { paddingLeft: spacing.md },
  verse: { fontSize: 12, fontFamily: fonts.semibold },
  source: { marginTop: spacing.lg },
});
