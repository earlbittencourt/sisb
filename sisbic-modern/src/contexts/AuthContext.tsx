import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserProfile = 'admin' | 'coordinator' | 'advisor' | 'student' | 'comite';

// Define the shape of the user object
export interface User {
    name: string;
    profile: UserProfile;
}

// Define the shape of the context
interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    // Initialize state with a default user object
    const [user, setUser] = useState<User | null>({
        name: 'João Bittencourt',
        profile: 'admin'
    });

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 