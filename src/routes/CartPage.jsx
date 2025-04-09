import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Button,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Slider,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Card,
    CardContent,
    Radio,
    RadioGroup,
    FormControlLabel,
    Chip,
    InputAdornment,
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    Home as HomeIcon,
    Payment as PaymentIcon,
    ShoppingCart as CartIcon,
    LocalShipping as ShippingIcon,
    CreditCard as CreditCardIcon,
    AccountBalanceWallet as WalletIcon,
    Phone as PhoneIcon,
    ShoppingBasket as ShoppingIcon,
} from '@mui/icons-material';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Componente de la página de carrito
function CarritoPage() {
    const navigate = useNavigate();
    const auth = getAuth();

    // Estados para manejar los datos
    const [cartItems, setCartItems] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [pointsAvailable, setPointsAvailable] = useState(0);
    const [pointsToUse, setPointsToUse] = useState(0);
    const [newAddressDialog, setNewAddressDialog] = useState(false);
    const [newAddress, setNewAddress] = useState({
        street: '',
        number: '',
        city: '',
        zipCode: '',
        reference: ''
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [shipping, setShipping] = useState(0);

    // Efecto para cargar datos iniciales
    useEffect(() => {
        // Aquí cargarías los productos del carrito desde tu estado global o API
        fetchCartItems();

        // Cargar direcciones del usuario
        fetchUserAddresses();

        // Cargar puntos disponibles
        fetchUserPoints();

        // Obtener número de teléfono desde Firebase Auth
        if (auth.currentUser) {
            setPhoneNumber(auth.currentUser.phoneNumber || '');
        }
    }, [auth.currentUser]);

    // Efecto para calcular totales
    useEffect(() => {
        calculateTotals();
    }, [cartItems, pointsToUse]);

    // Funciones simuladas para obtener datos
    const fetchCartItems = () => {
        // Simulación de productos en el carrito
        setCartItems([
            { id: 1, name: 'Smartphone XYZ', price: 399.99, quantity: 1, image: 'smartphone.jpg' },
            { id: 2, name: 'Auriculares Bluetooth', price: 59.90, quantity: 2, image: 'headphones.jpg' },
            { id: 3, name: 'Cargador Rápido', price: 29.99, quantity: 1, image: 'charger.jpg' },
        ]);
    };

    const fetchUserAddresses = () => {
        // Simulación de direcciones guardadas
        setAddresses([
            { id: 1, street: 'Av. Corrientes', number: '1234', city: 'Buenos Aires', zipCode: '1414', reference: 'Cerca del teatro' },
            { id: 2, street: 'Av. Santa Fe', number: '4321', city: 'Buenos Aires', zipCode: '1425', reference: 'Entrada por el garaje' },
        ]);

        // Seleccionar la primera dirección por defecto
        if (addresses.length > 0) {
            setSelectedAddress(1);
        }
    };

    const fetchUserPoints = () => {
        // Simulación de puntos disponibles
        setPointsAvailable(5000);
    };

    const calculateTotals = () => {
        // Calcular subtotal
        const itemsSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        setSubtotal(itemsSubtotal);

        // Calcular envío (ejemplo: gratis si supera cierto monto)
        const shippingCost = itemsSubtotal > 100 ? 0 : 10;
        setShipping(shippingCost);

        // Calcular descuento por puntos (1 punto = 0.01 unidad monetaria)
        const pointsDiscount = pointsToUse * 0.01;

        // Calcular total final
        setTotal(itemsSubtotal + shippingCost - pointsDiscount);
    };

    // Manejadores de eventos
    const handleQuantityChange = (id, change) => {
        setCartItems(prevItems => prevItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + change);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleRemoveItem = (id) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleAddressChange = (event) => {
        setSelectedAddress(event.target.value);
    };

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handlePointsChange = (event, newValue) => {
        setPointsToUse(newValue);
    };

    const handleNewAddressOpen = () => {
        setNewAddressDialog(true);
    };

    const handleNewAddressClose = () => {
        setNewAddressDialog(false);
    };

    const handleNewAddressChange = (prop) => (event) => {
        setNewAddress({ ...newAddress, [prop]: event.target.value });
    };

    const handleAddNewAddress = () => {
        // Aquí guardarías la nueva dirección en tu backend
        const newId = addresses.length + 1;
        const addressToAdd = { id: newId, ...newAddress };

        setAddresses([...addresses, addressToAdd]);
        setSelectedAddress(newId);
        setNewAddress({
            street: '',
            number: '',
            city: '',
            zipCode: '',
            reference: ''
        });
        setNewAddressDialog(false);
    };

    const handleCheckout = () => {
        // Lógica para procesar el pago
        console.log('Procesando compra...');
        console.log('Dirección seleccionada:', addresses.find(addr => addr.id === selectedAddress));
        console.log('Método de pago:', selectedPaymentMethod);
        console.log('Puntos utilizados:', pointsToUse);
        console.log('Total a pagar:', total);

        // Aquí redirigirías a la página de confirmación o integrarías con un gateway de pago
        // navigate('/confirmacion-pedido');
    };

    const handlePhoneChange = (event) => {
        setPhoneNumber(event.target.value);
        // Aquí podrías actualizar el teléfono en Firebase Auth si lo necesitas
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <CartIcon sx={{ mr: 1 }} /> Mi Carrito
            </Typography>

            <Grid container spacing={3}>
                {/* Columna izquierda - Productos */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <CartIcon sx={{ mr: 1, fontSize: 20 }} /> Productos Seleccionados
                        </Typography>

                        {cartItems.length === 0 ? (
                            <Typography variant="body1" sx={{ my: 4, textAlign: 'center' }}>
                                El carrito está vacío
                            </Typography>
                        ) : (
                            <List>
                                {cartItems.map((item, index) => (
                                    <React.Fragment key={item.id}>
                                        <ListItem alignItems="flex-start">
                                            <Box
                                                component="img"
                                                src={`/api/placeholder/60/60`}
                                                alt={item.name}
                                                sx={{ width: 60, height: 60, mr: 2, objectFit: 'cover', borderRadius: 1 }}
                                            />
                                            <Box sx={{ flex: 1 }}>
                                                <ListItemText
                                                    primary={item.name}
                                                    secondary={`Precio unitario: $${item.price.toFixed(2)}`}
                                                />
                                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                    <IconButton size="small" onClick={() => handleQuantityChange(item.id, -1)}>
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <Typography sx={{ mx: 1 }}>{item.quantity}</Typography>
                                                    <IconButton size="small" onClick={() => handleQuantityChange(item.id, 1)}>
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                    <Box sx={{ flex: 1 }} />
                                                    <Typography sx={{ fontWeight: 'bold', mr: 2 }}>
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </Typography>
                                                    <IconButton color="error" size="small" onClick={() => handleRemoveItem(item.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </ListItem>
                                        {index < cartItems.length - 1 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </Paper>

                    {/* Dirección de entrega */}
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <HomeIcon sx={{ mr: 1, fontSize: 20 }} /> Dirección de Entrega
                        </Typography>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel id="address-select-label">Selecciona una dirección</InputLabel>
                            <Select
                                labelId="address-select-label"
                                id="address-select"
                                value={selectedAddress}
                                label="Selecciona una dirección"
                                onChange={handleAddressChange}
                            >
                                {addresses.map((address) => (
                                    <MenuItem key={address.id} value={address.id}>
                                        {address.street} {address.number}, {address.city} ({address.zipCode})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleNewAddressOpen}
                            fullWidth
                        >
                            Agregar Nueva Dirección
                        </Button>
                    </Paper>

                    {/* Número de teléfono */}
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ mr: 1, fontSize: 20 }} /> Número de Contacto
                        </Typography>

                        <TextField
                            fullWidth
                            label="Número de teléfono"
                            value={phoneNumber}
                            onChange={handlePhoneChange}
                            placeholder="+54 9 11 xxxx xxxx"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PhoneIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Paper>
                </Grid>

                {/* Columna derecha - Resumen y pagos */}
                <Grid item xs={12} md={4}>
                    {/* Métodos de pago */}
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <PaymentIcon sx={{ mr: 1, fontSize: 20 }} /> Método de Pago
                        </Typography>

                        <FormControl component="fieldset" fullWidth>
                            <RadioGroup
                                value={selectedPaymentMethod}
                                onChange={handlePaymentMethodChange}
                            >
                                <FormControlLabel
                                    value="creditCard"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CreditCardIcon sx={{ mr: 1 }} />
                                            <Typography>Tarjeta de Crédito</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="debitCard"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <CreditCardIcon sx={{ mr: 1 }} />
                                            <Typography>Tarjeta de Débito</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="mercadoPago"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <WalletIcon sx={{ mr: 1 }} />
                                            <Typography>MercadoPago</Typography>
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="cash"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <WalletIcon sx={{ mr: 1 }} />
                                            <Typography>Efectivo al recibir</Typography>
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>
                    </Paper>

                    {/* Uso de puntos */}
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <WalletIcon sx={{ mr: 1, fontSize: 20 }} /> Mis Puntos
                        </Typography>

                        <Box sx={{ px: 1, mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">Puntos Disponibles:</Typography>
                                <Typography variant="body2" fontWeight="bold">{pointsAvailable}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2">Puntos a Utilizar:</Typography>
                                <Typography variant="body2" fontWeight="bold">{pointsToUse}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">Descuento:</Typography>
                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                    ${(pointsToUse * 0.01).toFixed(2)}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography gutterBottom>Selecciona cuántos puntos deseas utilizar:</Typography>
                        <Box sx={{ px: 2 }}>
                            <Slider
                                value={pointsToUse}
                                onChange={handlePointsChange}
                                aria-labelledby="puntos-slider"
                                min={0}
                                max={Math.min(pointsAvailable, subtotal * 100)} // Asegurarse de que no supere el total
                                valueLabelDisplay="auto"
                            />
                        </Box>
                    </Paper>

                    {/* Resumen de compra */}
                    <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                            <ShoppingIcon sx={{ mr: 1, fontSize: 20 }} /> Resumen de Compra
                        </Typography>

                        <Box sx={{ p: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Subtotal:</Typography>
                                <Typography>${subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Envío:</Typography>
                                <Typography>
                                    {shipping === 0 ? (
                                        <Chip size="small" label="Gratis" color="success" />
                                    ) : (
                                        `$${shipping.toFixed(2)}`
                                    )}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography>Descuento por puntos:</Typography>
                                <Typography color="success.main">-${(pointsToUse * 0.01).toFixed(2)}</Typography>
                            </Box>
                            <Divider sx={{ my: 1.5 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" fontWeight="bold">${total.toFixed(2)}</Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{ mt: 2 }}
                                onClick={handleCheckout}
                                disabled={!selectedPaymentMethod || !selectedAddress || cartItems.length === 0}
                            >
                                Finalizar Compra
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Diálogo para agregar nueva dirección */}
            <Dialog open={newAddressDialog} onClose={handleNewAddressClose} fullWidth>
                <DialogTitle>Agregar Nueva Dirección</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Calle"
                        fullWidth
                        variant="outlined"
                        value={newAddress.street}
                        onChange={handleNewAddressChange('street')}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Número"
                        fullWidth
                        variant="outlined"
                        value={newAddress.number}
                        onChange={handleNewAddressChange('number')}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Ciudad"
                        fullWidth
                        variant="outlined"
                        value={newAddress.city}
                        onChange={handleNewAddressChange('city')}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Código Postal"
                        fullWidth
                        variant="outlined"
                        value={newAddress.zipCode}
                        onChange={handleNewAddressChange('zipCode')}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Referencia (opcional)"
                        fullWidth
                        variant="outlined"
                        value={newAddress.reference}
                        onChange={handleNewAddressChange('reference')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleNewAddressClose}>Cancelar</Button>
                    <Button
                        onClick={handleAddNewAddress}
                        variant="contained"
                        disabled={!newAddress.street || !newAddress.number || !newAddress.city || !newAddress.zipCode}
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default CarritoPage;