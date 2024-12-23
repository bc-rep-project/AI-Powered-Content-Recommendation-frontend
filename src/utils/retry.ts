interface RetryConfig {
    maxAttempts?: number;
    delayMs?: number;
    backoff?: boolean;
}

export async function retry<T>(
    fn: () => Promise<T>,
    config: RetryConfig = {}
): Promise<T> {
    const { maxAttempts = 3, delayMs = 1000, backoff = true } = config;
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));
            
            if (attempt === maxAttempts) {
                throw lastError;
            }
            
            const delay = backoff ? delayMs * attempt : delayMs;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    
    throw lastError!;
} 