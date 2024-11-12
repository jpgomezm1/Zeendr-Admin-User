// PedidoCard.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  Grid,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const PedidoCard = ({
  pedido,
  productsMap,
  fadingOutPedidoId,
  onOpenPedidoDialog,
  handleEstadoChange,
  getRowClassName,
  getShortStatus,
  formatCurrency,
}) => (
  <Grid item xs={6} sm={6} md={4} lg={3} key={pedido.id}>
    <Card
      sx={{
        marginBottom: 2,
        border: '1px solid #e0e0e0', // Borde definido
        borderRadius: 4, // Esquinas más redondeadas
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        opacity: fadingOutPedidoId === pedido.id ? 0 : 1,
        transform:
          fadingOutPedidoId === pedido.id ? 'scale(0.95)' : 'scale(1)',
        '&:hover': {
          boxShadow: 4, // Sombra más pronunciada al hacer hover
        },
      }}
      className={getRowClassName(pedido.estado)}
    >
      <Box>
        {/* Nombre del Cliente */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccountCircleIcon sx={{ mr: 1, color: '#5E35B1' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#424242' }}>
            {pedido.nombre_completo}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Total de la Venta */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MonetizationOnIcon sx={{ mr: 1, color: '#388E3C' }} />
          <Typography variant="body2" sx={{ color: '#424242' }}>
            <strong>Total:</strong> {formatCurrency(pedido.total_venta)}
          </Typography>
        </Box>

        {/* Botones de Acción */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
          <Tooltip title="Ver Detalles del Pedido">
            <IconButton
              onClick={() => onOpenPedidoDialog(pedido)}
              size="large"
              sx={{
                color: '#1976D2',
                backgroundColor: '#E3F2FD',
                '&:hover': {
                  backgroundColor: '#BBDEFB',
                },
              }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          {pedido.estado !== 'Pedido Enviado' && (
            <Tooltip title="Marcar como Enviado">
              <IconButton
                onClick={() => handleEstadoChange(pedido.id)}
                size="large"
                sx={{
                  color: '#388E3C',
                  backgroundColor: '#E8F5E9',
                  '&:hover': {
                    backgroundColor: '#C8E6C9',
                  },
                }}
              >
                <CheckCircleIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Card>
  </Grid>
);

export default PedidoCard;
