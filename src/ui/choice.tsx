import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Icon } from './icon';
import { AppText } from './text';

interface OptionProps {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
}

/** A full-width single-choice option: onboarding answers and the same choices in settings. */
export function OptionRow({ title, description, selected, onPress }: OptionProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      // iOS has no radio trait: VoiceOver reads a selected button instead.
      accessibilityRole={Platform.OS === 'ios' ? 'button' : 'radio'}
      accessibilityState={{ checked: selected, selected }}
      accessibilityLabel={description ? `${title}. ${description}` : title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          backgroundColor: selected ? colors.selected : colors.surface,
          borderColor: selected ? colors.accent : colors.border,
        },
        pressed && styles.pressed,
      ]}>
      <View style={styles.optionText}>
        <AppText variant="bodyStrong">{title}</AppText>
        {description ? (
          <AppText variant="small" tone="muted">
            {description}
          </AppText>
        ) : null}
      </View>
      <Icon name={selected ? 'checkCircle' : 'circle'} size={22} color={selected ? colors.accent : colors.borderStrong} />
    </Pressable>
  );
}

/** A compact toggle used for filters. */
export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : 'transparent',
          borderColor: selected ? colors.primary : colors.borderStrong,
        },
        pressed && styles.pressed,
      ]}>
      <AppText variant="small" style={{ color: selected ? colors.onPrimary : colors.text }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 56,
  },
  optionText: { flex: 1, gap: 2 },
  chip: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  pressed: { opacity: 0.82 },
});
