import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function AboutPage() {
    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Acerca de Nosotros
            </Typography>
            <Typography variant="body1" paragraph>
                Esta es una página de ejemplo creada con React, Vite y Material UI v7.
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
                Puedes agregar aquí información sobre tu aplicación o tu equipo.
            </Typography>
            <Box mt={2}>
                <Button variant="outlined" color="primary" component={Link} to="/">
                    Volver a Inicio
                </Button>
            </Box>
        </Container>
    );
}