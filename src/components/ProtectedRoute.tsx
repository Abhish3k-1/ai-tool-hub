'use client';

import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/Toast';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const { showToast } = useToast();
    const router = useRouter();
    const pathname = usePathname();
    const hasNotifiedRef = useRef(false);

    useEffect(() => {
        if (!loading && !user && pathname !== '/') {
            if (!hasNotifiedRef.current) {
                showToast('Please sign in first to continue.', 'warning');
                hasNotifiedRef.current = true;
            }
            router.push('/');
        }
    }, [user, loading, pathname, router, showToast]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return user ? <>{children}</> : null;
}
