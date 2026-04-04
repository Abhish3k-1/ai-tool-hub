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
            <button disabled className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
            </button>
        );
    }

    return user ? (
        <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-xl border border-slate-200/70 bg-white/90 px-2 py-1.5 sm:flex">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Avatar" className="h-8 w-8 rounded-full border border-slate-200 object-cover" />
                ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-100 text-sm font-bold text-sky-700">
                        {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                )}
                <span className="max-w-[120px] truncate text-sm font-semibold text-slate-700">
                    {user.displayName || 'User'}
                </span>
            </div>
            <button
                onClick={handleSignOut}
                disabled={isAuthenticating}
                className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition-all hover:-translate-y-0.5 hover:bg-rose-100"
            >
                {isAuthenticating ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                <span className="hidden sm:inline">Sign Out</span>
            </button>
        </div>
    ) : (
        <button
            onClick={handleSignIn}
            disabled={isAuthenticating}
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-5 py-2.5 font-semibold text-white shadow-[0_8px_24px_rgba(3,105,161,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(3,105,161,0.45)]"
        >
            {isAuthenticating ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
            Sign in
        </button>
    );
}

