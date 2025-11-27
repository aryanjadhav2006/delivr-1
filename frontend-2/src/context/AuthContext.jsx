import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        // Mock login for UI demo
        const mockUser = {
            _id: '1',
            name: 'Demo User',
            email: email,
            role: 'customer',
            token: 'mock-jwt-token'
        };

        localStorage.setItem('token', mockUser.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setToken(mockUser.token);
        setUser(mockUser);

        return { success: true, user: mockUser };
    };

    const register = async (userData) => {
        // Mock register for UI demo
        const mockUser = {
            _id: '1',
            name: userData.name,
            email: userData.email,
            role: userData.role,
            token: 'mock-jwt-token'
        };

        localStorage.setItem('token', mockUser.token);
        localStorage.setItem('user', JSON.stringify(mockUser));
        setToken(mockUser.token);
        setUser(mockUser);

        return { success: true, user: mockUser };
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
    };

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token && !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
