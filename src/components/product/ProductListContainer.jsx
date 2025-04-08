// src/products/ProductListContainer.jsx
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useProducts } from '../../context/ProductsContext';
import { useOrders } from '../../context/OrdersContext';
import {
    Container,
    Box,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    CircularProgress,
    Drawer,
    Fab,
    Snackbar,
    Alert,
    Paper
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import ProductList from './ProductList';
import { generateSmartComposition } from '../../utils/product';

// Componente para el carrito de compras (mini-drawer)
const CartDrawer = ({ open, onClose, cart, removeFromCart, updateQuantity, checkout }) => {
    const totalItems = useMemo(() => (
        cart.productsList?.reduce((acc, item) => acc + (item.qty || 0), 0) || 0
    ), [cart.productsList]);

    const totalPrice = useMemo(() => (
        cart.productsList?.reduce((acc, item) => acc + ((item.price * item.qty) || 0), 0) || 0
    ), [cart.productsList]);

    if (!cart.productsList?.length) {
        return (
            <Drawer anchor="right" open={open} onClose={onClose}>
                <Box sx={{ width: 350, p: 3 }}>
                    <Typography variant="h6" gutterBottom>
                        Carrito de Compras
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Tu carrito está vacío
                    </Typography>
                </Box>
            </Drawer>
        );
    }

    return (
        <Drawer anchor="right" open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
            <Box sx={{ width: 350, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Carrito de Compras ({totalItems} items)
                </Typography>

                <Box sx={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto', my: 2 }}>
                    {cart.productsList?.map((item) => (
                        <Paper key={item.id} sx={{ p: 2, mb: 2, position: 'relative' }}>
                            <Typography variant="subtitle1">{item.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {item.smartComposition?.summary || item.ingredients}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                <Typography variant="body2">
                                    ${item.price} x {item.qty} = ${(item.price * item.qty).toFixed(2)}
                                </Typography>
                                <Box>
                                    <IconButton
                                        size="small"
                                        onClick={() => updateQuantity(item, item.qty - 1)}
                                        disabled={item.qty <= 1}
                                    >
                                        -
                                    </IconButton>
                                    <Typography component="span" sx={{ mx: 1 }}>
                                        {item.qty}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => updateQuantity(item, item.qty + 1)}
                                    >
                                        +
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={() => removeFromCart(item.id)}
                                    >
                                        ×
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>

                <Box sx={{ mt: 2, p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Total: ${totalPrice.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={checkout}
                        sx={{ mb: 1 }}
                    >
                        Finalizar Compra
                    </Button>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={onClose}
                    >
                        Seguir Comprando
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

// Componente contenedor
const ProductListContainer = () => {
    const {
        filteredProducts,
        categories,
        loading,
        error,
        selectedCategory,
        setSelectedCategory,
        // searchProducts,
        // searchTerm,
        // setSearchTerm
    } = useProducts();

    const { addOrder } = useOrders();


    const [cart, setCart] = useState({ productsList: [] });
    const [cartOpen, setCartOpen] = useState(false);
    const [notification, setNotification] = useState({ open: false, message: '', type: 'info' });

    // Filtrar productos disponibles
    const availableProducts = useMemo(() => {
        return filteredProducts.filter(product => product.stock !== false);
    }, [filteredProducts]);

    // Contar items en el carrito
    const cartItemCount = useMemo(() => {
        return cart.productsList?.reduce((acc, item) => acc + (item.qty || 0), 0) || 0;
    }, [cart.productsList]);

    // Manejar búsqueda
    // const handleSearch = useCallback((e) => {
    //     const value = e.target.value;
    //     updateSearchText(value);
    //     searchProducts(value);
    // }, [searchProducts, searchText]);

    // Manejar cambio de categoría
    const handleCategoryChange = useCallback((e) => {
        setSelectedCategory(e.target.value);
    }, [setSelectedCategory]);

    // Agregar producto al carrito
    const addToCart = useCallback((product) => {
        if (!product || product.qty < 1) return;

        setCart(prevCart => {
            const existingProductIndex = prevCart.productsList?.findIndex(item => item.id === product.id);
            let updatedProductsList = [...(prevCart.productsList || [])];

            // Asegurarse de que tenga smartComposition
            const productWithComposition = {
                ...product,
                smartComposition: product.smartComposition || generateSmartComposition(product).smartComposition
            };

            if (existingProductIndex > -1) {
                // Si el producto ya existe, actualizar cantidad
                updatedProductsList[existingProductIndex] = {
                    ...updatedProductsList[existingProductIndex],
                    qty: product.qty
                };
            } else {
                // Si es un producto nuevo, añadirlo
                updatedProductsList.push(productWithComposition);
            }

            // Filtrar productos con cantidad > 0
            updatedProductsList = updatedProductsList.filter(item => item.qty > 0);

            return { ...prevCart, productsList: updatedProductsList };
        });

        // Mostrar notificación
        setNotification({
            open: true,
            message: `${product.name} añadido al carrito`,
            type: 'success'
        });
    }, []);

    // Remover producto del carrito
    const removeFromCart = useCallback((productId) => {
        setCart(prevCart => ({
            ...prevCart,
            productsList: prevCart.productsList?.filter(item => item.id !== productId) || []
        }));
    }, []);

    // Actualizar cantidad de un producto
    const updateQuantity = useCallback((product, newQty) => {
        if (newQty < 1) {
            removeFromCart(product.id);
            return;
        }

        const updatedProduct = { ...product, qty: newQty };
        addToCart(updatedProduct);
    }, [addToCart, removeFromCart]);

    // Finalizar compra
    const handleCheckout = useCallback(async () => {
        if (!cart.productsList?.length) {
            setNotification({
                open: true,
                message: 'El carrito está vacío',
                type: 'warning'
            });
            return;
        }

        try {
            // Crear nueva orden
            const newOrder = {
                productsList: cart.productsList,
                total: cart.productsList.reduce((acc, item) => acc + (item.price * item.qty), 0),
                status: 'pending',
                createdAt: new Date()
                // Aquí puedes añadir más campos como datos del cliente, dirección, etc.
            };

            await addOrder(newOrder);

            // Limpiar carrito después de crear la orden
            setCart({ productsList: [] });
            setCartOpen(false);

            setNotification({
                open: true,
                message: '¡Orden creada exitosamente!',
                type: 'success'
            });
        } catch (error) {
            console.error('Error al crear la orden:', error);
            setNotification({
                open: true,
                message: 'Error al procesar la orden',
                type: 'error'
            });
        }
    }, [cart, addOrder]);

    // Cerrar notificación
    const handleCloseNotification = useCallback((event, reason) => {
        if (reason === 'clickaway') return;
        setNotification(prev => ({ ...prev, open: false }));
    }, []);

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', }}>
            {/* Header y Filtros */}
            <Box sx={{ mb: 4, mt: 2, width: '100%' }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <Grid item xs={12} >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Nuestros Productos
                        </Typography>
                    </Grid>

                    {/* <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid> */}

                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="category-select-label">Categoría</InputLabel>
                            <Select
                                labelId="category-select-label"
                                id="category-select"
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                label="Categoría"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="all">Todas las categorías</MenuItem>
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Listado de Productos */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 4 }}>
                    Error al cargar productos: {error.message}
                </Alert>
            ) : availableProducts.length === 0 ? (
                <Alert severity="info" sx={{ mb: 4 }}>
                    No se encontraron productos que coincidan con tu búsqueda.
                </Alert>
            ) : (
                <ProductList
                    products={availableProducts}
                    cart={cart}
                    addToCart={addToCart}
                    setCart={setCart}
                    zoomOnHover={true}
                />
            )}

            {/* Botón flotante del carrito */}
            <Fab
                color="primary"
                aria-label="cart"
                sx={{ position: 'fixed', bottom: 20, right: 20 }}
                onClick={() => setCartOpen(true)}
                disabled={!cartItemCount}
            >
                <Badge badgeContent={cartItemCount} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </Fab>

            {/* Drawer del carrito */}
            <CartDrawer
                open={cartOpen}
                onClose={() => setCartOpen(false)}
                cart={cart}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                checkout={handleCheckout}
            />

            {/* Notificaciones */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert onClose={handleCloseNotification} severity={notification.type} sx={{ width: '100%' }}>
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Imports faltantes
import { Badge, Button } from '@mui/material';
import { useSearch } from '../../context/SearchContext';

export default ProductListContainer;