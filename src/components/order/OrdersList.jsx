// src/components/order/OrdersList.jsx
import React from 'react';
import { useOrders } from '../../context/OrdersContext';

const OrdersList = () => {
    const { orders, loading, error, deleteOrder } = useOrders();

    if (loading) {
        return <p>Cargando órdenes...</p>;
    }

    if (error) {
        return <p>Error al cargar las órdenes: {error.message}</p>;
    }

    return (
        <div>
            <h2>Lista de pedidos</h2>
            {orders.length === 0 ? (
                <p>No hay órdenes registradas.</p>
            ) : (
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>
                            ID: {order.id}, Cliente: {order.cliente}, Total: {order.total}
                            <button onClick={() => deleteOrder(order.id)}>Eliminar</button>
                            {/* Agrega aquí botones para editar si lo necesitas */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default OrdersList;