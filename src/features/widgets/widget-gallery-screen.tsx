import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';
import type { Edge } from 'react-native-safe-area-context';

import { useAppState, useStrings } from '@/state/app-state';
import { fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';
import { Icon } from '@/ui/icon';
import { Screen } from '@/ui/screen';
import { AppText } from '@/ui/text';

import { buildWidgetBundle } from './widget-data';
import { ActionPreview, DailyPreview, DashboardPreview, LockPreview, ProgressPreview } from './widget-previews';

const EDGES: Edge[] = Platform.OS === 'ios' ? ['left', 'right', 'bottom'] : ['top', 'left', 'right', 'bottom'];

/** Shows each widget with a labelled preview and honest instructions; nothing here pretends to add a widget. */
export function WidgetGalleryScreen() {
  const strings = useStrings();
  const t = strings.widgetGallery;
  const router = useRouter();
  const { state, actions } = useAppState();
  const { colors } = useTheme();
  const bundle = buildWidgetBundle(state, new Date(), strings);
  const close = () => (router.canGoBack() ? router.back() : router.replace('/you'));
  const platformNote = Platform.OS === 'android' ? t.android : Platform.OS === 'web' ? t.web : t.requirements;

  return (
    <Screen edges={EDGES}>
      <View style={styles.top}>
        <AppText variant="display">{t.title}</AppText>
        <Pressable accessibilityRole="button" accessibilityLabel={t.close} onPress={close} hitSlop={8} style={styles.close}>
          <Icon name="close" size={20} color={colors.text} />
        </Pressable>
      </View>
      <AppText tone="muted">{t.subtitle}</AppText>
      <Card tone="muted">
        <AppText variant="small">{platformNote}</AppText>
      </Card>

      <Kind title={t.kinds.daily.title} body={t.kinds.daily.body} sizes={[t.sizes.systemSmall, t.sizes.systemMedium, t.sizes.systemLarge]}>
        <DailyPreview bundle={bundle} size="small" />
        <DailyPreview bundle={bundle} size="medium" />
      </Kind>
      <Kind title={t.kinds.progress.title} body={t.kinds.progress.body} sizes={[t.sizes.systemSmall, t.sizes.systemMedium, t.sizes.systemLarge]}>
        <ProgressPreview bundle={bundle} />
      </Kind>
      <Kind title={t.kinds.action.title} body={t.kinds.action.body} sizes={[t.sizes.systemMedium, t.sizes.systemLarge]}>
        <ActionPreview bundle={bundle} />
      </Kind>
      <Kind title={t.kinds.dashboard.title} body={t.kinds.dashboard.body} sizes={[t.sizes.systemMedium, t.sizes.systemLarge]}>
        <DashboardPreview bundle={bundle} />
      </Kind>
      <Kind title={t.kinds.lock.title} body={t.kinds.lock.body} sizes={[t.sizes.lock]}>
        <LockPreview bundle={bundle} />
      </Kind>

      {Platform.OS === 'ios' ? (
        <>
          <Steps title={t.howTitle} steps={t.howSteps} />
          <Steps title={t.lockTitle} steps={t.lockSteps} />
        </>
      ) : null}

      <View style={[styles.block, { borderTopColor: colors.border }]}>
        <AppText variant="title">{t.privacyTitle}</AppText>
        <View style={styles.switchRow}>
          <View style={styles.flex}>
            <AppText variant="bodyStrong">{t.privacySwitch}</AppText>
            <AppText variant="small" tone="muted">
              {t.privacyHint}
            </AppText>
          </View>
          <Switch
            value={state.preferences.lockScreenProgress}
            onValueChange={(value) => actions.updatePreferences({ lockScreenProgress: value })}
            accessibilityLabel={t.privacySwitch}
            accessibilityHint={t.privacyHint}
            trackColor={{ true: colors.primary, false: colors.border }}
          />
        </View>
        <View style={styles.note}>
          <Icon name="lock" size={14} color={colors.textMuted} />
          <AppText variant="small" tone="muted" style={styles.flex}>
            {t.privacyNote}
          </AppText>
        </View>
      </View>
    </Screen>
  );
}

function Kind({ title, body, sizes, children }: { title: string; body: string; sizes: string[]; children: ReactNode }) {
  const strings = useStrings();
  const { colors } = useTheme();
  return (
    <View style={[styles.block, { borderTopColor: colors.border }]}>
      <AppText variant="heading">{title}</AppText>
      <AppText variant="small" tone="muted">
        {body}
      </AppText>
      <View style={styles.badges}>
        {sizes.map((size) => (
          <Badge key={size} label={size} tone="neutral" />
        ))}
      </View>
      <AppText variant="overline" tone="accent">
        {strings.widgetGallery.preview}
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.previews}
        accessibilityLabel={`${strings.widgetGallery.preview}: ${title}`}>
        {children}
      </ScrollView>
      <AppText variant="caption" tone="muted">
        {strings.widgetGallery.previewNote}
      </AppText>
    </View>
  );
}

function Steps({ title, steps }: { title: string; steps: string[] }) {
  const { colors } = useTheme();
  return (
    <View style={[styles.block, { borderTopColor: colors.border }]}>
      <AppText variant="title">{title}</AppText>
      {steps.map((step, index) => (
        <View key={step} style={styles.step}>
          <View style={[styles.stepNumber, { borderColor: colors.primary }]}>
            <AppText variant="small" style={styles.stepNumberText}>
              {index + 1}
            </AppText>
          </View>
          <AppText style={styles.flex}>{step}</AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.md },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  block: { gap: spacing.sm, borderTopWidth: StyleSheet.hairlineWidth, paddingTop: spacing.lg },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  previews: { gap: spacing.md, paddingVertical: spacing.xs, paddingRight: spacing.lg },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  note: { flexDirection: 'row', gap: spacing.xs, alignItems: 'flex-start' },
  step: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  stepNumber: { width: 28, height: 28, borderRadius: radius.pill, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontFamily: fonts.semibold },
  flex: { flex: 1 },
});
