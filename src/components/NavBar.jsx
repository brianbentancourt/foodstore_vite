import React, { useMemo, useState } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Badge,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    Button,
    Divider,
    Avatar,
    Menu,
    MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import LoginModal from './LoginModal';
import { useAuth } from '../context/AuthContext';
import { clientAppName } from '../theme/clientTheme';
import { useOrders } from '../context/OrdersContext';

function NavBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [userMenuAnchor, setUserMenuAnchor] = useState(null);
    const { currentUser, userPoints, logout } = useAuth();
    const { cart } = useOrders();

    const cartItemCount = useMemo(() => {
        return cart.productsList?.reduce((acc, item) => acc + (item.qty || 0), 0) || 0;
    }, [cart.productsList]);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleLoginClick = () => {
        setLoginModalOpen(true);
    };

    const handleCloseLoginModal = () => {
        setLoginModalOpen(false);
    };

    const handleUserMenuOpen = (event) => {
        setUserMenuAnchor(event.currentTarget);
    };

    const handleUserMenuClose = () => {
        setUserMenuAnchor(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            handleUserMenuClose();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const drawerWidth = 240;

    const navItems = [
        { text: 'Inicio', path: '/', icon: <HomeIcon /> },
        { text: 'Pedidos', path: '/orders', icon: <ReceiptIcon /> },
        { text: 'Acerca de', path: '/about', icon: <InfoIcon /> },
    ];

    const drawer = (
        <Box sx={{ width: drawerWidth }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
                    {clientAppName}
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <List>
                {navItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={Link} to={item.path}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            {currentUser && (
                <>
                    <Divider />
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout}>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Cerrar sesión" />
                        </ListItemButton>
                    </ListItem>
                </>
            )}
        </Box>
    );

    return (
        <Box>
            <AppBar position="fixed">
                <Toolbar>
                    {/* Sección izquierda: Menú y nombre de aplicación */}
                    <Box sx={{ display: 'flex', alignItems: 'center', minWidth: '200px' }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 1 }}
                        >
                            <MenuIcon />
                        </IconButton>

                        <Box component="img" src="/logo.png" alt="Logo" sx={{ height: 45, mr: 1 }} />

                        {/* <Typography variant="h6" component="div" noWrap>
                            {clientAppName}
                        </Typography> */}
                    </Box>

                    {/* Sección central: SearchBar siempre centrado */}
                    <Box sx={{
                        flexGrow: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        pointerEvents: 'none'
                    }}>
                        <Box sx={{ pointerEvents: 'auto' }}>
                            <SearchBar />
                        </Box>
                    </Box>

                    {/* Sección derecha: Login/Usuario, Carrito y puntos */}
                    <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', minWidth: '200px', justifyContent: 'flex-end' }}>
                        <IconButton color="inherit" component={Link} to="/carrito">
                            <Badge badgeContent={cartItemCount} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>

                        {currentUser ? (
                            <>
                                <Typography variant="body1" color="inherit" sx={{ ml: 2 }}>
                                    Puntos: {userPoints}
                                </Typography>
                                <IconButton
                                    onClick={handleUserMenuOpen}
                                    sx={{ ml: 1 }}
                                >
                                    <Avatar
                                        src={currentUser.photoURL}
                                        alt={currentUser.displayName}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                </IconButton>
                                <Menu
                                    anchorEl={userMenuAnchor}
                                    open={Boolean(userMenuAnchor)}
                                    onClose={handleUserMenuClose}
                                >
                                    <MenuItem component={Link} to="/perfil" onClick={handleUserMenuClose}>
                                        Perfil
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        Cerrar sesión
                                    </MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                startIcon={<LoginIcon />}
                                onClick={handleLoginClick}
                                sx={{ ml: 2 }}
                            >
                                Iniciar sesión
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Modal de login */}
            <LoginModal open={loginModalOpen} onClose={handleCloseLoginModal} />

            <Box component="nav">
                <Drawer
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </Box>
        </Box>
    );
}

export default NavBar;