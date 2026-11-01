import { Gauge, HStack, ProgressView, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  gaugeStyle,
  lineLimit,
  tint,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { JourneyProgressWidgetData } from '@/features/widgets/widget-data';

/** Widget B, journey progress: real completed lessons from the app, never a date-based count. */
const JourneyProgress = (props: JourneyProgressWidgetData, env: WidgetEnvironment) => {
  'widget';
  const bg = '#2C2B2C';
  const ink = '#FFFFFF';
  const muted = '#A3A1A3';
  const gold = '#E2572B';
  const p = props.progress;
  const count = `${p.completed}/${p.total}`;
  const headline = p.state === 'new' ? props.labels.start : p.state === 'done' ? props.labels.allDone : `${p.percent}% ${props.labels.completed}`;
  const link = p.next ? p.next.link : props.link;

  if (env.widgetFamily === 'systemSmall') {
    return (
      <VStack spacing={8} modifiers={[containerBackground(bg, 'widget'), widgetURL(link)]}>
        <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
        <Gauge value={p.completed} min={0} max={p.total} modifiers={[gaugeStyle('circularCapacity'), tint(gold)]}>
          <Text modifiers={[font({ size: 14, weight: 'bold' }), foregroundStyle(ink)]}>{count}</Text>
        </Gauge>
        <Text modifiers={[font({ size: 11 }), foregroundStyle(muted), lineLimit(2)]}>
          {p.state === 'new' ? props.labels.start : `${props.labels.lessons} ${props.labels.completed}`}
        </Text>
      </VStack>
    );
  }

  const details = (
    <VStack alignment="leading" spacing={4}>
      <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
      <Text modifiers={[font({ size: 20 }), foregroundStyle(ink)]}>
        {count} {props.labels.lessons}
      </Text>
      <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{headline}</Text>
      {p.chapter ? <Text modifiers={[font({ size: 12 }), foregroundStyle(muted), lineLimit(1)]}>{p.chapter}</Text> : null}
    </VStack>
  );

  const next = p.next ? (
    <VStack alignment="leading" spacing={2}>
      <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.next}</Text>
      <Text modifiers={[font({ size: 14, weight: 'semibold' }), foregroundStyle(ink), lineLimit(2)]}>
        {p.next.day}. {p.next.title}
      </Text>
    </VStack>
  ) : null;

  if (env.widgetFamily === 'systemMedium') {
    return (
      <HStack spacing={14} modifiers={[containerBackground(bg, 'widget'), widgetURL(link)]}>
        <Gauge value={p.completed} min={0} max={p.total} modifiers={[gaugeStyle('circularCapacity'), tint(gold)]}>
          <Text modifiers={[font({ size: 13, weight: 'bold' }), foregroundStyle(ink)]}>{p.percent}%</Text>
        </Gauge>
        <VStack alignment="leading" spacing={8}>
          {details}
          {next}
        </VStack>
        <Spacer />
      </HStack>
    );
  }

  return (
    <VStack alignment="leading" spacing={12} modifiers={[containerBackground(bg, 'widget'), widgetURL(link)]}>
      {details}
      <ProgressView value={p.total > 0 ? p.completed / p.total : 0} modifiers={[tint(gold)]} />
      <Spacer />
      {next}
      <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>{props.labels.progress}</Text>
    </VStack>
  );
};

export default createWidget<JourneyProgressWidgetData>('JourneyProgress', JourneyProgress);
