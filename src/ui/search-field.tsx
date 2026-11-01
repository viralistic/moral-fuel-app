import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { radius, spacing, typography } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Icon } from './icon';

interface Props {
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  clearLabel: string;
}

/** A rounded search field whose border shows focus; the clear button appears once there is text. */
export function SearchField({ value, onChangeText, placeholder, clearLabel }: Props) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={[styles.field, { backgroundColor: 'transparent', borderColor: focused ? colors.accent : colors.borderStrong }]}>
      <Icon name="search" size={18} color={colors.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        accessibilityLabel={placeholder}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        clearButtonMode="never"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[typography.body, styles.input, { fontSize: 15, color: colors.text }]}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel={clearLabel} onPress={() => onChangeText('')} hitSlop={12}>
          <Icon name="clear" size={18} color={colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  // The border shows focus, so the browser's own outline is not needed.
  input: { flex: 1, paddingVertical: spacing.sm, outlineWidth: 0 },
});
