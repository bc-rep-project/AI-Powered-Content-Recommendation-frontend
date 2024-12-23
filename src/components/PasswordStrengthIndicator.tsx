'use client';

import { motion } from 'framer-motion';

interface PasswordStrengthIndicatorProps {
    password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
    const getStrength = (): { strength: number; label: string; color: string } => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const strengthMap = {
            0: { label: 'Very Weak', color: 'bg-red-500' },
            1: { label: 'Weak', color: 'bg-orange-500' },
            2: { label: 'Fair', color: 'bg-yellow-500' },
            3: { label: 'Good', color: 'bg-blue-500' },
            4: { label: 'Strong', color: 'bg-green-500' },
            5: { label: 'Very Strong', color: 'bg-green-600' }
        };

        return { strength, ...strengthMap[strength as keyof typeof strengthMap] };
    };

    const { strength, label, color } = getStrength();
    const percentage = (strength / 5) * 100;

    return (
        <div className="mt-1">
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                    className={`h-full ${color} transition-all duration-300`} 
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className={`text-xs mt-1 ${strength > 2 ? 'text-green-600' : 'text-red-500'}`}>
                Password strength: {label}
            </p>
        </div>
    );
} 