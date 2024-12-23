export interface User {
    id?: string;
    email: string;
    username: string;
    picture?: string | null;
    oauth_provider?: string | null;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user?: User;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
} 