import { HStack, Image, Spacer, Text, VStack } from '@expo/ui/swift-ui';
import { containerBackground, font, foregroundStyle, lineLimit, widgetURL } from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { TodayActionWidgetData } from '@/features/widgets/widget-data';

/** Widget C, today's action: the live step of the recommended lesson, offered as an invitation. */
const TodayAction = (props: TodayActionWidgetData, env: WidgetEnvironment) => {
  'widget';
  const bg = '#1F1E1F';
  const ink = '#FFFFFF';
  const muted = '#A3A1A3';
  const gold = '#EE7748';
  const chalk = '#F5F3F5';
  const a = props.action;
  const large = env.widgetFamily === 'systemLarge';

  return (
    <VStack alignment="leading" spacing={large ? 12 : 6} modifiers={[containerBackground(bg, 'widget'), widgetURL(props.link)]}>
      <HStack spacing={6}>
        <Image systemName="figure.walk" size={13} color={chalk} />
        <Text modifiers={[font({ size: 11, weight: 'semibold' }), foregroundStyle(gold)]}>{props.labels.action}</Text>
        <Spacer />
        <Text modifiers={[font({ size: 10, weight: 'semibold' }), foregroundStyle(muted)]}>{props.labels.brand}</Text>
      </HStack>
      {a ? (
        <VStack alignment="leading" spacing={large ? 8 : 4}>
          <Text modifiers={[font({ size: large ? 22 : 17 }), foregroundStyle(ink), lineLimit(2)]}>{a.title}</Text>
          <Text modifiers={[font({ size: large ? 15 : 12 }), foregroundStyle(muted), lineLimit(large ? 7 : 2)]}>{a.description}</Text>
          <Spacer />
          <Text modifiers={[font({ size: 11, weight: 'medium' }), foregroundStyle(chalk), lineLimit(1)]}>
            {a.day}. {a.lessonTitle} · {a.reference}
          </Text>
        </VStack>
      ) : (
        <VStack alignment="leading" spacing={4}>
          <Text modifiers={[font({ size: 17 }), foregroundStyle(ink), lineLimit(3)]}>{props.labels.emptyAction}</Text>
          <Spacer />
        </VStack>
      )}
    </VStack>
  );
};

export default createWidget<TodayActionWidgetData>('TodayAction', TodayAction);
