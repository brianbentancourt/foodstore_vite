import React, { useState, useRef, useContext } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import { useProducts } from '../context/ProductsContext';

// Componente contenedor de búsqueda
const Search = styled('div')(({ theme, expanded }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    // El contenedor se expande simétricamente desde el centro
    width: expanded ? '240px' : '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up('sm')]: {
        width: expanded ? '300px' : '40px',
    },
}));

// Contenedor del icono de búsqueda
const SearchIconWrapper = styled('div')(({ theme }) => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '40px',
    pointerEvents: 'none',
    zIndex: 1,
}));

// Input de búsqueda estilizado
const StyledInputBase = styled(InputBase)(({ theme, expanded }) => ({
    color: 'inherit',
    width: '100%',
    height: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, expanded ? 5 : 1, 1, 4),
        transition: theme.transitions.create(['width', 'opacity']),
        width: expanded ? '100%' : '0',
        opacity: expanded ? 1 : 0,
    },
}));

function SearchBar() {
    const [isExpanded, setIsExpanded] = useState(false);
    const inputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const { searchTerm, setSearchTerm } = useProducts();

    const handleExpand = () => {
        setIsExpanded(true);
        // Pequeño retraso para permitir que la animación comience antes
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 50);
    };

    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClear = (e) => {
        e.stopPropagation(); // Evita que el clic propague al contenedor
        setSearchTerm('');
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Gestionar el cierre al perder el foco
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                if (!searchTerm) {
                    setIsExpanded(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [searchTerm]);

    return (
        <Search
            expanded={isExpanded}
            onClick={handleExpand}
            ref={searchContainerRef}
        >
            <SearchIconWrapper>
                <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Buscar…"
                inputProps={{ 'aria-label': 'search' }}
                inputRef={inputRef}
                value={searchTerm}
                onChange={handleInputChange}
                expanded={isExpanded}
            />
            {searchTerm && isExpanded && (
                <IconButton
                    aria-label="clear"
                    onClick={handleClear}
                    sx={{
                        position: 'absolute',
                        right: '4px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '32px',
                        height: '32px',
                        zIndex: 2,
                    }}
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
            )}
        </Search>
    );
}

export default SearchBar;