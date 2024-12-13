import * as Sentry from '@sentry/react';

type LogLevel = 'info' | 'error' | 'warn' | 'debug';

interface LogContext {
    [key: string]: unknown;
}

class Logger {
    private isDevelopment = process.env.NEXT_PUBLIC_ENV === 'development';

    private log(level: LogLevel, message: string, data?: LogContext) {
        if (this.isDevelopment) {
            console[level](message, data);
        }

        Sentry.addBreadcrumb({
            category: 'app',
            message,
            data,
            level,
        });
    }

    public info(message: string, data?: LogContext): void {
        this.log('info', message, data);
    }

    public error(error: Error, context?: LogContext): void {
        if (this.isDevelopment) {
            console.error(error);
        }

        Sentry.captureException(error, {
            extra: context,
        });
    }

    public warn(message: string, data?: LogContext): void {
        this.log('warn', message, data);
    }

    public debug(message: string, data?: LogContext): void {
        if (this.isDevelopment) {
            this.log('debug', message, data);
        }
    }
}

export const logger = new Logger(); 