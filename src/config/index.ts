export const config = {
    api: {
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
        timeout: 10000, // 10 seconds
    },
    supabase: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
        anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        jwtSecret: process.env.NEXT_PUBLIC_JWT_SECRET,
    },
    env: process.env.NEXT_PUBLIC_ENV || 'development',
    isProduction: process.env.NEXT_PUBLIC_ENV === 'production',
    isDevelopment: process.env.NEXT_PUBLIC_ENV === 'development',
};

export const apiEndpoints = {
    auth: {
        login: '/auth/login',
        register: '/auth/register',
        logout: '/auth/logout',
    },
    user: {
        profile: '/users/me',
        preferences: '/users/preferences',
    },
    content: {
        recommendations: '/recommendations',
        feedback: '/recommendations/feedback',
        details: (id: string) => `/content/${id}`,
    },
}; 