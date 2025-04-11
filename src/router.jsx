import { createBrowserRouter } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import HomePage from './routes/HomePage';
import AboutPage from './routes/AboutPage';
import OrdersPage from './routes/OrdersPage';
import CartPage from './routes/CartPage';
import UserProfilePage from './routes/UserProfilePage';
import MapPage from './routes/MapPage';
import Layout from './components/Layout';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />, // Usa Layout como el elemento principal
        errorElement: <ErrorPage />,
        children: [
            {
                path: '',
                element: <HomePage />,
            },
            {
                path: 'about',
                element: <AboutPage />,
            },
            {
                path: 'orders',
                element: <OrdersPage />,
            },
            {

                path: 'carrito',
                element: <CartPage />,
            },
            {

                path: 'perfil',
                element: <UserProfilePage />,
            },
            {
                path: 'mapa',
                element: <MapPage />,
            }
        ],
    },
]);