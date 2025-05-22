/**
 * The log level type.
 */
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * The log options type.
 *
 * @property level - The log level.
 * @property persist - Whether to persist the log.
 * @property group - The group of the log.
 */
interface LogOptions {
  level?: LogLevel;
  persist?: boolean;
  group?: string;
}

/**
 * The log entry type.
 *
 * @property message - The message of the log.
 * @property level - The log level.
 * @property timestamp - The timestamp of the log.
 * @property group - The group of the log.
 * @property caller - The caller of the log.
 */
interface LogEntry {
  message: string;
  level: LogLevel;
  timestamp: number;
  group?: string;
  caller?: {
    file: string;
    line: number;
    column: number;
  };
}

/**
 * The dummy logger for production environment.
 */
const dummyLogger = {
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  getLogs: () => [],
  clearLogs: () => {},
};

/**
 * The logger class for development environment.
 *
 * @property instance - The instance of the logger.
 * @property logs - The logs of the logger.
 * @property MAX_LOGS - The maximum number of logs.
 * @property getCallerInfo - The caller info of the logger.
 * @property formatMessage - The format message of the logger.
 * @property storeLog - The store log of the logger.
 * @property debug - The debug method of the logger.
 */
class Logger {
  /**
   * The instance of the logger.
   */
  private static instance: Logger;

  /**
   * The logs of the logger.
   */
  private logs: LogEntry[] = [];

  /**
   * The maximum number of logs.
   */
  private readonly MAX_LOGS = 1000;

  /**
   * The constructor of the logger.
   */
  private constructor() {}

  /**
   * Get the instance of the logger.
   */
  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Get the caller info from the stack trace.
   */
  private getCallerInfo(): { file: string; line: number; column: number } | undefined {
    const stack = new Error().stack;
    if (!stack) return undefined;

    /**
     * Get the caller info from the stack trace.
     */
    const callerLine = stack.split('\n')[3]; // 0: Error, 1: getCallerInfo, 2: log method, 3: actual caller
    if (!callerLine) return undefined;

    /**
     * Get the caller info from the stack trace.
     */
    const match = callerLine.match(/chrome-extension:\/\/[^/]+\/([^:]+):(\d+):(\d+)/);
    if (!match) return undefined;

    return {
      file: match[1],
      line: parseInt(match[2], 10),
      column: parseInt(match[3], 10),
    };
  }

  /**
   * The format message method.
   *
   * @param message - The message of the log.
   * @param options - The options of the log.
   * @param caller - The caller of the log.
   */
  private formatMessage(
    message: string,
    options: LogOptions = {},
    caller?: { file: string; line: number; column: number }
  ): string {
    const timestamp = new Date().toISOString();
    const group = options.group ? `[${options.group}]` : '';
    const callerInfo = caller ? `(${caller.file}:${caller.line}:${caller.column})` : '';
    return `${timestamp} ${group} ${callerInfo} ${message}`;
  }

  /**
   * The store log method.
   *
   * @param message - The message of the log.
   * @param level - The level of the log.
   * @param options - The options of the log.
   */
  private storeLog(message: string, level: LogLevel, options: LogOptions = {}) {
    if (options.persist) {
      const caller = this.getCallerInfo();
      this.logs.push({
        message,
        level,
        timestamp: Date.now(),
        group: options.group,
        caller,
      });

      if (this.logs.length > this.MAX_LOGS) {
        this.logs.shift();
      }
    }
  }

  /**
   * The debug method.
   *
   * @param message - The message of the log.
   * @param options - The options of the log.
   */
  debug(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.debug(formattedMessage);
    this.storeLog(message, 'debug', options);
  }

  /**
   * The info method.
   *
   * @param message - The message of the log.
   * @param options - The options of the log.
   */
  info(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.info(formattedMessage);
    this.storeLog(message, 'info', options);
  }

  /**
   * The warn method.
   *
   * @param message - The message of the log.
   * @param options - The options of the log.
   */
  warn(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.warn(formattedMessage);
    this.storeLog(message, 'warn', options);
  }

  /**
   * The error method.
   *
   * @param message - The message of the log.
   * @param options - The options of the log.
   */
  error(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.error(formattedMessage);
    this.storeLog(message, 'error', options);
  }

  /**
   * The get logs method.
   *
   * @returns The logs of the logger.
   */
  getLogs() {
    return this.logs;
  }

  /**
   * The clear logs method.
   */
  clearLogs() {
    this.logs = [];
  }
}

/**
 * Select the logger based on the environment.
 */
export const logger = process.env.NODE_ENV === 'development' ? Logger.getInstance() : dummyLogger;
