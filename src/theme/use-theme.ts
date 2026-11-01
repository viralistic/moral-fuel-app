import { colors } from './tokens';

/** The brand is dark-only, whatever the device setting; screens still read colors through here. */
export function useTheme() {
  return { scheme: 'dark', colors } as const;
}
