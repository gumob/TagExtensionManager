import { Extension } from '@/types/extension';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  persist?: boolean;
  group?: string;
}

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

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private getCallerInfo(): { file: string; line: number; column: number } | undefined {
    const stack = new Error().stack;
    if (!stack) return undefined;

    // スタックトレースから呼び出し元の情報を抽出
    const callerLine = stack.split('\n')[3]; // 0: Error, 1: getCallerInfo, 2: log method, 3: actual caller
    if (!callerLine) return undefined;

    // Chrome拡張機能のURLからファイル名を抽出
    const match = callerLine.match(/chrome-extension:\/\/[^/]+\/([^:]+):(\d+):(\d+)/);
    if (!match) return undefined;

    return {
      file: match[1],
      line: parseInt(match[2], 10),
      column: parseInt(match[3], 10),
    };
  }

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

  debug(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.debug(formattedMessage);
    this.storeLog(message, 'debug', options);
  }

  info(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.info(formattedMessage);
    this.storeLog(message, 'info', options);
  }

  warn(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.warn(formattedMessage);
    this.storeLog(message, 'warn', options);
  }

  error(message: string, options: LogOptions = {}) {
    const caller = this.getCallerInfo();
    const formattedMessage = this.formatMessage(message, options, caller);
    console.error(formattedMessage);
    this.storeLog(message, 'error', options);
  }

  getLogs() {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
