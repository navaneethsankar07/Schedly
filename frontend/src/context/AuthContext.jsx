import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            setUser({ token });
        }
    }, []);

    const login = async (username, password) => {
        const res = await api.post('login/', { username, password });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        setUser({ token: res.data.access });
        navigate('/dashboard');
    };

    const register = async (email, password) => {
        await api.post('register/', { username: email, email, password });
        await login(email, password);
    };

    const googleLogin = async (token) => {
        const res = await api.post('google-login/', { token });
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        setUser({ token: res.data.access });
        navigate('/dashboard');
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
