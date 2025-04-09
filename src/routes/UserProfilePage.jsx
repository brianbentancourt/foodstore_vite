import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    Avatar,
    Button,
    TextField,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Tabs,
    Tab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    Badge,
    Chip,
    Stack,
    CircularProgress,
    Card,
    CardContent,
    CardHeader,
    Backdrop
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Cancel as CancelIcon,
    Delete as DeleteIcon,
    Person as PersonIcon,
    ShoppingBag as ShoppingBagIcon,
    Home as HomeIcon,
    Add as AddIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Favorite as FavoriteIcon,
    LocationOn as LocationOnIcon,
    LocalShipping as ShippingIcon,
    PhotoCamera as PhotoCameraIcon,
    Star as StarIcon,
    Notifications as NotificationsIcon,
    History as HistoryIcon,
    Security as SecurityIcon,
    Settings as SettingsIcon,
    Loyalty as LoyaltyIcon
} from '@mui/icons-material';
import { getAuth, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import dayjs from 'dayjs';

function ProfilePage() {
    const auth = getAuth();
    const [value, setValue] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [dialogType, setDialogType] = useState('');
    const [newAddress, setNewAddress] = useState({
        street: '',
        number: '',
        city: '',
        zipCode: '',
        reference: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Datos del usuario
    const [userData, setUserData] = useState({
        displayName: '',
        email: '',
        phoneNumber: '',
        photoURL: '',
        addresses: [],
        orders: [],
        favoriteProducts: [],
        points: 0,
        notifications: []
    });

    // Datos editables
    const [editableData, setEditableData] = useState({
        displayName: '',
        email: '',
        phoneNumber: ''
    });

    useEffect(() => {
        // Cargar datos del usuario desde Firebase Auth
        if (auth.currentUser) {
            const user = auth.currentUser;

            setEditableData({
                displayName: user.displayName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || ''
            });

            // Simular carga de datos adicionales del usuario
            // En una app real, obtendrías estos datos de tu backend
            fetchUserData(user.uid);
        }
    }, [auth.currentUser]);

    const fetchUserData = (userId) => {
        setLoading(true);

        // Simulación de una llamada a API
        setTimeout(() => {
            setUserData({
                displayName: auth.currentUser?.displayName || 'Usuario',
                email: auth.currentUser?.email || 'usuario@ejemplo.com',
                phoneNumber: auth.currentUser?.phoneNumber || '+54 9 11 1234 5678',
                photoURL: auth.currentUser?.photoURL || null,
                addresses: [
                    { id: 1, street: 'Av. Corrientes', number: '1234', city: 'Buenos Aires', zipCode: '1414', reference: 'Cerca del teatro', isDefault: true },
                    { id: 2, street: 'Av. Santa Fe', number: '4321', city: 'Buenos Aires', zipCode: '1425', reference: 'Entrada por el garaje' },
                ],
                orders: [
                    { id: 'ORD-001', date: '2025-04-02', status: 'Entregado', total: 149.99, items: 3 },
                    { id: 'ORD-002', date: '2025-03-15', status: 'En proceso', total: 89.90, items: 1 },
                    { id: 'ORD-003', date: '2025-02-28', status: 'Cancelado', total: 56.50, items: 2 },
                ],
                favoriteProducts: [
                    { id: 1, name: 'Smartphone XYZ', price: 399.99, image: 'smartphone.jpg' },
                    { id: 2, name: 'Auriculares Bluetooth', price: 59.90, image: 'headphones.jpg' },
                ],
                points: 5000,
                notifications: [
                    { id: 1, message: 'Tu pedido ORD-001 ha sido entregado', date: '2025-04-02', read: false },
                    { id: 2, message: 'Tienes un cupón de descuento disponible', date: '2025-03-30', read: true },
                    { id: 3, message: 'Oferta especial en auriculares', date: '2025-03-25', read: true },
                ]
            });
            setLoading(false);
        }, 1000);
    };

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancelar edición, restaurar datos originales
            setEditableData({
                displayName: userData.displayName,
                email: userData.email,
                phoneNumber: userData.phoneNumber
            });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (field) => (event) => {
        setEditableData({
            ...editableData,
            [field]: event.target.value
        });
    };

    const handleSaveProfile = async () => {
        setLoading(true);

        try {
            const user = auth.currentUser;
            if (user) {
                // Actualizar nombre de usuario
                if (editableData.displayName !== userData.displayName) {
                    await updateProfile(user, {
                        displayName: editableData.displayName
                    });
                }

                // Actualizar email (requiere reautenticación en producción)
                if (editableData.email !== userData.email) {
                    await updateEmail(user, editableData.email);
                }

                // En una app real actualizarías también phoneNumber y otros datos en tu backend

                // Actualizar estado local
                setUserData({
                    ...userData,
                    displayName: editableData.displayName,
                    email: editableData.email,
                    phoneNumber: editableData.phoneNumber
                });

                setSnackbar({
                    open: true,
                    message: 'Perfil actualizado correctamente',
                    severity: 'success'
                });

                setIsEditing(false);
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            setSnackbar({
                open: true,
                message: 'Error al actualizar perfil: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDialogOpen = (type) => {
        setDialogType(type);
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
        setNewAddress({
            street: '',
            number: '',
            city: '',
            zipCode: '',
            reference: ''
        });
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    const handleAddressChange = (prop) => (event) => {
        setNewAddress({ ...newAddress, [prop]: event.target.value });
    };

    const handlePasswordChange = (prop) => (event) => {
        setPasswordData({ ...passwordData, [prop]: event.target.value });
    };

    const handleAddAddress = () => {
        // Aquí guardarías la dirección en tu backend
        const newId = userData.addresses.length + 1;
        const addressToAdd = { id: newId, ...newAddress, isDefault: false };

        setUserData({
            ...userData,
            addresses: [...userData.addresses, addressToAdd]
        });

        setSnackbar({
            open: true,
            message: 'Dirección agregada correctamente',
            severity: 'success'
        });

        handleDialogClose();
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setSnackbar({
                open: true,
                message: 'Las contraseñas no coinciden',
                severity: 'error'
            });
            return;
        }

        setLoading(true);

        try {
            const user = auth.currentUser;
            if (user) {
                // En una app real, necesitarías reautenticar al usuario antes de actualizar la contraseña
                await updatePassword(user, passwordData.newPassword);

                setSnackbar({
                    open: true,
                    message: 'Contraseña actualizada correctamente',
                    severity: 'success'
                });

                handleDialogClose();
            }
        } catch (error) {
            console.error('Error al actualizar contraseña:', error);
            setSnackbar({
                open: true,
                message: 'Error al actualizar contraseña: ' + error.message,
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSetDefaultAddress = (addressId) => {
        setUserData({
            ...userData,
            addresses: userData.addresses.map(addr => ({
                ...addr,
                isDefault: addr.id === addressId
            }))
        });

        setSnackbar({
            open: true,
            message: 'Dirección predeterminada actualizada',
            severity: 'success'
        });
    };

    const handleDeleteAddress = (addressId) => {
        setUserData({
            ...userData,
            addresses: userData.addresses.filter(addr => addr.id !== addressId)
        });

        setSnackbar({
            open: true,
            message: 'Dirección eliminada correctamente',
            severity: 'success'
        });
    };

    const handleRemoveFavorite = (productId) => {
        setUserData({
            ...userData,
            favoriteProducts: userData.favoriteProducts.filter(prod => prod.id !== productId)
        });

        setSnackbar({
            open: true,
            message: 'Producto eliminado de favoritos',
            severity: 'success'
        });
    };

    const formatOrderStatus = (status) => {
        switch (status) {
            case 'Entregado':
                return <Chip size="small" color="success" label="Entregado" icon={<ShippingIcon />} />;
            case 'En proceso':
                return <Chip size="small" color="primary" label="En proceso" icon={<ShippingIcon />} />;
            case 'Cancelado':
                return <Chip size="small" color="error" label="Cancelado" icon={<CancelIcon />} />;
            default:
                return <Chip size="small" label={status} />;
        }
    };

    const renderDialogContent = () => {
        switch (dialogType) {
            case 'address':
                return (
                    <>
                        <DialogTitle>Agregar Nueva Dirección</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Calle"
                                fullWidth
                                variant="outlined"
                                value={newAddress.street}
                                onChange={handleAddressChange('street')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Número"
                                fullWidth
                                variant="outlined"
                                value={newAddress.number}
                                onChange={handleAddressChange('number')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Ciudad"
                                fullWidth
                                variant="outlined"
                                value={newAddress.city}
                                onChange={handleAddressChange('city')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Código Postal"
                                fullWidth
                                variant="outlined"
                                value={newAddress.zipCode}
                                onChange={handleAddressChange('zipCode')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Referencia (opcional)"
                                fullWidth
                                variant="outlined"
                                value={newAddress.reference}
                                onChange={handleAddressChange('reference')}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancelar</Button>
                            <Button
                                onClick={handleAddAddress}
                                variant="contained"
                                disabled={!newAddress.street || !newAddress.number || !newAddress.city || !newAddress.zipCode}
                            >
                                Guardar
                            </Button>
                        </DialogActions>
                    </>
                );

            case 'password':
                return (
                    <>
                        <DialogTitle>Cambiar Contraseña</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Contraseña actual"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange('currentPassword')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Nueva contraseña"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange('newPassword')}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                margin="dense"
                                label="Confirmar nueva contraseña"
                                type="password"
                                fullWidth
                                variant="outlined"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange('confirmPassword')}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose}>Cancelar</Button>
                            <Button
                                onClick={handleChangePassword}
                                variant="contained"
                                disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            >
                                Actualizar Contraseña
                            </Button>
                        </DialogActions>
                    </>
                );

            default:
                return null;
        }
    };

    if (loading && !userData.displayName) {
        return (
            <Backdrop open={true} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    const unreadNotifications = userData.notifications.filter(notif => !notif.read).length;

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Mi Perfil
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <Chip
                    icon={<LoyaltyIcon />}
                    label={`${userData.points} puntos`}
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 2 }}
                />
                <Badge badgeContent={unreadNotifications} color="error">
                    <IconButton color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                </Badge>
            </Box>

            <Grid container spacing={3}>
                {/* Panel de información del perfil */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <IconButton
                                        size="small"
                                        sx={{
                                            bgcolor: 'white',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            '&:hover': { bgcolor: 'grey.200' }
                                        }}
                                    >
                                        <PhotoCameraIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <Avatar
                                    src={userData.photoURL}
                                    alt={userData.displayName}
                                    sx={{ width: 120, height: 120, mb: 2 }}
                                >
                                    {userData.displayName?.charAt(0) || <PersonIcon />}
                                </Avatar>
                            </Badge>
                        </Box>

                        {isEditing ? (
                            <Box sx={{ mb: 3 }}>
                                <TextField
                                    label="Nombre"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={editableData.displayName}
                                    onChange={handleInputChange('displayName')}
                                />
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={editableData.email}
                                    onChange={handleInputChange('email')}
                                />
                                <TextField
                                    label="Teléfono"
                                    variant="outlined"
                                    fullWidth
                                    margin="normal"
                                    value={editableData.phoneNumber}
                                    onChange={handleInputChange('phoneNumber')}
                                />

                                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<SaveIcon />}
                                        onClick={handleSaveProfile}
                                    >
                                        Guardar
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={handleEditToggle}
                                    >
                                        Cancelar
                                    </Button>
                                </Box>
                            </Box>
                        ) : (
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h5" gutterBottom>
                                    {userData.displayName}
                                </Typography>

                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">{userData.email}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <PhoneIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                        <Typography variant="body2">{userData.phoneNumber}</Typography>
                                    </Box>
                                </Stack>

                                <Button
                                    variant="outlined"
                                    startIcon={<EditIcon />}
                                    sx={{ mt: 2 }}
                                    onClick={handleEditToggle}
                                >
                                    Editar Perfil
                                </Button>
                            </Box>
                        )}

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Button
                                variant="outlined"
                                startIcon={<SecurityIcon />}
                                onClick={() => handleDialogOpen('password')}
                            >
                                Cambiar Contraseña
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<SettingsIcon />}
                            >
                                Preferencias
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Panel de contenido principal */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3}>
                        <Tabs
                            value={value}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="fullWidth"
                        >
                            <Tab icon={<HomeIcon />} label="Direcciones" />
                            <Tab icon={<ShoppingBagIcon />} label="Pedidos" />
                            <Tab icon={<FavoriteIcon />} label="Favoritos" />
                        </Tabs>

                        <Box sx={{ p: 3 }}>
                            {/* Panel de Direcciones */}
                            {value === 0 && (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                        <Typography variant="h6">Mis Direcciones</Typography>
                                        <Button
                                            variant="contained"
                                            startIcon={<AddIcon />}
                                            size="small"
                                            onClick={() => handleDialogOpen('address')}
                                        >
                                            Agregar
                                        </Button>
                                    </Box>

                                    {userData.addresses.length === 0 ? (
                                        <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                                            No tienes direcciones guardadas
                                        </Typography>
                                    ) : (
                                        <List>
                                            {userData.addresses.map((address) => (
                                                <Paper elevation={1} sx={{ mb: 2, p: 1 }} key={address.id}>
                                                    <ListItem alignItems="flex-start">
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <HomeIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography variant="subtitle1">
                                                                        {address.street} {address.number}
                                                                    </Typography>
                                                                    {address.isDefault && (
                                                                        <Chip
                                                                            label="Predeterminada"
                                                                            size="small"
                                                                            color="primary"
                                                                            sx={{ ml: 1 }}
                                                                        />
                                                                    )}
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <>
                                                                    <Typography component="span" variant="body2">
                                                                        {address.city}, CP: {address.zipCode}
                                                                    </Typography>
                                                                    {address.reference && (
                                                                        <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                                                            Ref: {address.reference}
                                                                        </Typography>
                                                                    )}
                                                                </>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            {!address.isDefault && (
                                                                <IconButton
                                                                    edge="end"
                                                                    title="Establecer como predeterminada"
                                                                    onClick={() => handleSetDefaultAddress(address.id)}
                                                                >
                                                                    <StarIcon />
                                                                </IconButton>
                                                            )}
                                                            <IconButton
                                                                edge="end"
                                                                title="Eliminar dirección"
                                                                onClick={() => handleDeleteAddress(address.id)}
                                                                disabled={address.isDefault}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </Paper>
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            )}

                            {/* Panel de Pedidos */}
                            {value === 1 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Historial de Pedidos
                                    </Typography>

                                    {userData.orders.length === 0 ? (
                                        <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                                            No tienes pedidos realizados
                                        </Typography>
                                    ) : (
                                        <List>
                                            {userData.orders.map((order) => (
                                                <Paper elevation={1} sx={{ mb: 2, p: 1 }} key={order.id}>
                                                    <ListItem alignItems="flex-start">
                                                        <ListItemAvatar>
                                                            <Avatar>
                                                                <ShoppingBagIcon />
                                                            </Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography variant="subtitle1">
                                                                        Pedido #{order.id}
                                                                    </Typography>
                                                                    <Box sx={{ ml: 1 }}>
                                                                        {formatOrderStatus(order.status)}
                                                                    </Box>
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <>
                                                                    <Typography component="span" variant="body2">
                                                                        Fecha: {dayjs(order?.date?.toDate()).format('DD/MM/YYYY')}
                                                                    </Typography>
                                                                    <Typography component="span" variant="body2" sx={{ display: 'block' }}>
                                                                        Productos: {order.items} | Total: ${order.total.toFixed(2)}
                                                                    </Typography>
                                                                </>
                                                            }
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <Button
                                                                size="small"
                                                                variant="outlined"
                                                            >
                                                                Ver detalles
                                                            </Button>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </Paper>
                                            ))}
                                        </List>
                                    )}
                                </Box>
                            )}

                            {/* Panel de Favoritos */}
                            {value === 2 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Productos Favoritos
                                    </Typography>

                                    {userData.favoriteProducts.length === 0 ? (
                                        <Typography variant="body1" sx={{ textAlign: 'center', my: 3 }}>
                                            No tienes productos favoritos
                                        </Typography>
                                    ) : (
                                        <Grid container spacing={2}>
                                            {userData.favoriteProducts.map((product) => (
                                                <Grid item xs={12} sm={6} key={product.id}>
                                                    <Card>
                                                        <CardContent sx={{ display: 'flex', p: 2 }}>
                                                            <Box
                                                                component="img"
                                                                src={`/api/placeholder/80/80`}
                                                                alt={product.name}
                                                                sx={{ width: 80, height: 80, mr: 2, objectFit: 'cover', borderRadius: 1 }}
                                                            />
                                                            <Box sx={{ flex: 1 }}>
                                                                <Typography variant="subtitle1">{product.name}</Typography>
                                                                <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                                                                    ${product.price.toFixed(2)}
                                                                </Typography>
                                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                                    <Button size="small" variant="contained">
                                                                        Agregar al carrito
                                                                    </Button>
                                                                    <IconButton
                                                                        size="small"
                                                                        color="error"
                                                                        onClick={() => handleRemoveFavorite(product.id)}
                                                                    >
                                                                        <DeleteIcon fontSize="small" />
                                                                    </IconButton>
                                                                </Box>
                                                            </Box>
                                                        </CardContent>
                                                    </Card>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    )}
                                </Box>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Diálogo para nuevas direcciones o cambiar contraseña */}
            <Dialog open={openDialog} onClose={handleDialogClose} fullWidth>
                {renderDialogContent()}
            </Dialog>

            {/* Snackbar para notificaciones */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    variant="filled"
                    elevation={6}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Backdrop para carga */}
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading && isEditing}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}

export default ProfilePage;