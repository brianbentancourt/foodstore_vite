import React from 'react';
import { useRouteError } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    return (
        <Container maxWidth="md" sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                ¡Oops! Algo salió mal.
            </Typography>
            <Typography variant="body1" color="error" paragraph>
                {error.statusText || error.message}
            </Typography>
            <Box mt={2}>
                <Button variant="contained" color="primary" component={Link} to="/">
                    Volver a la página principal
                </Button>
            </Box>
        </Container>
    );
}