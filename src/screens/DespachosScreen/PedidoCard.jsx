// PedidoCard.jsx
import React from 'react';
import {
  Typography,
  Box,
  Card,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  Divider,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const PedidoCard = ({
  pedido,
  productsMap,
  fadingOutPedidoId,
  onOpenDireccionDialog,
  onOpenProductosDialog,
  handleEstadoChange,
  getRowClassName,
  getShortStatus,
  formatCurrency,
}) => (
  <Grid item xs={6} sm={6} md={4} lg={3} key={pedido.id}>
    <Card
      sx={{
        marginBottom: 2,
        boxShadow: 2,
        borderRadius: 2,
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
          boxShadow: 6,
        },
      }}
      className={getRowClassName(pedido.estado)}
    >
      <Box>
        {/* Nombre del Cliente */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccountCircleIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {pedido.nombre_completo}
          </Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Total de la Venta */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <MonetizationOnIcon sx={{ mr: 1, color: 'green' }} />
          <Typography variant="body2">
            <strong>Total:</strong> {formatCurrency(pedido.total_venta)}
          </Typography>
        </Box>

        {/* Botones de Acción */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
          <Tooltip title="Ver Información">
            <IconButton
              onClick={() =>
                onOpenDireccionDialog(
                  pedido.direccion,
                  pedido.detalles_direccion,
                  pedido.numero_telefono
                )
              }
              size="small"
              sx={{ color: '#FE6401' }}
            >
              <InfoIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Ver Productos">
            <IconButton
              onClick={() => onOpenProductosDialog(pedido.productos)}
              size="small"
              sx={{ color: '#9040F5' }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Tooltip>
          {pedido.estado !== 'Pedido Enviado' && (
            <Tooltip title="Marcar como Enviado">
              <IconButton
                onClick={() => handleEstadoChange(pedido.id)}
                size="small"
                sx={{ color: 'green' }}
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
