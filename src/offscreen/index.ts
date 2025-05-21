import { logger } from '@/utils/logger';
import { detectThemeOnOffscreen } from '@/utils/themeUtils';

logger.debug('Starting offscreen document', {
  group: 'offscreen',
  persist: true,
});
/**
 * Initial detection
 */
detectThemeOnOffscreen();
