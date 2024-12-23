'use client';

import React from 'react';

type ErrorBoundaryProps = {
    children: React.ReactNode;
    fallback: React.ReactNode;
};

type ErrorBoundaryState = {
    hasError: boolean;
    error: Error | null;
};

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    public state: ErrorBoundaryState = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    public componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error('Error caught by error boundary:', error, errorInfo);
    }

    public render(): React.ReactNode {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps): JSX.Element {
    return (
        <ErrorBoundaryClass fallback={fallback}>
            {children}
        </ErrorBoundaryClass>
    );
} 