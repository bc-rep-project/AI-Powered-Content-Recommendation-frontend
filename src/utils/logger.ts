import * as Sentry from '@sentry/browser';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogData {
  [key: string]: any;
}

// Map our log levels to Sentry severity levels
const LOG_LEVEL_MAP: { [K in LogLevel]: Sentry.SeverityLevel } = {
  error: 'error',
  warn: 'warning',
  info: 'info',
  debug: 'debug'
};

class Logger {
  private static instance: Logger;

  private constructor() {
    // Initialize Sentry if not in development
    if (process.env.NODE_ENV !== 'development') {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV
      });
    }
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string, data?: LogData, level: LogLevel = 'info'): void {
    // Always log to console in development
    if (process.env.NODE_ENV === 'development') {
      console[level](message, data);
      return;
    }

    // Log to Sentry in production
    Sentry.withScope((scope) => {
      if (data) {
        scope.setExtras(data);
      }
      scope.setLevel(LOG_LEVEL_MAP[level]);
      Sentry.captureMessage(message);
    });
  }

  error(error: Error, data?: LogData): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(error, data);
      return;
    }

    Sentry.withScope((scope) => {
      if (data) {
        scope.setExtras(data);
      }
      Sentry.captureException(error);
    });
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();

// Export types for use in other files
export type { LogLevel, LogData }; 