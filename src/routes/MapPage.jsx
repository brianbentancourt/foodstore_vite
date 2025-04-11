import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import Map from '../components/map';

export default function MapPage() {
    return (
        <Box sx={{ height: '500px', width: '100%' }}>
            <Map />
        </Box>
    );
}