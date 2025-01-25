'use client';

import { userApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await userApi.logout();
            router.push('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
            Sign Out
        </button>
    );
} 