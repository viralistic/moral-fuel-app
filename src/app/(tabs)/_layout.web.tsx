import { TabList, TabSlot, TabTrigger, Tabs, type TabListProps, type TabTriggerSlotProps } from 'expo-router/ui';
import { Children, Fragment } from 'react';
import { Pressable, StyleSheet, View, type PressableProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStrings } from '@/state/app-state';
import { MAX_CONTENT_WIDTH, fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Icon, type IconName } from '@/ui/icon';
import { AppText } from '@/ui/text';

const TABS = [
  { name: 'index', href: '/', label: 'today', icon: 'today' },
  { name: 'journey', href: '/journey', label: 'journey', icon: 'journey' },
  { name: 'explore', href: '/explore', label: 'explore', icon: 'explore' },
  { name: 'journal', href: '/journal', label: 'journal', icon: 'journal' },
  { name: 'you', href: '/you', label: 'you', icon: 'you' },
] as const;

/** Native tabs have no proper web bar, so the web gets the brand's floating bar of its own. */
export default function WebTabLayout() {
  const strings = useStrings();
  const { colors } = useTheme();
  return (
    // Our style replaces the Tabs root style, so it must keep flex: 1 for the bar to stay at the bottom.
    <Tabs style={{ flex: 1, backgroundColor: colors.background }}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar>
          {TABS.map((tab) => (
            <TabTrigger key={tab.name} name={tab.name} href={tab.href} asChild>
              <TabButton label={strings.tabs[tab.label]} icon={tab.icon} />
            </TabTrigger>
          ))}
        </TabBar>
      </TabList>
    </Tabs>
  );
}

/** TabList passes its own props through; a component child keeps expo-router's Slot happy. */
function TabBar({ children, ...props }: TabListProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const items = Children.toArray(children);
  return (
    <View
      {...props}
      accessibilityRole="tablist"
      style={[styles.bar, { backgroundColor: colors.background, paddingBottom: insets.bottom + spacing.sm }]}>
      <View style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {items.map((item, index) => (
          <Fragment key={index}>
            {index > 0 ? <View style={[styles.divider, { backgroundColor: colors.border }]} /> : null}
            {item}
          </Fragment>
        ))}
      </View>
    </View>
  );
}

function TabButton({ label, icon, isFocused, ...props }: TabTriggerSlotProps & { label: string; icon: IconName }) {
  const { colors } = useTheme();
  const color = isFocused ? colors.text : colors.textMuted;
  return (
    <Pressable
      {...(props as PressableProps)}
      accessibilityRole="tab"
      accessibilityState={{ selected: !!isFocused }}
      accessibilityLabel={label}
      style={({ pressed }) => [styles.tab, pressed && styles.pressed]}>
      <View>
        <Icon name={icon} size={22} color={color} />
        {/* The ember dot marks the open tab; the label's weight says the same without colour. */}
        {isFocused ? <View style={[styles.dot, { backgroundColor: colors.accent, borderColor: colors.surface }]} /> : null}
      </View>
      <AppText variant="caption" style={{ color, fontFamily: isFocused ? fonts.medium : fonts.regular, fontSize: 11 }}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1 },
  bar: { paddingHorizontal: spacing.md, paddingTop: spacing.xs },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingVertical: spacing.xs,
  },
  divider: { width: 1, alignSelf: 'stretch', marginVertical: spacing.xs },
  tab: { flex: 1, alignItems: 'center', gap: 2, paddingVertical: spacing.xxs, minHeight: 52, justifyContent: 'center' },
  dot: { position: 'absolute', top: -4, left: -6, width: 10, height: 10, borderRadius: 5, borderWidth: 1.5 },
  pressed: { opacity: 0.7 },
});
