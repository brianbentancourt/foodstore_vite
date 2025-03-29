import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainContent from '../components/MainContent'; // Asegúrate de que la ruta sea correcta

export default function HomePage() {
    const navigate = useNavigate();

    const handleAboutClick = () => {
        navigate('/about');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom>
                Página de Inicio
            </Typography>
            <Typography variant="body1" paragraph>
                Bienvenido a la página de inicio de tu aplicación con MUI v7 y Vite.
            </Typography>
            <Box mt={2}>
                <Button variant="contained" color="secondary" onClick={handleAboutClick}>
                    Ir a la página "Acerca de"
                </Button>
            </Box>
            <MainContent />
        </Container>
    );
}