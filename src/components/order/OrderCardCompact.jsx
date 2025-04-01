// src/components/order/OrdersList.jsx
import React, { useState, useEffect, useMemo, useTransition, useCallback, Suspense, lazy } from 'react';
import {
    Container,
    Typography,
    Box,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    Skeleton,
    IconButton,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import MapIcon from '@mui/icons-material/Map';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import { stateLabels } from '../../constants';



// Función para obtener color según estado
const getStatusColor = (status) => {
    switch (status) {
        case stateLabels.firstClientState: return '#FFA000'; // Amber
        case stateLabels.lastState: return '#4CAF50'; // Green
        case stateLabels.canceledState: return '#F44336'; // Red
        case stateLabels.delayState: return '#FF9800'; // Orange
        default: return '#757575'; // Grey
    }
};


// Versión compacta del OrderCard para la vista en cuadrícula
const CompactOrderCard = React.memo(({ order, onEditOrder, onPrintOrder, onViewHistory, onUpdateState }) => {
    return (
        <Paper
            sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderLeft: 6,
                borderColor: getStatusColor(order.orderState),
                '&:hover': {
                    boxShadow: (theme) => theme.shadows[8]
                },
                transition: 'box-shadow 0.3s ease-in-out'
            }}
        >
            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" noWrap>
                    #{order.cod}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        fontWeight: 'bold',
                        color: getStatusColor(order.orderState)
                    }}
                >
                    {order.orderState}
                </Typography>
            </Box>

            <Box sx={{ mb: 1 }}>
                <Typography variant="body2" noWrap>
                    <strong>Cliente:</strong> {order.clientName || 'Sin nombre'}
                </Typography>
                <Typography variant="body2" noWrap>
                    <strong>Dirección:</strong> {order.address || 'Sin dirección'}
                </Typography>
                {order.amount && (
                    <Typography variant="body2">
                        <strong>Total:</strong> ${order.amount.toFixed(2)}
                    </Typography>
                )}
            </Box>

            <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'space-between', pt: 1 }}>
                <Select
                    size="small"
                    value={order.orderState || stateLabels.firstClientState}
                    onChange={(e) => onUpdateState(order.id, e.target.value)}
                    sx={{ minWidth: 120, fontSize: '0.75rem' }}
                >
                    {Object.entries(stateLabels)
                        .filter(([key]) => key !== 'all')
                        .map(([value, label]) => (
                            <MenuItem key={value} value={label}>
                                {label}
                            </MenuItem>
                        ))
                    }
                </Select>

                <Box>
                    <IconButton size="small" onClick={() => onEditOrder(order.id)}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => onPrintOrder(order.id)}>
                        <PrintIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Paper>
    );
});

export default CompactOrderCard;
