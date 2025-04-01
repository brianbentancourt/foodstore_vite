// src/orders/OrdersContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import firebaseApp from '../firebase/firebaseConfig'; // Ajusta la ruta si es necesario
import { getFirestore, collection, addDoc, doc, deleteDoc, updateDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

// Inicializa Firestore
const db = getFirestore(firebaseApp);
const ordersCollectionRef = collection(db, 'orders');

// Crea el Context
const OrdersContext = createContext();

// Crea un hook personalizado para usar el Context
export const useOrders = () => useContext(OrdersContext);

// Crea el Provider del Context
export const OrdersProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);

    // Función para obtener órdenes con paginación
    useEffect(() => {
        // Crear un query ordenado por fecha (asumiendo que tienes un campo 'createdAt')
        const ordersQuery = query(
            ordersCollectionRef,
            orderBy('createdAt', 'desc'), // Asegúrate de que tus documentos tengan este campo
            limit(100) // Limita a 100 órdenes inicialmente
        );

        const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
            try {
                const newOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Almacena en cache utilizando IndexedDB para acceso offline
                if (window.indexedDB) {
                    const request = indexedDB.open('ordersCache', 1);

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains('orders')) {
                            db.createObjectStore('orders', { keyPath: 'id' });
                        }
                    };

                    request.onsuccess = (event) => {
                        const db = event.target.result;
                        const transaction = db.transaction(['orders'], 'readwrite');
                        const store = transaction.objectStore('orders');

                        // Limpia el store y agrega nuevos datos
                        store.clear();
                        newOrders.forEach(order => {
                            store.add(order);
                        });
                    };
                }

                setOrders(newOrders);
                setLastFetched(new Date());
                setLoading(false);
                setError(null);
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error al obtener órdenes:", e);

                // Si hay un error, intenta cargar desde cache
                loadFromCache();
            }
        }, (error) => {
            setError(error);
            setLoading(false);
            console.error("Error en la suscripción:", error);

            // Si hay un error en la suscripción, intenta cargar desde cache
            loadFromCache();
        });

        // Limpia la suscripción cuando el componente se desmonta
        return () => unsubscribe();
    }, []);

    // Función para cargar datos desde cache en caso de error o modo offline
    const loadFromCache = () => {
        if (!window.indexedDB) return;

        const request = indexedDB.open('ordersCache', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['orders'], 'readonly');
            const store = transaction.objectStore('orders');
            const getAllRequest = store.getAll();

            getAllRequest.onsuccess = () => {
                if (getAllRequest.result.length > 0) {
                    setOrders(getAllRequest.result);
                    setLoading(false);
                }
            };
        };
    };

    // Memoizar las funciones CRUD para evitar re-renders innecesarios
    const addOrder = useCallback(async (newOrderData) => {
        try {
            // Agregar timestamp
            const orderWithTimestamp = {
                ...newOrderData,
                createdAt: new Date()
            };
            await addDoc(ordersCollectionRef, orderWithTimestamp);
        } catch (e) {
            setError(e);
            console.error("Error al agregar orden:", e);
        }
    }, []);

    const deleteOrder = useCallback(async (orderId) => {
        const orderDocRef = doc(db, 'orders', orderId);
        try {
            await deleteDoc(orderDocRef);
        } catch (e) {
            setError(e);
            console.error("Error al eliminar orden:", e);
        }
    }, []);

    const updateOrder = useCallback(async (orderId, updatedOrderData) => {
        const orderDocRef = doc(db, 'orders', orderId);
        try {
            await updateDoc(orderDocRef, updatedOrderData);
        } catch (e) {
            setError(e);
            console.error("Error al actualizar orden:", e);
        }
    }, []);

    const updateOrderState = useCallback(async (orderId, newState) => {
        const orderDocRef = doc(db, 'orders', orderId);
        try {
            await updateDoc(orderDocRef, {
                orderState: newState,
                lastUpdated: new Date()
            });
        } catch (e) {
            setError(e);
            console.error("Error al actualizar estado de orden:", e);
        }
    }, []);

    // Memoizar el value para evitar re-renders innecesarios
    const value = useMemo(() => ({
        orders,
        loading,
        error,
        lastFetched,
        addOrder,
        deleteOrder,
        updateOrder,
        updateOrderState
    }), [orders, loading, error, lastFetched, addOrder, deleteOrder, updateOrder, updateOrderState]);

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    );
};

export default OrdersProvider;