import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Box } from '@mui/material';

function MapWithMUI({ initialLng = -57.9973333, initialLat = -32.316075, initialZoom = 9 }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        if (map.current || !mapContainer.current) return;

        const initializeMap = () => {
            try {
                map.current = new maplibregl.Map({
                    container: mapContainer.current,
                    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${import.meta.env.REACT_APP_MAPTILER_KEY}`,
                    center: [initialLng, initialLat],
                    zoom: initialZoom
                });

                map.current.on('load', () => {
                    map.current.resize();
                    setMapLoaded(true);
                });
            } catch (error) {
                console.error("Error initializing map:", error);
            }
        };

        // Dar tiempo al DOM para renderizar completamente
        const timeoutId = setTimeout(initializeMap, 300);

        return () => {
            clearTimeout(timeoutId);
            map.current?.remove();
        };
    }, [initialLng, initialLat, initialZoom]);

    // Resize map on window resize
    useEffect(() => {
        if (!map.current) return;

        const handleResize = () => map.current.resize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [mapLoaded]);

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '90vh',
                '& .maplibregl-canvas': {
                    width: '100% !important',
                    height: '100% !important'
                }
            }}
        >
            <Box
                ref={mapContainer}
                sx={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%'
                }}
            />
        </Box>
    );
}

export default MapWithMUI;