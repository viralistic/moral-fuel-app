import { NativeTabs } from 'expo-router/native-tabs';

import { useStrings } from '@/state/app-state';
import { useTheme } from '@/theme/use-theme';
import { ICONS } from '@/ui/icon';

const TABS = [
  { name: 'index', label: 'today', icon: ICONS.today },
  { name: 'journey', label: 'journey', icon: ICONS.journey },
  { name: 'explore', label: 'explore', icon: ICONS.explore },
  { name: 'journal', label: 'journal', icon: ICONS.journal },
  { name: 'you', label: 'you', icon: ICONS.you },
] as const;

export default function TabLayout() {
  const strings = useStrings();
  const { colors } = useTheme();
  return (
    <NativeTabs
      tintColor={colors.text}
      iconColor={{ default: colors.textMuted, selected: colors.text }}
      indicatorColor={colors.surfaceMuted}
      backgroundColor={colors.surface}
      labelStyle={{ default: { color: colors.textMuted }, selected: { color: colors.text } }}>
      {TABS.map((tab) => (
        <NativeTabs.Trigger key={tab.name} name={tab.name} contentStyle={{ backgroundColor: colors.background }}>
          <NativeTabs.Trigger.Label>{strings.tabs[tab.label]}</NativeTabs.Trigger.Label>
          <NativeTabs.Trigger.Icon sf={tab.icon.ios} md={tab.icon.android} />
        </NativeTabs.Trigger>
      ))}
    </NativeTabs>
  );
}
