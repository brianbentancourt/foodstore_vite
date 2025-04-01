// src/components/LoginModal.jsx
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    IconButton,
    Box,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../context/AuthContext';

function LoginModal({ open, onClose }) {
    const { signInWithGoogle } = useAuth();

    const handleGoogleLogin = async () => {
        try {
            await signInWithGoogle();
            onClose(); // Cerrar el modal después de iniciar sesión
        } catch (error) {
            console.error("Error en el inicio de sesión:", error);
            // Aquí podrías mostrar un mensaje de error
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                Iniciar Sesión
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 2
                }}>
                    <Typography variant="body1" sx={{ mb: 3 }}>
                        Inicia sesión para acceder a todas las funcionalidades
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleLogin}
                        sx={{ width: '80%', py: 1 }}
                    >
                        Continuar con Google
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default LoginModal;