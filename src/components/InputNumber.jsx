// src/components/InputNumber.jsx
import React, { useState, useCallback, memo, useEffect } from 'react';
import {
    TextField,
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

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const validateValue = useCallback((val) => {
        const numericValue = Number(val);
        if (isNaN(numericValue)) return min;

        if (numericValue < min || numericValue > max) {
            setTooltipOpen(true);
            setTimeout(() => setTooltipOpen(false), 2000);
        }

        return Math.max(min, Math.min(max, numericValue));
    }, [min, max]);

    const handleIncrement = () => {
        const newValue = validateValue(Number(localValue) + step);
        setLocalValue(newValue);
        setValue(newValue);
    };

    const handleDecrement = () => {
        const newValue = validateValue(Number(localValue) - step);
        setLocalValue(newValue);
        setValue(newValue);
    };

    const handleChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setLocalValue('');
            return;
        }
        if (!isNaN(Number(val))) {
            setLocalValue(val);
        }
    };

    const handleBlur = (e) => {
        const validatedValue = validateValue(localValue === '' ? min : localValue);
        setLocalValue(validatedValue);
        setValue(validatedValue);
        if (onBlur) onBlur(e);
    };

    useEffect(() => {
        setError(errorMessage || Number(localValue) > max || Number(localValue) < min);
    }, [localValue, max, min, errorMessage]);

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
            <Box sx={{ display: 'flex', alignItems: 'center', width: fullWidth ? '100%' : width, ...sx }}>
                <Button
                    onClick={handleDecrement}
                    disabled={disabled || Number(localValue) <= min}
                    color={color}
                    size={size}
                    variant={variant}
                    sx={{ minWidth: '40px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
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
                    helperText={null}
                    inputProps={{
                        style: { textAlign: 'center', padding: size === 'small' ? '8px 4px' : '12px 8px' },
                        min,
                        max,
                        step
                    }}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        ...InputProps,
                        type: 'number',
                        endAdornment: InputProps?.endAdornment && (
                            <InputAdornment position="end">
                                {InputProps.endAdornment}
                            </InputAdornment>
                        )
                    }}
                    size={size}
                    color={color}
                    variant={variant}
                    sx={{
                        flex: 1,
                        mx: 0.5,
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
                    color={color}
                    size={size}
                    variant={variant}
                    sx={{ minWidth: '40px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                    <AddIcon fontSize="small" />
                </Button>
            </Box>

            {(error || helperText) && !isMobile && (
                <Typography
                    variant="caption"
                    color={error ? "error" : "text.secondary"}
                    sx={{ mt: 0.5, ml: 1.5 }}
                >
                    {error ? errorMessage : helperText}
                </Typography>
            )}
        </Tooltip>
    );
});

InputNumber.displayName = 'InputNumber';

export default InputNumber;
