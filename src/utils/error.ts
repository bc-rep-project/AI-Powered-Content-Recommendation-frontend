export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode?: number,
        public details?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export const handleApiError = (error: unknown): string => {
    if (error instanceof ApiError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'An unexpected error occurred';
}; 