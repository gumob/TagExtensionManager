import { createConsola } from 'consola';
import { Logger } from 'tslog';

const createLogger = (loggerType: 'tslog' | 'consola') => {
  if (loggerType === 'tslog') {
    /**
     * TSLogger
     * @reference https://github.com/fullstack-build/tslog
     */
    return new Logger({
      name: 'CEM',
      prettyLogTemplate: '{{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}][{{fileNameWithLine}}] ',
      type: 'pretty',
      minLevel: process.env.NODE_ENV === 'development' ? 0 : 2, // 0: debug, 2: info
    });
  } else {
    /**
     * Consola
     * @reference https://github.com/unjs/consola
     */
    return createConsola({
      level: process.env.NODE_ENV === 'development' ? 4 : 2,
      formatOptions: {
        columns: 80,
        colors: true,
        compact: false,
        date: true,
      },
    });
  }
};

export const logger = createLogger('tslog');
