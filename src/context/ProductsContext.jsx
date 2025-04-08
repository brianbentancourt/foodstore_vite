// src/context/ProductsContext.jsx
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import firebaseApp from '../firebase/firebaseConfig';
import {
    getFirestore,
    collection,
    addDoc,
    doc,
    deleteDoc,
    updateDoc,
    onSnapshot,
    query,
    orderBy,
    limit,
    where
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Inicializa Firestore y Storage
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const productsCollectionRef = collection(db, 'products');

// Crea el Context
const ProductsContext = createContext();

// Hook personalizado para usar el contexto
export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};

// Provider del Context
export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Obtener productos y almacenarlos en caché
    useEffect(() => {
        const productsQuery = query(
            productsCollectionRef,
            orderBy('name', 'desc'),
            limit(200)
        );

        const unsubscribe = onSnapshot(productsQuery, (snapshot) => {
            try {
                const newProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Extraer categorías únicas
                const uniqueCategories = [...new Set(newProducts.map(product => product.category))].filter(Boolean);
                setCategories(uniqueCategories);

                // Almacenar en IndexedDB para acceso offline
                if (window.indexedDB) {
                    const request = indexedDB.open('productsCache', 1);

                    request.onupgradeneeded = (event) => {
                        const db = event.target.result;
                        if (!db.objectStoreNames.contains('products')) {
                            db.createObjectStore('products', { keyPath: 'id' });
                        }
                        if (!db.objectStoreNames.contains('categories')) {
                            db.createObjectStore('categories', { keyPath: 'name' });
                        }
                    };

                    request.onsuccess = (event) => {
                        const db = event.target.result;
                        const transaction = db.transaction(['products', 'categories'], 'readwrite');
                        const productsStore = transaction.objectStore('products');
                        const categoriesStore = transaction.objectStore('categories');

                        // Limpiar y agregar productos
                        productsStore.clear();
                        newProducts.forEach(product => {
                            productsStore.add(product);
                        });

                        // Limpiar y agregar categorías
                        categoriesStore.clear();
                        uniqueCategories.forEach(category => {
                            categoriesStore.add({ name: category });
                        });
                    };
                }

                setProducts(newProducts);
                setFilteredProducts(newProducts);
                setLastFetched(new Date());
                setLoading(false);
                setError(null);
            } catch (e) {
                setError(e);
                setLoading(false);
                console.error("Error al obtener productos:", e);

                // Intentar cargar desde caché
                loadFromCache();
            }
        }, (error) => {
            setError(error);
            setLoading(false);
            console.error("Error en la suscripción de productos:", error);

            // Intentar cargar desde caché
            loadFromCache();
        });

        return () => unsubscribe();
    }, []);

    // Cargar desde caché si hay error o no hay conexión
    const loadFromCache = useCallback(() => {
        if (!window.indexedDB) return;

        const request = indexedDB.open('productsCache', 1);

        request.onsuccess = (event) => {
            const db = event.target.result;

            // Cargar productos
            const productsTx = db.transaction(['products'], 'readonly');
            const productsStore = productsTx.objectStore('products');
            const getAllProductsRequest = productsStore.getAll();

            getAllProductsRequest.onsuccess = () => {
                if (getAllProductsRequest.result.length > 0) {
                    setProducts(getAllProductsRequest.result);
                    setFilteredProducts(getAllProductsRequest.result);
                    setLoading(false);
                }
            };

            // Cargar categorías
            const categoriesTx = db.transaction(['categories'], 'readonly');
            const categoriesStore = categoriesTx.objectStore('categories');
            const getAllCategoriesRequest = categoriesStore.getAll();

            getAllCategoriesRequest.onsuccess = () => {
                if (getAllCategoriesRequest.result.length > 0) {
                    setCategories(getAllCategoriesRequest.result.map(cat => cat.name));
                }
            };
        };
    }, []);

    // Filtrar productos por categoría
    useEffect(() => {
        if (selectedCategory === 'all') {
            setFilteredProducts(products);
        } else {
            const filtered = products.filter(product => product.category === selectedCategory);
            setFilteredProducts(filtered);
        }
    }, [selectedCategory, products]);

    // Función para subir imagen y obtener URL
    const uploadProductImage = useCallback(async (file, productId) => {
        if (!file) return null;

        const fileExtension = file.name.split('.').pop();
        const fileName = `${productId}_${Date.now()}.${fileExtension}`;
        const storageRef = ref(storage, `product_images/${fileName}`);

        try {
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            return downloadURL;
        } catch (e) {
            console.error("Error al subir imagen:", e);
            setError(e);
            return null;
        }
    }, []);

    // CRUD Operations
    const addProduct = useCallback(async (newProductData, imageFile) => {
        try {
            // Generar ID temporal para referencia de imagen
            const tempId = Math.random().toString(36).substring(2, 15);

            // Subir imagen si existe
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile, tempId);
            }

            // Agregar producto con timestamp e imagen URL
            const productWithDetails = {
                ...newProductData,
                createdAt: new Date(),
                ...(imageUrl && { src: imageUrl })
            };

            await addDoc(productsCollectionRef, productWithDetails);
            return true;
        } catch (e) {
            setError(e);
            console.error("Error al agregar producto:", e);
            return false;
        }
    }, [uploadProductImage]);

    const deleteProduct = useCallback(async (productId) => {
        const productDocRef = doc(db, 'products', productId);
        try {
            await deleteDoc(productDocRef);
            return true;
        } catch (e) {
            setError(e);
            console.error("Error al eliminar producto:", e);
            return false;
        }
    }, []);

    const updateProduct = useCallback(async (productId, updatedData, imageFile) => {
        const productDocRef = doc(db, 'products', productId);
        try {
            // Subir nueva imagen si existe
            let imageUrl = null;
            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile, productId);
            }

            // Actualizar producto
            const dataToUpdate = {
                ...updatedData,
                lastUpdated: new Date(),
                ...(imageUrl && { src: imageUrl })
            };

            await updateDoc(productDocRef, dataToUpdate);
            return true;
        } catch (e) {
            setError(e);
            console.error("Error al actualizar producto:", e);
            return false;
        }
    }, [uploadProductImage]);

    const updateProductStock = useCallback(async (productId, inStock) => {
        const productDocRef = doc(db, 'products', productId);
        try {
            await updateDoc(productDocRef, {
                stock: inStock,
                lastUpdated: new Date()
            });
            return true;
        } catch (e) {
            setError(e);
            console.error("Error al actualizar stock:", e);
            return false;
        }
    }, []);

    // Función para buscar productos
    const searchProducts = useCallback((searchTerm) => {
        if (!searchTerm.trim()) {
            // Si no hay término de búsqueda, mostrar todos o filtrar por categoría
            if (selectedCategory === 'all') {
                setFilteredProducts(products);
            } else {
                setFilteredProducts(products.filter(product =>
                    product.category === selectedCategory
                ));
            }
            return;
        }

        const term = searchTerm.toLowerCase().trim();
        const results = products.filter(product => {
            // Buscar en nombre, descripción, ingredientes
            const nameMatch = product.name?.toLowerCase().includes(term);
            const descMatch = product.description?.toLowerCase().includes(term);
            const ingrMatch = product.ingredients?.toLowerCase().includes(term);

            // Si hay categoría seleccionada, aplicar ese filtro también
            if (selectedCategory !== 'all') {
                return (nameMatch || descMatch || ingrMatch) && product.category === selectedCategory;
            }

            return nameMatch || descMatch || ingrMatch;
        });

        setFilteredProducts(results);
    }, [products, selectedCategory]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchProducts(searchTerm);
        }, 300); // 300ms de delay, ajustable

        return () => clearTimeout(delayDebounce); // Limpia el timeout si searchTerm cambia antes del delay
    }, [searchTerm, searchProducts]);


    // Memoizar el value para evitar re-renders innecesarios
    const value = useMemo(() => ({
        products,
        filteredProducts,
        categories,
        loading,
        error,
        lastFetched,
        selectedCategory,
        searchTerm,
        setSearchTerm,
        setSelectedCategory,
        addProduct,
        deleteProduct,
        updateProduct,
        updateProductStock,
        searchProducts
    }), [
        products,
        filteredProducts,
        categories,
        loading,
        error,
        lastFetched,
        selectedCategory,
        searchTerm,
        setSearchTerm,
        addProduct,
        deleteProduct,
        updateProduct,
        updateProductStock,
        searchProducts
    ]);

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    );
};

export default ProductsProvider;