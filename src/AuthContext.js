
import { createContext, useState, useContext } from 'react';
const AuthContext = createContext(null); // auth contxt

// THE FOLLOWING CODE IS PROVIDED BY https://reactjs.org/docs/hooks-reference.html#usecontext
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const login = () => setIsLoggedIn(true); //log in function
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export const useAuth = () => {
    return useContext(AuthContext);
};
