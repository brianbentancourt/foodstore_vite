// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { OrdersProvider } from './context/OrdersContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <OrdersProvider>
        <RouterProvider router={router} />
      </OrdersProvider>
    </AuthProvider>
  );
}

export default App;