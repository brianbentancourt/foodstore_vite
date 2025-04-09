import React from 'react';
import { Outlet } from 'react-router-dom';
import {
    Box,
    Toolbar,
    CssBaseline,
    Typography,
    Link,

} from '@mui/material';
import NavBar from './NavBar';
import packageInfo from '../../package.json';

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

                {/* Footer */}
                <Box
                    component="footer"
                    sx={{
                        py: 2,
                        px: 2,
                        mt: 'auto',
                        borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                        textAlign: 'center',
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        v{packageInfo.version}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Desarrollado por{' '}
                        <Link
                            href="http://brianbentancourt.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            color="inherit"
                            underline="hover"
                        >
                            Brian Bentancourt
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </>
    );
}

export default Layout;