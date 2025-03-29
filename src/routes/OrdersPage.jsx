import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import OrdersList from '../components/order/OrdersList';

export default function HomePage() {


    return (
        <Container maxWidth="sm" sx={{ mt: 4, textAlign: 'center' }}>
            <OrdersList />
        </Container>
    );
}