import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';
import { apiClient } from '../../apiClient';

function DomicilioPrice() {
  const [domicilioPrice, setDomicilioPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchDomicilioPrice = async () => {
      try {
        const response = await apiClient.get('/domicilio-price', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDomicilioPrice(response.data.price || '');
      } catch (error) {
        console.error('Error fetching domicilio price:', error);
        setErrorMessage('Error al obtener el precio del domicilio.');
      }
    };

    fetchDomicilioPrice();
  }, [token]);

  const handlePriceChange = (event) => {
    setDomicilioPrice(event.target.value);
  };

  const handleSavePrice = async () => {
    setIsLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      await apiClient.post(
        '/domicilio-price',
        { price: domicilioPrice },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMessage('Precio del domicilio actualizado con éxito.');
    } catch (error) {
      console.error('Error saving domicilio price:', error);
      setErrorMessage('Error al guardar el precio del domicilio.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 600,
        margin: '0 auto',
        borderRadius: 3,
        backgroundColor: '#f9f9ff',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
          Definir Precio del Domicilio
        </Typography>
      </Box>
      <TextField
        label="Precio del Domicilio"
        variant="outlined"
        fullWidth
        value={domicilioPrice}
        onChange={handlePriceChange}
        sx={{ marginBottom: 3 }}
        type="number"
        InputProps={{
          startAdornment: <Typography variant="body1" sx={{ mr: 1 }}>$</Typography>
        }}
      />
      <Button
        variant="contained"
        onClick={handleSavePrice}
        disabled={isLoading}
        sx={{
          borderRadius: '8px',
          paddingX: 4,
          paddingY: 1.5,
          bgcolor: '#5E55FE',
          '&:hover': {
            bgcolor: '#4b3ccc',
          },
        }}
      >
        {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Guardar'}
      </Button>
      <Snackbar
        open={!!successMessage || !!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={successMessage ? 'success' : 'error'}
          sx={{ width: '100%' }}
        >
          {successMessage || errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default DomicilioPrice;


