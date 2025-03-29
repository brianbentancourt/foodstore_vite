// src/orders/OrdersContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import firebaseApp from '../firebase/firebaseConfig'; // Ajusta la ruta si es necesario
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot } from 'firebase/firestore';

// Inicializa Firestore
const db = getFirestore(firebaseApp);
const ordersCollectionRef = collection(db, 'orders');

// Crea el Context
const OrdersContext = createContext();

// Crea un hook personalizado para usar el Context más fácilmente
export const useOrders = () => useContext(OrdersContext);

// Crea el Provider del Context
export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función para obtener todas las órdenes en tiempo real
    useEffect(() => {
        const unsubscribe = onSnapshot(ordersCollectionRef, (snapshot) => {
            try {
                const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(newOrders);
                setLoading(false);
                setError(null);
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error al obtener órdenes:", e);
            }
        });

        // Limpia la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    // Funciones para el ABM
    const addOrder = async (newOrderData) => {
        try {
            await addDoc(ordersCollectionRef, newOrderData);
        } catch (e) {
            setError(e);
            console.error("Error al agregar orden:", e);
        }
    };

    const deleteOrder = async (orderId) => {
        const orderDocRef = doc(db, 'orders', orderId);
        try {
            await deleteDoc(orderDocRef);
        } catch (e) {
            setError(e);
            console.error("Error al eliminar orden:", e);
        }
    };

    const updateOrder = async (orderId, updatedOrderData) => {
        const orderDocRef = doc(db, 'orders', orderId);
        try {
            await updateDoc(orderDocRef, updatedOrderData);
        } catch (e) {
            setError(e);
            console.error("Error al actualizar orden:", e);
        }
    };

    // Valores que serán provistos por el Context
    const value = {
        orders,
        loading,
        error,
        addOrder,
        deleteOrder,
        updateOrder,
    };

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
};