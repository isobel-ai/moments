import { useFonts } from 'expo-font';
import {
  CormorantGaramond_500Medium,
  CormorantGaramond_600SemiBold,
} from '@expo-google-fonts/cormorant-garamond';
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { ReenieBeanie_400Regular } from '@expo-google-fonts/reenie-beanie';

/**
 * Loads the design fonts used across the Moments prototype.
 * Returns `[loaded, error]` so the caller can gate rendering.
 */
export function useMomentsFonts(): [boolean, Error | null] {
  const [loaded, error] = useFonts({
    CormorantGaramond_500Medium,
    CormorantGaramond_600SemiBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    ReenieBeanie_400Regular,
  });
  return [loaded, error];
}
