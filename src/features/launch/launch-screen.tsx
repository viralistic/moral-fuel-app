import { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

import { useStrings } from '@/state/app-state';
import { radius, spacing } from '@/theme/tokens';
import { useTheme } from '@/theme/use-theme';
import { Logo, LOGO_ASPECT } from '@/ui/logo';
import { AppText } from '@/ui/text';

/** Matches imageWidth of the native splash in app.json, so the logo does not move on hand-over. */
export const LAUNCH_LOGO_WIDTH = 220;
const BAR_WIDTH = 204;
/** The bar runs this far on its own; it finishes once the app has really loaded. */
const WARM_UP = { to: 0.8, ms: 700 };
const FINISH_MS = 240;

interface Props {
  /** True once stored state is read; the bar then completes and onDone fires. */
  ready: boolean;
  onDone: () => void;
}

/**
 * The branded loader (styling/reference/loader.png): logo, an outlined progress bar, the tagline
 * and a giant watermark. With reduced motion it skips the animation and hands over at once.
 */
export function LaunchScreen({ ready, onDone }: Props) {
  const strings = useStrings();
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const [fill] = useState(() => new Animated.Value(0));
  const [warm, setWarm] = useState(reduceMotion);

  useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(fill, {
      toValue: WARM_UP.to,
      duration: WARM_UP.ms,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setWarm(true));
  }, [fill, reduceMotion]);

  useEffect(() => {
    if (!ready || !warm) return;
    if (reduceMotion) {
      onDone();
      return;
    }
    Animated.timing(fill, { toValue: 1, duration: FINISH_MS, easing: Easing.inOut(Easing.quad), useNativeDriver: false }).start(
      () => onDone(),
    );
  }, [ready, warm, reduceMotion, fill, onDone]);

  const markWidth = width * 1.38;
  const logoHeight = LAUNCH_LOGO_WIDTH / LOGO_ASPECT;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[styles.watermark, { width: markWidth, left: -width * 0.175, bottom: height * 0.025 }]}
        pointerEvents="none">
        <Logo width={markWidth} color={colors.watermark} decorative />
      </View>

      <View style={styles.center}>
        <Logo width={LAUNCH_LOGO_WIDTH} />
        <View
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel={strings.brand.loading}
          style={[
            styles.track,
            { top: height / 2 + logoHeight / 2 + spacing.lg, left: (width - BAR_WIDTH) / 2, borderColor: colors.primary },
          ]}>
          <Animated.View
            style={[
              styles.fill,
              {
                backgroundColor: colors.primary,
                width: fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              },
            ]}
          />
        </View>
      </View>

      <AppText variant="small" tone="muted" style={[styles.tagline, { top: height * 0.84 }]}>
        {strings.brand.loaderTagline}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' },
  watermark: { position: 'absolute' },
  // The logo sits at the exact centre, where the native splash draws it.
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  track: {
    position: 'absolute',
    width: BAR_WIDTH,
    height: 10,
    borderWidth: 1,
    borderRadius: radius.pill,
    padding: 1.5,
  },
  // The minimum width shows a dot at the start, as in the design.
  fill: { height: '100%', minWidth: 5, borderRadius: radius.pill },
  tagline: { position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 16, letterSpacing: 0.3 },
});
