// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    Toolbar,
} from '@mui/material';
import NavBar from './NavBar';

function Layout() {


    return (
        <Box sx={{ display: 'flex', backgroundColor: 'yellow', width: '100%' }}>
            <NavBar /> {/* Componente NavBar que contiene el AppBar y el Drawer */}

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Toolbar /> {/* Espacio para evitar que el contenido se oculte debajo del AppBar fijo */}
                <Outlet /> {/* Aquí se renderizarán los componentes de las rutas hijas */}
            </Box>
        </Box>
    );
}

export default Layout;