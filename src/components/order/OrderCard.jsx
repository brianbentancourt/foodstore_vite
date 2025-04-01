import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    FormControl,
    Select,
    MenuItem,
    Grid,
    Button,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import HistoryIcon from '@mui/icons-material/History';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import HomeIcon from '@mui/icons-material/Home';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import NumbersIcon from '@mui/icons-material/Numbers';
import dayjs from 'dayjs'

// Mapeo de estados a colores
const stateColors = {
    'pending': '#FFA726',     // Orange
    'in_progress': '#29B6F6', // Light Blue
    'ready': '#66BB6A',       // Green
    'delivered': '#8BC34A',   // Light Green
    'cancelled': '#EF5350'    // Red
};

const stateLabels = {
    'pending': 'Pendiente',
    'in_progress': 'En preparación',
    'ready': 'Listo para entrega',
    'delivered': 'Entregado',
    'cancelled': 'Cancelado'
};

const OrderCard = ({ order, onEditOrder, onPrintOrder, onViewHistory, onUpdateState }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Estado local para manejar el cambio en el select
    const [orderState, setOrderState] = useState(order.orderState);

    const handleStateChange = (event) => {
        const newState = event.target.value;
        setOrderState(newState);
        onUpdateState(order.id, newState);
    };

    return (
        <Card
            elevation={3}
            sx={{
                mb: 2,
                position: 'relative',
                borderLeft: `5px solid ${stateColors[orderState] || '#757575'}`,
                transition: 'all 0.3s ease'
            }}
        >
            <CardContent>
                <Grid container spacing={2}>
                    {/* Primera fila: Información básica */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: isMobile ? 1 : 0 }}>
                                <NumbersIcon fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="subtitle1" fontWeight="bold" sx={{ mr: 2 }}>
                                    {order.cod}
                                </Typography>

                                <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    {dayjs(order.date?.toDate()).fromNow()}
                                </Typography>
                            </Box>

                            <Box>
                                <FormControl size="small" variant="outlined" sx={{ minWidth: 140 }}>
                                    <Select
                                        value={orderState}
                                        onChange={handleStateChange}
                                        sx={{
                                            height: 32,
                                            backgroundColor: stateColors[orderState] || '#757575',
                                            color: 'white',
                                            '& .MuiSelect-icon': { color: 'white' },
                                            '&:hover': { backgroundColor: stateColors[orderState] || '#757575' }
                                        }}
                                    >
                                        {Object.entries(stateLabels).map(([value, label]) => (
                                            <MenuItem key={value} value={value}>{label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Segunda fila: Datos del cliente y ubicación */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <PersonIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Typography variant="body1">{order.clientName}</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            {order.tableId ? (
                                <>
                                    <LocalDiningIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                    <Typography variant="body2">Mesa #{order.tableId}</Typography>
                                </>
                            ) : (
                                <>
                                    <HomeIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                                    <Typography variant="body2" sx={{
                                        maxWidth: '400px',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {order.address}
                                    </Typography>
                                </>
                            )}
                        </Box>
                    </Grid>

                    {/* Tercera fila: Monto y método de pago */}
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AttachMoneyIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Typography variant="h6" color="primary" fontWeight="bold">
                                ${order.amount.toFixed(2)}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CreditCardIcon fontSize="small" sx={{ mr: 1, color: theme.palette.text.secondary }} />
                            <Chip
                                label={order.paymentMethod}
                                size="small"
                                variant="outlined"
                                sx={{ borderRadius: '4px' }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider sx={{ my: 1 }} />
                    </Grid>

                    {/* Cuarta fila: Botones de acción */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                            <Button
                                startIcon={<EditIcon />}
                                size="small"
                                variant="outlined"
                                onClick={() => onEditOrder(order.id)}
                            >
                                {isMobile ? '' : 'Editar'}
                            </Button>

                            <Button
                                startIcon={<PrintIcon />}
                                size="small"
                                variant="outlined"
                                onClick={() => onPrintOrder(order.id)}
                            >
                                {isMobile ? '' : 'Imprimir'}
                            </Button>

                            <Button
                                startIcon={<HistoryIcon />}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                onClick={() => onViewHistory(order.id)}
                            >
                                {isMobile ? '' : 'Historial'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default OrderCard;