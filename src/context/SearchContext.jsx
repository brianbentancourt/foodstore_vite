// src/context/SearchContext.jsx
import React, { createContext, useState, useCallback, useContext } from 'react';


export const SearchContext = createContext();

export const useSearch = () => useContext(SearchContext);

export const SearchProvider = ({ children }) => {
    const [searchText, setSearchText] = useState('');

    // Función para actualizar el searchText
    const updateSearchText = useCallback((newSearchText) => {
        setSearchText(newSearchText);
        // Aquí podrías disparar la lógica para la consulta a Firebase (TODO)
        console.log('Texto de búsqueda actualizado:', newSearchText);
    }, []);

    // Función para limpiar el searchText
    const clearSearchText = useCallback(() => {
        setSearchText('');
        // Aquí podrías disparar la lógica para limpiar los resultados de la búsqueda (TODO)
        console.log('Texto de búsqueda limpiado');
    }, []);

    return (
        <SearchContext.Provider value={{ searchText, updateSearchText, clearSearchText }}>
            {children}
        </SearchContext.Provider>
    );
};