import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'; // Icono de transferencia
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'; // Icono de efectivo
import PaymentIcon from '@mui/icons-material/Payment'; // Icono de pasarela de pagos
import LockIcon from '@mui/icons-material/Lock'; // Icono para 'Coming Soon'
import { apiClient } from '../../apiClient'; // Asegúrate de tener configurado el apiClient

// Definir colores primarios
const primaryColor = '#5E55FE';
const selectedColor = '#28a745'; // Verde para indicar selección

// Estilos personalizados
const MethodCard = styled(Paper)(({ selected }) => ({
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: selected ? `2px solid ${selectedColor}` : '2px solid transparent',
  transition: 'border 0.3s ease-in-out',
  cursor: 'pointer',
  '&:hover': {
    border: `2px solid ${primaryColor}`,
  },
}));

const ComingSoonCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#f0f0f0',
  borderRadius: theme.spacing(1),
  border: `2px dashed ${primaryColor}`,
  opacity: 0.7,
  cursor: 'not-allowed',
}));

const MetodosPago = () => {
  const [metodosPago, setMetodosPago] = useState({
    transferencia: true,  // Transferencia habilitada por defecto
    efectivo: false,      // Deshabilitado por defecto
    pasarela: false,      // Pasarela deshabilitada por defecto (y coming soon)
  });

  // Cargar los métodos de pago desde el backend
  useEffect(() => {
    const fetchMetodosPago = async () => {
      try {
        const response = await apiClient.get('/metodos_pago');
        const metodos = response.data.reduce((acc, metodo) => {
          acc[metodo.nombre.toLowerCase()] = metodo.habilitado;
          return acc;
        }, {});
        setMetodosPago((prevState) => ({ ...prevState, ...metodos }));
      } catch (error) {
        console.error('Error fetching metodos de pago:', error);
      }
    };
    
    fetchMetodosPago();
  }, []);

  // Actualizar el estado de un método de pago en el backend
  const toggleMethod = async (methodName) => {
    try {
      const newState = !metodosPago[methodName];
      setMetodosPago((prevState) => ({
        ...prevState,
        [methodName]: newState,
      }));

      // Enviar al backend
      await apiClient.put(`/metodos_pago/${methodName.charAt(0).toUpperCase() + methodName.slice(1)}`, {
        habilitado: newState,
      });
    } catch (error) {
      console.error('Error updating metodo de pago:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Métodos de Pago Disponibles</Typography>

      <Grid container spacing={2}>
        {/* Opción de Transferencia */}
        <Grid item xs={12} md={6}>
          <MethodCard
            selected={metodosPago.transferencia}
            onClick={() => toggleMethod('transferencia')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccountBalanceIcon sx={{ color: metodosPago.transferencia ? selectedColor : primaryColor, fontSize: 40, mr: 2 }} />
              <Typography variant="h6" sx={{ color: metodosPago.transferencia ? selectedColor : '#333' }}>
                Transferencia Bancaria
              </Typography>
            </Box>
            <IconButton>
              {metodosPago.transferencia ? <AttachMoneyIcon sx={{ color: selectedColor }} /> : <AttachMoneyIcon />}
            </IconButton>
          </MethodCard>
        </Grid>

        {/* Opción de Efectivo */}
        <Grid item xs={12} md={6}>
          <MethodCard
            selected={metodosPago.efectivo}
            onClick={() => toggleMethod('efectivo')}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AttachMoneyIcon sx={{ color: metodosPago.efectivo ? selectedColor : primaryColor, fontSize: 40, mr: 2 }} />
              <Typography variant="h6" sx={{ color: metodosPago.efectivo ? selectedColor : '#333' }}>
                Efectivo
              </Typography>
            </Box>
            <IconButton>
              {metodosPago.efectivo ? <AttachMoneyIcon sx={{ color: selectedColor }} /> : <AttachMoneyIcon />}
            </IconButton>
          </MethodCard>
        </Grid>

        {/* Opción de Pasarela de Pagos (Coming Soon) */}
        <Grid item xs={12}>
          <ComingSoonCard>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ color: primaryColor, fontSize: 40, mr: 2 }} />
              <Typography variant="h6" sx={{ color: primaryColor, fontWeight: 'bold' }}>
                Pasarela de Pagos (Coming Soon)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Próximamente: pagos con tarjetas y más
              </Typography>
              <LockIcon sx={{ color: primaryColor }} />
            </Box>
          </ComingSoonCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MetodosPago;
