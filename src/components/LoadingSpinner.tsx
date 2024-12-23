interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
}

const sizes = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
} as const;

export function LoadingSpinner({ size = 'md', fullScreen = true }: LoadingSpinnerProps) {
    const spinner = (
        <div 
            role="status"
            className={`animate-spin rounded-full border-4 border-gray-200 border-t-blue-500 ${sizes[size]}`}
        >
            <span className="sr-only">Loading...</span>
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                {spinner}
            </div>
        );
    }

    return spinner;
} 