'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signInWithRedirect, signOut, User } from 'firebase/auth';
import { auth, provider } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    signInWithGoogle: async () => {},
    signOutUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
        } catch (error: unknown) {
            const err = error as { code?: string; message?: string };
            const code = err.code ?? 'unknown';
            const message = err.message ?? 'Unknown Firebase auth error';

            // Popup-based auth commonly fails in some browser/privacy setups.
            // Fallback to redirect flow to improve reliability.
            const shouldFallbackToRedirect = [
                'auth/popup-blocked',
                'auth/popup-closed-by-user',
                'auth/cancelled-popup-request',
                'auth/operation-not-supported-in-this-environment',
            ].includes(code);

            if (shouldFallbackToRedirect) {
                console.warn('Google popup sign-in failed, retrying with redirect:', code);
                await signInWithRedirect(auth, provider);
                return;
            }

            if (code === 'auth/unauthorized-domain') {
                console.error(
                    'Firebase unauthorized-domain: add your app domain (for local dev, localhost) in Firebase Console > Authentication > Settings > Authorized domains.'
                );
            }

            console.error('Google sign-in error:', code, message);
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
