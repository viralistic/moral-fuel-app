import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';

import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';

import { Icon, type IconName } from './icon';
import { AppText } from './text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  variant?: Variant;
  icon?: IconName;
  iconPosition?: 'start' | 'end';
}

export function Button({ label, variant = 'primary', icon, iconPosition = 'end', disabled, ...props }: ButtonProps) {
  const { colors } = useTheme();
  const look = {
    primary: { bg: colors.primary, fg: colors.onPrimary, border: colors.primary },
    secondary: { bg: 'transparent', fg: colors.text, border: colors.borderStrong },
    ghost: { bg: 'transparent', fg: colors.text, border: 'transparent' },
    danger: { bg: 'transparent', fg: colors.danger, border: colors.danger },
  }[variant];
  const iconNode = icon ? <Icon name={icon} size={18} color={look.fg} /> : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: look.bg, borderColor: look.border },
        variant === 'ghost' && styles.ghost,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
      {...props}>
      <View style={styles.content}>
        {iconPosition === 'start' && iconNode}
        <AppText variant="bodyStrong" style={{ color: look.fg }} numberOfLines={2}>
          {label}
        </AppText>
        {iconPosition === 'end' && iconNode}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    justifyContent: 'center',
  },
  ghost: { paddingHorizontal: spacing.sm, minHeight: 44 },
  content: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs },
  pressed: { opacity: 0.82 },
  disabled: { opacity: 0.45 },
});
