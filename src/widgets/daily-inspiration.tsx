import { HStack, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  background,
  containerBackground,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  minimumScaleFactor,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { DailyInspirationWidgetData } from '@/features/widgets/widget-data';

type Config = { theme: string };

/**
 * Widget A, daily inspiration. Widget functions run in an isolated runtime: no imports, hooks or
 * module-scope values inside, so colours are declared here and every text arrives in the props.
 */
const DailyInspiration = (props: DailyInspirationWidgetData, env: WidgetEnvironment<Config>) => {
  'widget';
  const bg = '#1F1E1F';
  const ink = '#FFFFFF';
  const muted = '#A3A1A3';
  const gold = '#EE7748';
  const rule = '#E2572B';
  const chosen = env.configuration?.theme as keyof DailyInspirationWidgetData['byTheme'] | undefined;
  const item = (chosen && props.byTheme[chosen]) || props.byTheme.all;

  if (env.widgetFamily === 'systemSmall') {
    return (
      <VStack alignment="leading" spacing={6} modifiers={[containerBackground(bg, 'widget'), widgetURL(item.link)]}>
        <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
        <Text modifiers={[font({ size: 15 }), foregroundStyle(ink), lineLimit(5), minimumScaleFactor(0.8)]}>
          {item.text}
        </Text>
        <Spacer />
        <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(muted), lineLimit(1)]}>{item.reference}</Text>
      </VStack>
    );
  }

  if (env.widgetFamily === 'systemMedium') {
    return (
      <HStack spacing={12} modifiers={[containerBackground(bg, 'widget'), widgetURL(item.link)]}>
        <VStack modifiers={[frame({ width: 3 }), frame({ maxHeight: 10000 }), background(rule)]}>
          <Spacer />
        </VStack>
        <VStack alignment="leading" spacing={6}>
          <HStack>
            <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
            <Spacer />
            <Text modifiers={[font({ size: 10 }), foregroundStyle(muted)]}>{item.themeLabel}</Text>
          </HStack>
          <Text modifiers={[font({ size: 17 }), foregroundStyle(ink), lineLimit(4), minimumScaleFactor(0.8)]}>
            {item.text}
          </Text>
          <Spacer />
          <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(muted), lineLimit(1)]}>
            {item.reference} · {item.label}
          </Text>
        </VStack>
      </HStack>
    );
  }

  const action = props.action;
  return (
    <VStack alignment="leading" spacing={10} modifiers={[containerBackground(bg, 'widget'), widgetURL(action ? action.link : item.link)]}>
      <HStack>
        <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
        <Spacer />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>{props.labels.inspiration}</Text>
      </HStack>
      <Text modifiers={[font({ size: 22 }), foregroundStyle(ink), lineLimit(6), minimumScaleFactor(0.8)]}>
        {item.text}
      </Text>
      <Text modifiers={[font({ size: 12, weight: 'medium' }), foregroundStyle(muted)]}>
        {item.reference} · {item.label}
      </Text>
      <Text modifiers={[font({ size: 13 }), foregroundStyle(muted), lineLimit(3)]}>{item.note}</Text>
      <Spacer />
      {action ? (
        <VStack alignment="leading" spacing={3}>
          <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.action}</Text>
          <Text modifiers={[font({ size: 15, weight: 'semibold' }), foregroundStyle(ink), lineLimit(2)]}>{action.title}</Text>
        </VStack>
      ) : null}
    </VStack>
  );
};

export default createWidget<DailyInspirationWidgetData, Config>('DailyInspiration', DailyInspiration);
