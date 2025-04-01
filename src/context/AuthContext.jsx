// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase/firebaseConfig';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userPoints, setUserPoints] = useState(0);

    // Función para iniciar sesión con Google
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            // Aquí podrías hacer una llamada a tu backend para obtener los puntos del usuario
            // Por ahora usamos un valor de ejemplo
            setUserPoints(5555);
            return result;
        } catch (error) {
            console.error("Error al iniciar sesión con Google:", error);
            throw error;
        }
    };

    // Función para cerrar sesión
    const logout = async () => {
        try {
            await signOut(auth);
            setUserPoints(0);
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
            throw error;
        }
    };

    // Efecto para escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                // Aquí podrías hacer una llamada a tu API para obtener los puntos del usuario
                setUserPoints(5555); // Valor de ejemplo
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Valores que proporcionará el contexto
    const value = {
        currentUser,
        userPoints,
        signInWithGoogle,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};