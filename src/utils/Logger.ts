import { Logger as TSLogger } from 'tslog';

/**
 * The logger instance.
 */
export const logger = new TSLogger({
  name: 'ExtensionManager',
  type: 'pretty',
  minLevel: process.env.NODE_ENV === 'development' ? 0 : 2, // 0: debug, 2: info
});
