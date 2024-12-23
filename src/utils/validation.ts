export interface ValidationError {
    field: string;
    message: string;
}

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
    return passwordRegex.test(password);
}

export function validateUsername(username: string): boolean {
    // 3-20 characters, letters, numbers, underscores, hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    return usernameRegex.test(username);
}

export function validateRegistration(data: {
    username: string;
    email: string;
    password: string;
}): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!validateUsername(data.username)) {
        errors.push({
            field: 'username',
            message: 'Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens'
        });
    }

    if (!validateEmail(data.email)) {
        errors.push({
            field: 'email',
            message: 'Please enter a valid email address'
        });
    }

    if (!validatePassword(data.password)) {
        errors.push({
            field: 'password',
            message: 'Password must be at least 8 characters and contain uppercase, lowercase, and numbers'
        });
    }

    return errors;
}

export function validateLogin(data: {
    email: string;
    password: string;
}): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!validateEmail(data.email)) {
        errors.push({
            field: 'email',
            message: 'Please enter a valid email address'
        });
    }

    if (!data.password) {
        errors.push({
            field: 'password',
            message: 'Password is required'
        });
    }

    return errors;
} 