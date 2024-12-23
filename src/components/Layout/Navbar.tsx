'use client';

import { AnimatedLink } from '../AnimatedLink';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <AnimatedLink href="/" className="text-xl font-semibold">
                            AI Recommendations
                        </AnimatedLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                <AnimatedLink href="/dashboard">
                                    Dashboard
                                </AnimatedLink>
                                <button
                                    onClick={logout}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <AnimatedLink href="/login">
                                    Login
                                </AnimatedLink>
                                <AnimatedLink href="/register">
                                    Register
                                </AnimatedLink>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
} 