// src/components/InputNumber.jsx
import React, { useState, useCallback, memo, useEffect } from 'react';
import {
    TextField,
    ButtonGroup,
    Button,
    Box,
    Typography,
    useTheme,
    useMediaQuery,
    InputAdornment,
    Tooltip,
    Fade
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const InputNumber = memo(({
    value = 0,
    setValue = () => { },
    label = '',
    enableSm = true,
    fullWidth = false,
    width,
    min = 0,
    max = 50,
    step = 1,
    disabled = false,
    errorMessage,
    helperText,
    size = 'medium',
    color = 'primary',
    variant = 'outlined',
    showTooltip = true,
    disableInput = false,
    onBlur,
    onFocus,
    InputProps,
    sx
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [localValue, setLocalValue] = useState(value);
    const [error, setError] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(false);

    // Sincronizar valor local con el valor de prop
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    // Validación y límites
    const validateValue = useCallback((val) => {
        const numericValue = Number(val);

        // Verificar si es un número válido
        if (isNaN(numericValue)) {
            return min;
        }

        // Verificar límites
        if (numericValue < min) {
            setTooltipOpen(true);
            setTimeout(() => setTooltipOpen(false), 2000);
            return min;
        }

        if (numericValue > max) {
            setTooltipOpen(true);
            setTimeout(() => setTooltipOpen(false), 2000);
            return max;
        }

        return numericValue;
    }, [min, max]);

    // Manejadores de eventos
    const handleIncrement = useCallback(() => {
        const newValue = validateValue(Number(localValue) + step);
        setLocalValue(newValue);
        setValue(newValue);
    }, [localValue, step, validateValue, setValue]);

    const handleDecrement = useCallback(() => {
        const newValue = validateValue(Number(localValue) - step);
        setLocalValue(newValue);
        setValue(newValue);
    }, [localValue, step, validateValue, setValue]);

    const handleChange = useCallback((e) => {
        const val = e.target.value;

        // Permitir campo vacío para mejor UX, pero no propagar hacia arriba
        if (val === '') {
            setLocalValue('');
            return;
        }

        // Si el valor es numérico, validarlo
        if (!isNaN(Number(val))) {
            setLocalValue(val);
        }
    }, []);

    const handleBlur = useCallback((e) => {
        // Al perder el foco, validar y propagar el valor final
        const validatedValue = validateValue(localValue === '' ? min : localValue);
        setLocalValue(validatedValue);
        setValue(validatedValue);

        // Llamar al onBlur personalizado si existe
        if (onBlur) onBlur(e);
    }, [localValue, validateValue, setValue, min, onBlur]);

    // Calcular si estamos en los límites para mostrar información visual
    useEffect(() => {
        setError(errorMessage || Number(localValue) > max || Number(localValue) < min);
    }, [localValue, max, min, errorMessage]);

    // Para dispositivos móviles o cuando enableSm es verdadero
    if (isMobile && enableSm) {
        return (
            <TextField
                label={label}
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={onFocus}
                type="number"
                disabled={disabled}
                error={!!error}
                helperText={error ? errorMessage : helperText}
                InputProps={{
                    inputProps: { min, max, step },
                    ...InputProps
                }}
                size={size}
                color={color}
                variant={variant}
                fullWidth={fullWidth}
                sx={{
                    width: fullWidth ? '100%' : width,
                    ...sx
                }}
            />
        );
    }

    // Versión con botones para incrementar/decrementar
    return (
        <Tooltip
            title={
                Number(localValue) >= max
                    ? `Valor máximo: ${max}`
                    : Number(localValue) <= min
                        ? `Valor mínimo: ${min}`
                        : ''
            }
            open={showTooltip && tooltipOpen}
            placement="top"
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 300 }}
        >
            <Box>
                <ButtonGroup
                    size={size}
                    variant={variant}
                    color={color}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    sx={{
                        width: fullWidth ? '100%' : width,
                        ...sx
                    }}
                >
                    <Button
                        onClick={handleDecrement}
                        disabled={disabled || Number(localValue) <= min}
                        sx={{
                            minWidth: '40px',
                            borderTopRightRadius: 0,
                            borderBottomRightRadius: 0
                        }}
                    >
                        <RemoveIcon fontSize="small" />
                    </Button>

                    <TextField
                        label={label}
                        value={localValue}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onFocus={onFocus}
                        disabled={disabled || disableInput}
                        error={!!error}
                        helperText={error ? errorMessage : helperText}
                        inputProps={{
                            style: { textAlign: 'center', padding: size === 'small' ? '8px 4px' : '12px 8px' },
                            min,
                            max,
                            step
                        }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            ...InputProps,
                            type: 'number',
                            endAdornment: InputProps?.endAdornment && (
                                <InputAdornment position="end">
                                    {InputProps.endAdornment}
                                </InputAdornment>
                            )
                        }}
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 0,
                                '& fieldset': {
                                    borderRadius: 0
                                }
                            },
                            '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                                '-webkit-appearance': 'none',
                                margin: 0,
                            },
                            '& input[type=number]': {
                                '-moz-appearance': 'textfield',
                            },
                        }}
                    />

                    <Button
                        onClick={handleIncrement}
                        disabled={disabled || Number(localValue) >= max}
                        sx={{
                            minWidth: '40px',
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                        }}
                    >
                        <AddIcon fontSize="small" />
                    </Button>
                </ButtonGroup>

                {/* Si hay un mensaje de error o texto de ayuda y no estamos mostrándolo en el TextField */}
                {(error || helperText) && !isMobile && (
                    <Typography
                        variant="caption"
                        color={error ? "error" : "text.secondary"}
                        sx={{ mt: 0.5, ml: 1.5 }}
                    >
                        {error ? errorMessage : helperText}
                    </Typography>
                )}
            </Box>
        </Tooltip>
    );
});

// Propiedad displayName para mejor depuración en React DevTools
InputNumber.displayName = 'InputNumber';

export default InputNumber;