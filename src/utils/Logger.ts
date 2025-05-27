// import { createConsola } from 'consola';
import { Logger } from 'tslog';

/**
 * The TSLogger instance.
 */
export const logger = new Logger({
  name: 'CEM',
  prettyLogTemplate:
    '{{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} [{{name}}][{{fileNameWithLine}}] ',
  type: 'pretty',
  minLevel: process.env.NODE_ENV === 'development' ? 0 : 2, // 0: debug, 2: info
});

// /**
//  * The consola instance.
//  */
// export const logger = createConsola({
//   level: process.env.NODE_ENV === 'development' ? 4 : 2,
//   formatOptions: {
//     columns: 80,
//     colors: true,
//     compact: false,
//     date: true,
//   },
// });
