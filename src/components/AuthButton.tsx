'use client';

import { useAuth } from '@/lib/auth';
import { LogIn, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function AuthButton() {
    const { user, loading, signInWithGoogle, signOutUser } = useAuth();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const handleSignIn = async () => {
        setIsAuthenticating(true);
        try {
            await signInWithGoogle();
        } finally {
            setIsAuthenticating(false);
        }
    };

    const handleSignOut = async () => {
        setIsAuthenticating(true);
        try {
            await signOutUser();
        } finally {
            setIsAuthenticating(false);
        }
    };

    if (loading) {
        return (
            <button disabled className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-400 font-medium cursor-not-allowed">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
            </button>
        );
    }

    return user ? (
        <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gray-200" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user.displayName || 'User'}</span>
            </div>
            <button
                onClick={handleSignOut}
                disabled={isAuthenticating}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors font-medium"
            >
                {isAuthenticating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                <span className="hidden sm:inline">Sign Out</span>
            </button>
        </div>
    ) : (
        <button
            onClick={handleSignIn}
            disabled={isAuthenticating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-all font-medium flex-shrink-0"
        >
            {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
            Sign in
        </button>
    );
}
