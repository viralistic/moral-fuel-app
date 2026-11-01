import { Gauge, HStack, ProgressView, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import {
  containerBackground,
  font,
  foregroundStyle,
  gaugeStyle,
  lineLimit,
  minimumScaleFactor,
  tint,
  widgetURL,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { DashboardWidgetData } from '@/features/widgets/widget-data';

/** Widget D, the daily dashboard: inspiration, journey position and today's action at a glance. */
const Dashboard = (props: DashboardWidgetData, env: WidgetEnvironment) => {
  'widget';
  const bg = '#1F1E1F';
  const ink = '#FFFFFF';
  const muted = '#A3A1A3';
  const gold = '#EE7748';
  const ring = '#E2572B';
  const p = props.progress;
  const position = p.next ? `${props.labels.next}: ${p.next.day}` : p.state === 'done' ? props.labels.allDone : props.labels.start;

  if (env.widgetFamily === 'systemMedium') {
    return (
      <HStack spacing={14} modifiers={[containerBackground(bg, 'widget'), widgetURL(props.link)]}>
        <VStack alignment="leading" spacing={5}>
          <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
          <Text modifiers={[font({ size: 15 }), foregroundStyle(ink), lineLimit(3), minimumScaleFactor(0.85)]}>
            {props.inspiration.text}
          </Text>
          <Spacer />
          <Text modifiers={[font({ size: 10 }), foregroundStyle(muted), lineLimit(1)]}>{props.inspiration.reference}</Text>
        </VStack>
        <VStack spacing={4}>
          <Gauge value={p.completed} min={0} max={p.total} modifiers={[gaugeStyle('circularCapacity'), tint(ring)]}>
            <Text modifiers={[font({ size: 12, weight: 'bold' }), foregroundStyle(ink)]}>{p.percent}%</Text>
          </Gauge>
          <Text modifiers={[font({ size: 10 }), foregroundStyle(muted), lineLimit(2)]}>{position}</Text>
        </VStack>
      </HStack>
    );
  }

  return (
    <VStack alignment="leading" spacing={10} modifiers={[containerBackground(bg, 'widget'), widgetURL(props.link)]}>
      <HStack>
        <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.brand}</Text>
        <Spacer />
        <Text modifiers={[font({ size: 11 }), foregroundStyle(muted)]}>{p.chapter}</Text>
      </HStack>
      <Text modifiers={[font({ size: 19 }), foregroundStyle(ink), lineLimit(4), minimumScaleFactor(0.85)]}>
        {props.inspiration.text}
      </Text>
      <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(muted)]}>
        {props.inspiration.reference} · {props.inspiration.label}
      </Text>
      <VStack alignment="leading" spacing={4}>
        <HStack>
          <Text modifiers={[font({ size: 13, weight: 'semibold' }), foregroundStyle(ink)]}>
            {p.completed}/{p.total} {props.labels.lessons}
          </Text>
          <Spacer />
          <Text modifiers={[font({ size: 12 }), foregroundStyle(muted)]}>{p.percent}%</Text>
        </HStack>
        <ProgressView value={p.total > 0 ? p.completed / p.total : 0} modifiers={[tint(ring)]} />
      </VStack>
      <Spacer />
      {props.action ? (
        <VStack alignment="leading" spacing={2}>
          <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.action}</Text>
          <Text modifiers={[font({ size: 14, weight: 'semibold' }), foregroundStyle(ink), lineLimit(2)]}>{props.action.title}</Text>
          <Text modifiers={[font({ size: 12, weight: 'semibold' }), foregroundStyle(gold)]}>
            {props.labels.continueLesson} · {props.action.day}. {props.action.lessonTitle}
          </Text>
        </VStack>
      ) : (
        <Text modifiers={[font({ size: 13 }), foregroundStyle(muted)]}>{position}</Text>
      )}
    </VStack>
  );
};

export default createWidget<DashboardWidgetData>('Dashboard', Dashboard);
