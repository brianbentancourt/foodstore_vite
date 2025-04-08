// ProductCard.jsx
import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
    Button,
    Grid,
    useMediaQuery,
    Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useInView } from 'react-intersection-observer';
import InputNumber from '../InputNumber';
// import OrderProductEdit from './OrderProductEdit';
import { generateSmartComposition } from '../../utils/product';

// Componente para la imagen con lazy loading y caché
const ProductImage = React.memo(({ src, alt }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        // Sistema de caché simple utilizando localStorage
        const cacheKey = `img_cache_${src}`;
        const cachedImage = localStorage.getItem(cacheKey);

        if (cachedImage) {
            setImageSrc(cachedImage);
        } else if (inView && src) {
            // Cargamos la imagen solo cuando esté en viewport
            const img = new Image();
            img.src = src;
            img.onload = () => {
                setImageSrc(src);
                // Guardamos en caché (en caso real usaríamos una solución más robusta)
                try {
                    localStorage.setItem(cacheKey, src);
                } catch (e) {
                    console.warn('No se pudo guardar la imagen en caché:', e);
                }
            };
        }
    }, [src, inView]);

    return (
        <div ref={ref} style={{ height: '330px', position: 'relative' }}>
            {imageSrc ? (
                <CardMedia
                    component="img"
                    sx={{
                        height: 330,
                        objectFit: 'cover',
                        transition: 'opacity 0.3s ease-in-out',
                    }}
                    image={imageSrc}
                    alt={alt}
                />
            ) : (
                <div style={{
                    height: '100%',
                    backgroundColor: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <Typography variant="body2" color="text.secondary">
                        Cargando imagen...
                    </Typography>
                </div>
            )}
        </div>
    );
});

// Etiquetas de información del producto (oferta, agotado)
const ProductInfo = React.memo(({ sale, available }) => {
    return (
        <Stack spacing={0} position="absolute" width="100%" bottom={0}>
            {sale && (
                <Typography
                    sx={{
                        bgcolor: '#70B67B',
                        color: 'white',
                        textAlign: 'center'
                    }}
                >
                    ¡Oferta!
                </Typography>
            )}
            {!available && (
                <Typography
                    sx={{
                        bgcolor: '#FF0000',
                        color: 'white',
                        textAlign: 'center',
                    }}
                >
                    Agotado
                </Typography>
            )}
        </Stack>
    );
});

// La tarjeta de producto individual
const ProductCard = React.memo(({
    product,
    cart,
    addToCart,
    setCart,
    zoomOnHover = true
}) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));
    const [editDisabled, setEditDisabled] = useState(true);
    const [editLineOpen, setEditLineOpen] = useState(false);
    const [localProduct, setLocalProduct] = useState({});

    useEffect(() => {
        const { productsList = [] } = cart;
        const qty = getQty();
        const _product = productsList?.find(prod => prod.id === product.id) || { ...product };
        const smartComposition = _product.smartComposition ||
            generateSmartComposition(_product).smartComposition;

        setLocalProduct({ ..._product, smartComposition, qty });
    }, [product, cart]);

    const getQty = () => {
        const prod = cart?.productsList?.find(p => p.id === product.id);
        const { qty = 0 } = prod || {};
        setEditDisabled(qty < 1);
        return qty;
    };

    const handleChangeQty = ({ qty = 0 }) => {
        if (qty < 1) qty = 0;

        const item = {
            ...product,
            qty
        };

        if (typeof addToCart === 'function')
            addToCart(item);

        if (localProduct.id === item.id)
            setLocalProduct(item);
    };

    const handleConfirmLineEdit = (prodEdited) => {
        const { productsList } = cart;
        const _productsList = productsList?.map(p => {
            if (prodEdited.id === p.id)
                return { ...prodEdited };
            return { ...p };
        });

        setCart({
            ...cart,
            productsList: _productsList
        });
    };

    const handleEditProduct = () => {
        if (localProduct.qty > 0) {
            setEditLineOpen(true);
        }
    };

    return (
        <Card
            sx={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: 345,
                m: isDesktop ? 1.25 : '0 1.25rem 2.5rem 1.25rem',
                transition: 'transform .2s',
                ...(zoomOnHover && {
                    '&:hover': {
                        transform: isDesktop ? 'scale(1.07)' : 'scale(1.05)',
                        boxShadow: 6
                    }
                }),
                height: '100%',
            }}
            elevation={3}
        >
            {/* <OrderProductEdit
                itemToEdit={localProduct}
                order={cart}
                openForm={editLineOpen}
                setOpenForm={setEditLineOpen}
                onConfirm={handleConfirmLineEdit}
            /> */}

            <CardActionArea sx={{ position: 'relative', flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
                <ProductImage
                    src={product.src || product.img}
                    alt={product.name}
                />

                <ProductInfo sale={product.sale} available={product.stock} />

                <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" component="p">
                        {product.ingredients}
                    </Typography>

                    {product.sale ? (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography
                                sx={{
                                    fontSize: 20,
                                    textDecoration: 'line-through'
                                }}
                                color="text.secondary"
                            >
                                ${product.previousPrice}
                            </Typography>
                            <Typography
                                sx={{ fontSize: 20 }}
                                color="primary"
                            >
                                ${product.price}
                            </Typography>
                        </Stack>
                    ) : (
                        <Typography sx={{ fontSize: 20 }} color="primary">
                            ${product.price}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>

            <CardActions sx={{
                mt: 'auto',
                p: 1,
                display: 'block', // Cambia el display a block para permitir que hijos ocupen todo el ancho
                width: '100%'     // Asegura que CardActions tome todo el ancho disponible
            }}>
                <Grid container spacing={1}>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                        <InputNumber
                            label='Seleccione cantidad'
                            value={localProduct.qty}
                            setValue={qty => handleChangeQty({ qty })}
                            fullWidth
                            disabled={!product.stock}

                        />
                    </Grid>
                    <Grid item xs={12} sx={{ width: '100%' }}>
                        <Button
                            disabled={editDisabled}
                            color="primary"
                            variant="outlined"
                            onClick={handleEditProduct}
                            fullWidth
                        >
                            Cambiar ingredientes
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
});

export default ProductCard;
