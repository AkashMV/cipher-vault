import React, { createContext, useState, ReactNode } from "react";

// 1. The Data Interface (No children here!)
interface User {
    id: string;
    username: string;
    cloudId: string | null;
    cloudEnabled: boolean;
}

// 2. The Context Interface
interface AuthContextProps {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// 3. The Provider Props Interface (Children go here!)
interface AuthProviderProps {
    children: ReactNode;
}

// Create Context with a cleaner default
const AuthContext = createContext<AuthContextProps>({
    user: null,
    setUser: () => null,
});

// 4. The Component
const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider, AuthContext };