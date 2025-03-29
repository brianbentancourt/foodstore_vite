// src/App.jsx
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { OrdersProvider } from './context/OrdersContext';

function App() {
  return (
    <OrdersProvider>
      <RouterProvider router={router} />
    </OrdersProvider>
  );
}

export default App;