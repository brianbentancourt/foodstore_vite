// src/context/ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createClientTheme } from '../themes/themeConfig';

// Crear contexto
const ThemeContext = createContext();

// Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    // Estado para almacenar el ID del cliente actual
    const [clientId, setClientId] = useState('default');

    // Crear el tema basado en el ID del cliente
    const [theme, setTheme] = useState(createClientTheme(clientId));

    // Actualizar el tema cuando cambia el ID del cliente
    useEffect(() => {
        setTheme(createClientTheme(clientId));
    }, [clientId]);

    // Función para cambiar el tema del cliente
    const changeClientTheme = (newClientId) => {
        setClientId(newClientId);
        // Opcional: guardar preferencia en localStorage
        localStorage.setItem('clientTheme', newClientId);
    };

    // Al cargar, intentar recuperar el tema del cliente desde localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem('clientTheme');
        if (savedTheme) {
            setClientId(savedTheme);
        }
    }, []);

    return (
        <ThemeContext.Provider value={{ clientId, changeClientTheme }}>
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
};