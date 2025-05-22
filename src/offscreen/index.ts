import { logger } from '@/shared/utils/Logger';
import { detectThemeOnOffscreen } from '@/shared/utils/ThemeUtils';

logger.debug('Starting offscreen document', {
  group: 'offscreen',
  persist: true,
});
/**
 * Initial detection
 */
detectThemeOnOffscreen();
