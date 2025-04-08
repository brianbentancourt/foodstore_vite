import React from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    Toolbar,
    CssBaseline,
} from '@mui/material';
import NavBar from './NavBar';

function Layout() {
    return (
        <>
            <CssBaseline /> {/* Reset de CSS para eliminar márgenes y paddings predeterminados */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100vw', // Usa viewport width en lugar de porcentaje
                    minHeight: '100vh',
                    margin: 0,
                    padding: 0,
                    boxSizing: 'border-box', // Asegura que padding y border estén incluidos en el ancho
                    overflow: 'hidden', // Previene scroll horizontal
                    maxWidth: '100%'
                }}
            >
                <NavBar /> {/* Componente NavBar */}

                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: '100%',
                        maxWidth: '100%',
                    }}
                >
                    <Toolbar /> {/* Espacio para el AppBar */}
                    <Outlet /> {/* Componentes de rutas hijas */}
                </Box>
            </Box>
        </>
    );
}

export default Layout;