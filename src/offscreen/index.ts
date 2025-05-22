import { logger } from '@/utils/Logger';
import { detectThemeOnOffscreen } from '@/utils/ThemeUtils';

logger.debug('Starting offscreen document', {
  group: 'offscreen',
  persist: true,
});
/**
 * Initial detection
 */
detectThemeOnOffscreen();
