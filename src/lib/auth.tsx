'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    browserLocalPersistence,
    getRedirectResult,
    onAuthStateChanged,
    setPersistence,
    signInWithPopup,
    signInWithRedirect,
    signOut,
    User,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, provider, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    role: string | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    signInWithGoogle: async () => {},
    signOutUser: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        // Keep Firebase auth state across refreshes and recover redirect sign-ins.
        const initAuth = async () => {
            try {
                await setPersistence(auth, browserLocalPersistence);
            } catch (error) {
                console.error('Failed to set auth persistence:', error);
            }

            try {
                const redirectResult = await getRedirectResult(auth);
                if (redirectResult?.user && mounted) {
                    await setDoc(doc(db, 'users', redirectResult.user.uid), {
                        uid: redirectResult.user.uid,
                        email: redirectResult.user.email,
                        displayName: redirectResult.user.displayName,
                        photoURL: redirectResult.user.photoURL,
                        lastLogin: serverTimestamp(),
                        role: redirectResult.user.email === 'absihekdas@gmail.com' ? 'admin' : 'user'
                    }, { merge: true });
                    setUser(redirectResult.user);
                    router.push('/dashboard');
                }
            } catch (error) {
                console.error('Redirect sign-in error:', error);
            }
        };

        void initAuth();

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (!mounted) return;
            setUser(firebaseUser);
            
            if (firebaseUser) {
                // Fetch role from Firestore
                try {
                    const { getDoc, doc } = await import('firebase/firestore');
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists() && mounted) {
                        setRole(userDoc.data().role || 'user');
                    }
                } catch (err) {
                    console.error('Error fetching role:', err);
                }
            } else {
                setRole(null);
            }
            
            setLoading(false);
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, [router]);

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            const signedInUser = result.user;

            if (signedInUser) {
                await setDoc(doc(db, 'users', signedInUser.uid), {
                    uid: signedInUser.uid,
                    email: signedInUser.email,
                    displayName: signedInUser.displayName,
                    photoURL: signedInUser.photoURL,
                    lastLogin: serverTimestamp(),
                    role: signedInUser.email === 'absihekdas@gmail.com' ? 'admin' : 'user'
                }, { merge: true });
                setUser(signedInUser);
                router.push('/dashboard');
            }
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
                    'Firebase unauthorized-domain: add your deployed domain in Firebase Console > Authentication > Settings > Authorized domains.'
                );
            }

            console.error('Google sign-in error:', code, message);
        }
    };

    const signOutUser = async () => {
        try {
            await signOut(auth);
            window.location.assign('/');
        } catch (error) {
            console.error('Sign-out error:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, loading, signInWithGoogle, signOutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
