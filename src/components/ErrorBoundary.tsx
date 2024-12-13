import React from 'react';
import * as Sentry from '@sentry/react';

interface Props {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        // Convert ErrorInfo to a plain object for Sentry
        const errorInfoObj = {
            componentStack: errorInfo.componentStack,
        };

        Sentry.captureException(error, {
            extra: errorInfoObj,
        });
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div>
                    <h2>Something went wrong.</h2>
                    <button onClick={() => window.location.reload()}>
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
} 