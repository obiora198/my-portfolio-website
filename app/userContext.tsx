'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TokenContextProps {
    user: {
        name: string | null,
        token: string | null
    };
    setUser: (user: { name: string | null, token: string | null }) => void; // Removed `null` here
}

const defaultUser = { // Define a default user object
    name: null,
    token: null
};

const UserContext = createContext<TokenContextProps>({
    user: defaultUser, // Use the default user object
    setUser: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<TokenContextProps['user']>(defaultUser); // Remove `| null` here

    return (
        <UserContext.Provider value={{ user: user, setUser: setUser }}>
            {children}
        </UserContext.Provider>
    );
};
