import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import OrdersList from '../components/order/OrdersList';

export default function HomePage() {
    return (
        <Container
            maxWidth="100vw" // Ocupa todo el ancho de la ventana
            sx={{
                mt: 0, // Elimina el margen superior predeterminado
                pt: 4, // Puedes agregar un poco de padding superior si lo deseas
                pb: 4, // Puedes agregar un poco de padding inferior si lo deseas
                textAlign: 'center',
                minHeight: '100vh', // Ocupa al menos el 100% de la altura de la ventana
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start', // O 'center' si quieres centrar el contenido verticalmente
                padding: 0, // Elimina el padding predeterminado del Container
            }}
        >
            <OrdersList style={{ width: '100%' }} /> {/* Asegúrate de que OrdersList también ocupe el ancho */}
        </Container>
    );
}