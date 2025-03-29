import React from 'react';
import { Container, Box, Paper, Typography, Grid, Card, CardContent, Button, Divider, useTheme } from '@mui/material';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import { clientAppName } from '../theme/clientTheme';

function MainContent() {
    // Acceder al tema actual para usar sus colores
    const theme = useTheme();

    // En una aplicación real, estos datos vendrían de una API
    const featuredItems = [
        {
            id: 1,
            name: 'Plato Especial',
            description: 'Nuestra especialidad de la casa, preparada con ingredientes frescos.',
            price: '$12.99',
            popular: true
        },
        {
            id: 2,
            name: 'Combo Familiar',
            description: 'Perfecto para compartir, incluye 4 platos principales y 2 acompañamientos.',
            price: '$29.99',
            popular: false
        },
        {
            id: 3,
            name: 'Postre del Día',
            description: 'Delicioso postre artesanal, pregunta por la disponibilidad del día.',
            price: '$6.99',
            popular: true
        },
        {
            id: 4,
            name: 'Bebida Especial',
            description: 'Refrescante bebida preparada con ingredientes naturales.',
            price: '$4.99',
            popular: false
        }
    ];

    return (
        <Box
            sx={{
                flexGrow: 1,
                py: 3,
                backgroundColor: theme.palette.background.default
            }}
        >
            <Container maxWidth="lg">
                {/* Banner principal con los colores del tema */}
                <Paper
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

                {/* Características del restaurante */}
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
                </Grid>

                {/* Título de sección con subrayado del color secundario */}
                <Box sx={{ mb: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        Nuestros Platillos Destacados
                    </Typography>
                    <Divider sx={{ width: '60px', mt: 1, borderBottomWidth: 3, borderColor: theme.palette.secondary.main }} />
                </Box>

                {/* Productos destacados */}
                <Grid container spacing={3} sx={{ mb: 5 }}>
                    {featuredItems.map((item) => (
                        <Grid item xs={12} sm={6} md={3} key={item.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: 2,
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                {item.popular && (
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            backgroundColor: theme.palette.secondary.main,
                                            color: theme.palette.secondary.contrastText,
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1,
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        Popular
                                    </Box>
                                )}
                                {/* Área de color que simula una imagen */}
                                <Box
                                    sx={{
                                        height: 120,
                                        backgroundColor: theme.palette.primary.light,
                                        opacity: 0.7,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <RestaurantIcon sx={{ fontSize: 40, color: 'white' }} />
                                </Box>
                                <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" component="h3" fontSize="1rem">
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight="bold"
                                            sx={{
                                                color: theme.palette.primary.main
                                            }}
                                        >
                                            {item.price}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mb={2}>
                                        {item.description}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                    >
                                        Añadir al Carrito
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Sección de promociones */}
                <Paper
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
                </Paper>
            </Container>
        </Box>
    );
}

export default MainContent;