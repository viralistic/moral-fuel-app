import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { fonts, radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { ProgressBar } from '@/ui/progress-bar';
import { AppText } from '@/ui/text';

import type { WidgetBundle } from './widget-data';

/**
 * React Native look-alikes of the native widgets, for the gallery only. They read the same bundle
 * the widgets get, so the preview shows the user's real content; the screen labels them a preview.
 */

const SMALL = 150;
const WIDE = 320;

function Frame({ size, tone, children }: { size: 'small' | 'medium' | 'large' | 'lock'; tone: 'ivory' | 'forest' | 'white'; children: ReactNode }) {
  const { colors } = useTheme();
  const background = { ivory: colors.background, forest: colors.surfaceRaised, white: colors.surface }[tone];
  const dims = {
    small: { width: SMALL, height: SMALL },
    medium: { width: WIDE, height: SMALL },
    large: { width: WIDE, height: WIDE },
    lock: { width: 170, height: 72 },
  }[size];
  return (
    <View
      accessible
      accessibilityRole="image"
      style={[styles.frame, dims, { backgroundColor: background, borderColor: colors.border }, size === 'lock' && styles.lock]}>
      {children}
    </View>
  );
}

function Line({ children, size = 11, serif, tone = 'muted', lines }: { children: ReactNode; size?: number; serif?: boolean; tone?: 'ink' | 'muted' | 'gold'; lines?: number }) {
  const { colors } = useTheme();
  const color = { ink: colors.text, muted: colors.textMuted, gold: colors.accentText }[tone];
  return (
    <AppText
      numberOfLines={lines}
      maxFontSizeMultiplier={1.2}
      style={{ fontSize: size, lineHeight: Math.round(size * 1.3), color, fontFamily: serif ? fonts.display : tone === 'gold' ? fonts.semibold : fonts.regular }}>
      {children}
    </AppText>
  );
}

export function DailyPreview({ bundle, size }: { bundle: WidgetBundle; size: 'small' | 'medium' }) {
  const item = bundle.daily[0].props.byTheme.all;
  const labels = bundle.daily[0].props.labels;
  return (
    <Frame size={size} tone="ivory">
      <Line tone="gold" size={9}>{labels.brand}</Line>
      <Line serif tone="ink" size={size === 'small' ? 13 : 15} lines={size === 'small' ? 5 : 4}>{item.text}</Line>
      <View style={styles.push} />
      <Line size={10}>{size === 'small' ? item.reference : `${item.reference} · ${item.label}`}</Line>
    </Frame>
  );
}

export function ProgressPreview({ bundle }: { bundle: WidgetBundle }) {
  const { progress, labels } = bundle.progress;
  return (
    <Frame size="medium" tone="forest">
      <Line tone="gold" size={9}>{labels.brand}</Line>
      <Line serif tone="ink" size={18}>{`${progress.completed}/${progress.total} ${labels.lessons}`}</Line>
      <Line size={11}>{progress.state === 'new' ? labels.start : `${progress.percent}% ${labels.completed} · ${progress.chapter}`}</Line>
      <View style={styles.push} />
      <ProgressBar value={progress.completed} max={progress.total} label={`${progress.percent}%`} />
      {progress.next ? <Line size={11} tone="ink" lines={1}>{`${labels.next}: ${progress.next.day}. ${progress.next.title}`}</Line> : null}
    </Frame>
  );
}

export function ActionPreview({ bundle }: { bundle: WidgetBundle }) {
  const { action, labels } = bundle.action;
  return (
    <Frame size="medium" tone="white">
      <Line tone="gold" size={10}>{labels.action}</Line>
      <Line serif tone="ink" size={15} lines={2}>{action ? action.title : labels.emptyAction}</Line>
      {action ? <Line size={11} lines={2}>{action.description}</Line> : null}
      <View style={styles.push} />
      {action ? <Line size={10}>{`${action.day}. ${action.lessonTitle} · ${action.reference}`}</Line> : null}
    </Frame>
  );
}

export function DashboardPreview({ bundle }: { bundle: WidgetBundle }) {
  const { inspiration, progress, labels } = bundle.dashboard[0].props;
  return (
    <Frame size="medium" tone="ivory">
      <View style={styles.row}>
        <View style={styles.flex}>
          <Line tone="gold" size={9}>{labels.brand}</Line>
          <Line serif tone="ink" size={13} lines={3}>{inspiration.text}</Line>
          <View style={styles.push} />
          <Line size={10}>{inspiration.reference}</Line>
        </View>
        <View style={styles.side}>
          <Line serif tone="ink" size={20}>{`${progress.percent}%`}</Line>
          <Line size={10}>{`${progress.completed}/${progress.total}`}</Line>
        </View>
      </View>
    </Frame>
  );
}

export function LockPreview({ bundle }: { bundle: WidgetBundle }) {
  const { inspiration, progress, labels } = bundle.lockScreen[0].props;
  return (
    <Frame size="lock" tone="white">
      <Line tone="ink" size={10}>{labels.brand}</Line>
      <Line tone="ink" size={11} lines={2}>{progress ? `${progress.completed}/${progress.total} ${labels.lessons}` : inspiration.text}</Line>
    </Frame>
  );
}

const styles = StyleSheet.create({
  frame: { borderRadius: radius.lg, borderWidth: StyleSheet.hairlineWidth, padding: spacing.md, gap: 4, overflow: 'hidden' },
  lock: { borderRadius: radius.md, padding: spacing.sm },
  push: { flex: 1 },
  row: { flexDirection: 'row', gap: spacing.md, flex: 1 },
  flex: { flex: 1, gap: 4 },
  side: { alignItems: 'center', justifyContent: 'center', gap: 2 },
});
