import { logger } from '@/utils/Logger';
import { detectThemeOnOffscreen } from '@/utils/ThemeUtils';

logger.debug('🌱 Initializing offscreen document', {
  group: 'offscreen',
  persist: true,
});
/**
 * Initial detection
 */
detectThemeOnOffscreen();
