
import { createContext, useState, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext(null);

// Provide the AuthContext to children components
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize login state

    const login = () => setIsLoggedIn(true); // Function to log in
    const logout = () => setIsLoggedIn(false); // Function to log out

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext in other components
export const useAuth = () => {
    return useContext(AuthContext);
};
