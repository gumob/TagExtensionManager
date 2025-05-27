import { Logger as TSLogger } from 'tslog';

/**
 * The logger instance.
 */
export const logger = new TSLogger({
  name: 'CEM',
  prettyLogTemplate:
    '{{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}][{{fileNameWithLine}}] ',
  type: 'pretty',
  minLevel: process.env.NODE_ENV === 'development' ? 0 : 2, // 0: debug, 2: info
});
