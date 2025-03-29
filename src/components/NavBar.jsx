import React, { useState } from 'react';
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
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close'; // Importa el icono de cerrar
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import { clientAppName } from '../theme/clientTheme';

function NavBar() {
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleDrawerToggle = () => {
        setDrawerOpen(!drawerOpen);
    };

    const drawerWidth = 240;

    const navItems = [
        { text: 'Inicio', path: '/', icon: <HomeIcon /> },
        { text: 'Acerca de', path: '/about', icon: <InfoIcon /> },
        // Agrega más elementos de menú aquí
    ];

    const drawer = (
        <Box sx={{ width: drawerWidth }} role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1 }}>
                <IconButton onClick={handleDrawerToggle}>
                    <CloseIcon /> {/* Icono de cerrar en la parte superior */}
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
                        <Typography variant="h6" component="div" noWrap>
                            {clientAppName}
                        </Typography>
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

                    {/* Sección derecha: Carrito y puntos */}
                    <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', minWidth: '200px', justifyContent: 'flex-end' }}>
                        <IconButton color="inherit" component={Link} to="/cart">
                            <Badge badgeContent={1} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        <Typography variant="body1" color="inherit" sx={{ ml: 2 }}>
                            Puntos: {5555}
                        </Typography>
                    </Box>
                </Toolbar>
            </AppBar>
            <Box component="nav">
                <Drawer
                    open={drawerOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
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