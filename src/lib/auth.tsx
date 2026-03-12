'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: any | null;
    loading: boolean;
    mockSignIn?: () => void;
    mockSignOut?: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: false });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    // Expose mock methods to simulate authentication
    const mockSignIn = () => {
        setUser({ displayName: 'Guest User', email: 'guest@example.com', photoURL: '' });
    };

    const mockSignOut = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, mockSignIn, mockSignOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
