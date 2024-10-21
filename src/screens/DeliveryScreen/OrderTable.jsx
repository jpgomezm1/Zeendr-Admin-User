import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
  useMediaQuery,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme,
  Grid,
  Chip,
} from '@mui/material';
import { styled } from '@mui/system';
import PaymentMethodCell from './PaymentMethodCell';
import EstadoCell from './EstadoCell';
import ProductosCell from './ProductosCell';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import './DeliveryScreen.css';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const getRowClassName = (estado) => {
  switch (estado) {
    case 'Pedido Recibido':
      return 'pedido-recibido';
    case 'Pedido Confirmado':
      return 'pedido-confirmado';
    case 'Pedido Enviado':
      return 'pedido-enviado';
    case 'Pedido Rechazado':
      return 'pedido-rechazado';
    default:
      return '';
  }
};

const OrderTable = ({
  orders,
  onOpenComprobanteDialog,
  onEstadoChange,
  onOpenProductosDialog,
  onEditOrder,
  onDeleteOrder,
  onOpenDireccionDialog,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (isSmallScreen) {
    // Vista de tarjetas mejorada para pantallas pequeñas
    return (
      <Box sx={{ padding: 2 }}>
        {orders.map((order) => (
          <Card
            key={order.id}
            sx={{ marginBottom: 2, boxShadow: 3, borderRadius: 2 }}
            className={getRowClassName(order.estado)}
          >
            <CardContent>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {order.nombre_completo}
                  </Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <IconButton onClick={() => onEditOrder(order.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDeleteOrder(order.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={12}>
                  <Chip
                    label={order.estado}
                    color={
                      order.estado === 'Pedido Recibido'
                        ? 'default'
                        : order.estado === 'Pedido Confirmado'
                        ? 'primary'
                        : order.estado === 'Pedido Enviado'
                        ? 'success'
                        : 'error'
                    }
                    icon={<LocalShippingIcon />}
                    sx={{ marginBottom: 1 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Dirección:</strong>{' '}
                    <span
                      onClick={() =>
                        onOpenDireccionDialog(order.direccion, order.detalles_direccion)
                      }
                      style={{ textDecoration: 'underline', color: '#1976d2', cursor: 'pointer' }}
                    >
                      {order.direccion}
                    </span>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Fecha:</strong> {order.fecha}
                  </Typography>
                </Grid>
                {order.fecha_entrega && (
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>Entrega:</strong> {order.fecha_entrega}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Total Venta:</strong> {formatCurrency(order.total_venta)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={() => onOpenProductosDialog(order.productosDetalles)}
                    sx={{ textTransform: 'none', marginY: 1 }}
                  >
                    Ver Productos
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">
                    <strong>Método de Pago:</strong> {order.metodo_pago}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <EstadoCell value={order.estado} row={order} onEstadoChange={onEstadoChange} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  // Vista de tabla para pantallas grandes
  return (
    <Box sx={{ height: 'auto', width: '100%', padding: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer
          component={Paper}
          sx={{ marginTop: 3, borderRadius: 2, maxWidth: '100%', overflowX: 'auto' }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell>Dirección</StyledTableCell>
                <StyledTableCell>Fecha</StyledTableCell>
                <StyledTableCell>Entrega</StyledTableCell>
                <StyledTableCell>Rango Horas</StyledTableCell>
                <StyledTableCell>Total Productos</StyledTableCell>
                <StyledTableCell>Total Domicilio</StyledTableCell>
                <StyledTableCell>Total Venta</StyledTableCell>
                <StyledTableCell>Productos</StyledTableCell>
                <StyledTableCell>Método de Pago</StyledTableCell>
                <StyledTableCell>Estado</StyledTableCell>
                <StyledTableCell>Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow key={row.id} className={getRowClassName(row.estado)}>
                  <TableCell>{row.nombre_completo}</TableCell>
                  <TableCell
                    onClick={() => onOpenDireccionDialog(row.direccion, row.detalles_direccion)}
                    sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                  >
                    {row.direccion}
                  </TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.fecha_entrega || 'No programada'}</TableCell>
                  <TableCell>{row.rango_horas || 'No programado'}</TableCell>
                  <TableCell>{formatCurrency(row.total)}</TableCell>
                  <TableCell>{formatCurrency(row.total_domicilio)}</TableCell>
                  <TableCell>{formatCurrency(row.total_venta)}</TableCell>
                  <TableCell>
                    <ProductosCell
                      value={row.productos}
                      row={row}
                      onOpenDialog={onOpenProductosDialog}
                    />
                  </TableCell>
                  <TableCell>
                    <PaymentMethodCell
                      value={row.metodo_pago}
                      row={row}
                      onOpenDialog={onOpenComprobanteDialog}
                    />
                  </TableCell>
                  <TableCell>
                    <EstadoCell value={row.estado} row={row} onEstadoChange={onEstadoChange} />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => onEditOrder(row.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDeleteOrder(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default OrderTable;
