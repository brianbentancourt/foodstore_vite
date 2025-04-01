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
    useMediaQuery,
    useTheme,
    IconButton,
    Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import MapIcon from '@mui/icons-material/Map';
import { useOrders } from '../../context/OrdersContext';
import CompactOrderCard from './OrderCardCompact';
import { stateLabels } from '../../constants';

// Lazy load del componente OrderCard para reducir el bundle inicial
const OrderCard = lazy(() => import('./OrderCard'));

// Placeholder para cuando OrderCard está cargando
const OrderCardSkeleton = () => (
    <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
        <Skeleton variant="rectangular" height="100%" />
    </Paper>
);


// Componente para virtualización en cuadrícula
const VirtualizedGrid = ({ items, renderItem, containerHeight = '70vh', batchSize = 20 }) => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.only('xs'));
    const isSm = useMediaQuery(theme.breakpoints.only('sm'));
    const isMd = useMediaQuery(theme.breakpoints.only('md'));

    // Determinar número de columnas basado en el breakpoint
    const cols = isXs ? 1 : isSm ? 2 : isMd ? 3 : 4;

    const containerRef = React.useRef(null);
    const [visibleItems, setVisibleItems] = useState([]);
    const [startIndex, setStartIndex] = useState(0);

    // Carga por lotes para mejor rendimiento
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollHeight = container.scrollHeight;

            // Si el scroll está cerca del final, cargar más elementos
            if (scrollHeight - scrollTop - clientHeight < 500) {
                setStartIndex(prev => Math.min(prev + batchSize, Math.max(0, items.length - batchSize)));
            }
        };

        // Configuración inicial
        const initialVisibleCount = Math.min(batchSize, items.length);
        setVisibleItems(items.slice(0, initialVisibleCount));

        // Agregar event listener
        container.addEventListener('scroll', handleScroll);

        // Limpieza
        return () => container.removeEventListener('scroll', handleScroll);
    }, [items, batchSize]);

    // Actualizar elementos visibles cuando cambian los items o el startIndex
    useEffect(() => {
        const endIndex = Math.min(startIndex + batchSize, items.length);
        const newVisibleItems = items.slice(0, endIndex);
        setVisibleItems(newVisibleItems);
    }, [items, startIndex, batchSize]);

    return (
        <div
            ref={containerRef}
            style={{
                height: containerHeight,
                overflow: 'auto',
                position: 'relative'
            }}
        >
            <Grid container spacing={2}>
                {visibleItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={item.id} sx={{ height: 'auto' }}>
                        {renderItem(item)}
                    </Grid>
                ))}
                {visibleItems.length < items.length && (
                    <Grid item xs={12} sx={{ textAlign: 'center', py: 2 }}>
                        <CircularProgress size={24} />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                            Cargando más pedidos...
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </div>
    );
};





const OrdersList = () => {
    const { orders, loading, error, updateOrderState } = useOrders();

    // Estados para filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [filterState, setFilterState] = useState('all');
    const [showCompact, setShowCompact] = useState(true);

    // Estado de transición para UI responsiva durante filtrado
    const [isPending, startTransition] = useTransition();

    // Caché de búsqueda
    const searchCache = new Map();
    let searchIndex = null;

    // Debounce para la búsqueda
    useEffect(() => {
        const handler = setTimeout(() => {
            startTransition(() => {
                setDebouncedSearchTerm(searchTerm);
            });
        }, 300);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Memoización de órdenes filtradas con búsqueda optimizada
    const filteredOrders = useMemo(() => {
        if (!orders || orders.length === 0) {
            return [];
        }

        // Usar indexedDB para almacenar en caché los resultados de búsqueda anteriores
        if (window.indexedDB && searchCache.has(searchTerm + filterState)) {
            return searchCache.get(searchTerm + filterState);
        }

        // Si no hay filtros, devolver todas las órdenes
        if (!debouncedSearchTerm && filterState === 'all') {
            return orders;
        }

        let result = orders;

        // Implementar búsqueda optimizada
        if (debouncedSearchTerm) {
            const term = debouncedSearchTerm.toLowerCase();

            // Indexación para búsqueda más rápida
            if (!searchIndex) {
                // Creación de índice una sola vez
                searchIndex = new Map();
                orders.forEach(order => {
                    const searchableText = `${order.id || ''} ${order.cliente || ''} ${order.address || ''}`.toLowerCase();
                    searchIndex.set(order.id, searchableText);
                });
            }

            // Búsqueda utilizando el índice
            result = result.filter(order => {
                const searchableText = searchIndex.get(order.id);
                return searchableText && searchableText.includes(term);
            });
        }

        // Filtrar por estado
        if (filterState !== 'all') {
            result = result.filter(order => order.orderState === filterState);
        }

        // Almacenar en caché los resultados de búsqueda
        if (window.indexedDB) {
            searchCache.set(searchTerm + filterState, result);
        }

        return result;
    }, [orders, debouncedSearchTerm, filterState]);


    // Handlers memoizados para eventos
    const handleEditOrder = useCallback((orderId) => {
        console.log(`Editando orden: ${orderId}`);
        // Aquí implementarías la navegación a la página de edición
    }, []);

    const handlePrintOrder = useCallback((orderId) => {
        console.log(`Imprimiendo orden: ${orderId}`);
        // Implementa la lógica de impresión
    }, []);

    const handleViewHistory = useCallback((orderId) => {
        console.log(`Viendo historial de orden: ${orderId}`);
        // Implementa la visualización del historial
    }, []);

    const handleUpdateState = useCallback((orderId, newState) => {
        console.log(`Actualizando estado de orden ${orderId} a: ${newState}`);
        if (updateOrderState) {
            updateOrderState(orderId, newState);
        }
    }, [updateOrderState]);

    // Renderizar elemento de OrderCard
    const renderOrderCard = useCallback((order) => (
        <Suspense fallback={<OrderCardSkeleton />}>
            {showCompact ? (
                <CompactOrderCard
                    order={order}
                    onEditOrder={handleEditOrder}
                    onPrintOrder={handlePrintOrder}
                    onViewHistory={handleViewHistory}
                    onUpdateState={handleUpdateState}
                />
            ) : (
                <OrderCard
                    order={order}
                    onEditOrder={handleEditOrder}
                    onPrintOrder={handlePrintOrder}
                    onViewHistory={handleViewHistory}
                    onUpdateState={handleUpdateState}
                />
            )}
        </Suspense>
    ), [handleEditOrder, handlePrintOrder, handleViewHistory, handleUpdateState, showCompact]);

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Lista de pedidos
                </Typography>

                <Box>
                    <IconButton
                        onClick={() => setShowCompact(true)}
                        color={showCompact ? "primary" : "default"}
                    >
                        <GridViewIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setShowCompact(false)}
                        color={!showCompact ? "primary" : "default"}
                    >
                        <ViewListIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => setShowCompact(false)}
                        color="primary"
                    >
                        <MapIcon />
                    </IconButton>
                </Box>
            </Box>

            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Búsqueda */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por ID, cliente o dirección..."
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>

                    {/* Filtro de Estado */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth variant="outlined">
                            <InputLabel id="state-filter-label">Estado</InputLabel>
                            <Select
                                labelId="state-filter-label"
                                value={filterState}
                                onChange={(e) => {
                                    startTransition(() => {
                                        setFilterState(e.target.value);
                                    });
                                }}
                                label="Estado"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <FilterListIcon />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {Object.entries(stateLabels).map(([value, label]) => (
                                    <MenuItem key={value} value={value}>{label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Botón para limpiar filtros */}
                    <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={() => {
                                setSearchTerm('');
                                setFilterState('');
                            }}
                            startIcon={<ClearIcon />}
                        >
                            Limpiar filtros
                        </Button>
                    </Grid>
                </Grid>
            </Paper>


            {/* Indicador de carga durante la transición */}
            {isPending && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Typography color="text.secondary">Actualizando resultados...</Typography>
                </Box>
            )}

            {/* Lista de órdenes */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">
                    Error al cargar las órdenes: {error.message}
                </Alert>
            ) : filteredOrders.length === 0 ? (
                <Alert severity="info">
                    No hay órdenes registradas o que coincidan con los filtros aplicados.
                </Alert>
            ) : (
                <VirtualizedGrid
                    items={filteredOrders}
                    renderItem={renderOrderCard}
                    containerHeight="70vh"
                    batchSize={30}
                />
            )}
        </Container>
    );
};

// Necesitamos importar estos íconos para el toggle de vista
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';

export default React.memo(OrdersList);