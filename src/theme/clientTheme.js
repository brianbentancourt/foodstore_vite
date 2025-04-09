// src/theme/clientTheme.js
import { createTheme } from '@mui/material/styles';

// Aquí defines una constante con el ID del cliente para esta compilación específica
// Puedes cambiar este valor antes de compilar para cada cliente
export const CLIENT_ID = import.meta.env.VITE_REACT_APP_CLIENT_ID || 'foodstore';

// Configuración de temas para diferentes clientes
const themes = {
    // Restaurante A (por ejemplo, colores rojo y amarillo para un restaurante de comida rápida)
    foodstore: {
        primary: {
            main: '#d32f2f', // Rojo
            light: '#ef5350',
            dark: '#b71c1c',
            contrastText: '#fff',
        },
        secondary: {
            main: '#ffc107', // Amarillo
            light: '#ffeb3b',
            dark: '#ff8f00',
            contrastText: '#000',
        },
        background: {
            default: '#fffbfb', // Tono crema suave
            paper: '#ffffff',
        },
        logoPath: '/logos/restauranteA-logo.png',
        appName: 'Food Store'
    },

    // Restaurante B (por ejemplo, colores verde y marrón para un restaurante orgánico)
    restauranteB: {
        primary: {
            main: '#2e7d32', // Verde
            light: '#4caf50',
            dark: '#1b5e20',
            contrastText: '#fff',
        },
        secondary: {
            main: '#795548', // Marrón
            light: '#a1887f',
            dark: '#4e342e',
            contrastText: '#fff',
        },
        background: {
            default: '#f1f8e9', // Verde muy claro
            paper: '#ffffff',
        },
        logoPath: '/logos/restauranteB-logo.png',
        appName: 'Restaurante B'
    },

    // Añade más restaurantes según sea necesario
};

// Si el cliente especificado no existe, usa un tema predeterminado
const clientTheme = themes[CLIENT_ID] || {
    primary: {
        main: '#1976d2', // Azul predeterminado
        light: '#42a5f5',
        dark: '#1565c0',
        contrastText: '#fff',
    },
    secondary: {
        main: '#f50057', // Rosa
        light: '#ff4081',
        dark: '#c51162',
        contrastText: '#fff',
    },
    background: {
        default: '#f5f5f5',
        paper: '#ffffff',
    },
    logoPath: '/logos/default-logo.png',
    appName: 'Mi Aplicación'
};

// Crear y exportar el tema
export const theme = createTheme({
    palette: {
        primary: clientTheme.primary,
        secondary: clientTheme.secondary,
        background: clientTheme.background,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none', // Evita que el texto esté en mayúsculas
                    '&:focus': {
                        outline: 'none', // Quita el borde negro al hacer clic
                    },
                },
                contained: {
                    '&:hover': {
                        backgroundColor: clientTheme.primary.dark, // Mantiene el color oscuro al hacer hover
                        color: clientTheme.primary.contrastText, // Mantiene el color del texto
                    },
                },
                outlined: {
                    '&:hover': {
                        borderColor: clientTheme.primary.dark, // Mantiene el borde en hover
                        color: clientTheme.primary.main, // Mantiene el color del texto
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: 'transparent', // Evita que se sombreé el fondo
                        color: clientTheme.primary.main, // Mantiene el color del texto
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:focus': {
                        outline: 'none', // Quita el borde negro al hacer clic
                    },
                    '&:hover': {
                        backgroundColor: `rgba(${parseInt(clientTheme.primary.main.slice(1, 3), 16)}, 
                                        ${parseInt(clientTheme.primary.main.slice(3, 5), 16)}, 
                                        ${parseInt(clientTheme.primary.main.slice(5, 7), 16)}, 0.2)`,
                        color: 'inherit', // Mantiene el color original del icono
                    },
                },
            },
        },

    },
});

// Exportar otros datos específicos del cliente
export const clientAppName = clientTheme.appName;
export const clientLogoPath = clientTheme.logoPath;
export default theme;