interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
}

export default function LoadingSpinner({ size = 'medium' }: LoadingSpinnerProps) {
    const sizeClasses = {
        small: 'h-4 w-4',
        medium: 'h-8 w-8',
        large: 'h-12 w-12'
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`animate-spin ${sizeClasses[size]} border-4 border-blue-600 rounded-full border-t-transparent`}>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
} 