import React from 'react';
import { Container, Box, Paper, Typography, Grid, Card, CardContent, Button, Divider, useTheme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { clientAppName } from '../theme/clientTheme';
import ProductListContainer from './product/ProductListContainer';

function MainContent() {
    // Acceder al tema actual para usar sus colores
    const theme = useTheme();

    return (
        <Box
            sx={{
                flexGrow: 1,
                py: 3,
                backgroundColor: theme.palette.background.default
            }}
        >
            <Container maxWidth="100%" >
                {/* Banner principal con los colores del tema */}
                {/* <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                        color: theme.palette.primary.contrastText,
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ zIndex: 1, maxWidth: { xs: '100%', md: '60%' } }}>
                        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                            ¡Bienvenido a {clientAppName}!
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Descubre nuestro menú y disfruta de los mejores sabores con solo unos clics.
                            Ordena ahora y gana puntos con cada compra.
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            sx={{
                                fontWeight: 'bold',
                                px: 3
                            }}
                        >
                            Ver Menú Completo
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: { xs: 3, md: 0 },
                            width: { xs: '100%', md: '30%' },
                            height: 150,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: 2,
                            border: '2px dashed rgba(255,255,255,0.3)'
                        }}
                    >
                        <RestaurantIcon sx={{ fontSize: 80, opacity: 0.8 }} />
                    </Box>
                </Paper>

                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { icon: <RestaurantIcon fontSize="large" />, title: 'Comida de Calidad', text: 'Ingredientes frescos y seleccionados' },
                        { icon: <DeliveryDiningIcon fontSize="large" />, title: 'Entrega Rápida', text: 'Tu pedido en menos de 30 minutos' },
                        { icon: <LocalOfferIcon fontSize="large" />, title: 'Ofertas Exclusivas', text: 'Promociones semanales para nuestros clientes' }
                    ].map((feature, index) => (
                        <Grid item xs={12} md={4} key={index}>
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    borderRadius: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderLeft: `4px solid ${theme.palette.secondary.main}`,
                                    transition: 'transform 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)'
                                    }
                                }}
                            >
                                <Box sx={{ color: theme.palette.secondary.main, mb: 2 }}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" component="h3" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.text}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                     </Grid> */}

                {/* Título de sección con subrayado del color secundario */}
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        Nuestros Platillos Destacados
                    </Typography>
                    <Divider sx={{ width: '60px', mt: 1, borderBottomWidth: 3, borderColor: theme.palette.secondary.main }} />
                </Box>

                {/* Productos destacados */}
                <ProductListContainer />

                {/* Sección de promociones */}
                {/* <Paper
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.secondary.contrastText,
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                        <Typography variant="h5" gutterBottom fontWeight="bold">
                            Promoción Especial
                        </Typography>
                        <Typography variant="body1">
                            Utiliza el código <strong>WELCOME10</strong> en tu primera compra y obtén un 10% de descuento.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: 'white',
                            color: theme.palette.secondary.main,
                            '&:hover': {
                                bgcolor: theme.palette.grey[100]
                            }
                        }}
                    >
                        Aplicar Código
                    </Button>
                </Paper> */}
            </Container>
        </Box>
    );
}

export default MainContent;