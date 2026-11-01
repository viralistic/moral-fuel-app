import { StyleSheet, View } from 'react-native';

import { fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Icon, type IconName } from './icon';
import { AppText } from './text';

type Tone = 'done' | 'active' | 'neutral' | 'soon';

export function Badge({ label, tone, icon }: { label: string; tone: Tone; icon?: IconName }) {
  const { colors } = useTheme();
  const look = {
    done: { bg: colors.textMuted, fg: colors.onPrimary, border: colors.textMuted },
    active: { bg: 'transparent', fg: colors.accentText, border: colors.accent },
    neutral: { bg: colors.surfaceMuted, fg: colors.text, border: colors.surfaceMuted },
    soon: { bg: 'transparent', fg: colors.textMuted, border: colors.borderStrong },
  }[tone];
  return (
    <View style={[styles.badge, { backgroundColor: look.bg, borderColor: look.border }]}>
      {icon ? <Icon name={icon} size={12} color={look.fg} /> : null}
      <AppText variant="caption" style={{ color: look.fg, fontFamily: fonts.medium }}>
        {label}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
