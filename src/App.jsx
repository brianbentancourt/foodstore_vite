// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { OrdersProvider } from './context/OrdersContext';
import { AuthProvider } from './context/AuthContext';
import ProductsProvider from './context/ProductsContext';

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <ProductsProvider>
          <RouterProvider router={router} />
        </ProductsProvider>
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;