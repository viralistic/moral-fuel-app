import { View } from 'react-native';

import { Logo } from './logo';

/** The MoralFuel logotype as a page header. */
export function Wordmark({ width = 132 }: { width?: number }) {
  return (
    <View accessible accessibilityRole="header" accessibilityLabel="Moral Fuel" style={{ alignSelf: 'flex-start' }}>
      <Logo width={width} decorative />
    </View>
  );
}
