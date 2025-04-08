// ProductList.jsx
import React, { useMemo } from 'react';
import {
    Grid,
} from '@mui/material';
import ProductCard from './ProductCard';


// Componente principal de listado de productos
const ProductList = ({
    products = [],
    cart = {},
    addToCart = () => { },
    setCart = () => { },
    zoomOnHover = true
}) => {
    // Usamos useMemo para evitar re-renderizados innecesarios
    const memoizedProducts = useMemo(() => products, [products]);

    return (
        <Grid container spacing={3} sx={{ width: '100%', justifyContent: 'center', }}>
            {memoizedProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard
                        product={product}
                        cart={cart}
                        addToCart={addToCart}
                        setCart={setCart}
                        zoomOnHover={zoomOnHover}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default ProductList;