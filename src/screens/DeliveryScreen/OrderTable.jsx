import React, { useState } from 'react';
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
  Typography,
  Button,
  useTheme,
  Grid,
  Chip,
  Card,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';
import PaymentMethodCell from './PaymentMethodCell';
import EstadoCell from './EstadoCell';
import ProductosCell from './ProductosCell';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import WhatsAppIcon from '@mui/icons-material/WhatsApp'; // Importamos el icono de WhatsApp
import CloseIcon from '@mui/icons-material/Close'; // Importamos el icono de cerrar
import MuiIconButton from '@mui/material/IconButton'; // Aseguramos que el nombre no choque con el import anterior
import { green } from '@mui/material/colors'; // Importamos los colores
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

// Función para obtener el estado abreviado en pantallas pequeñas
const getShortStatus = (estado) => {
  switch (estado) {
    case 'Pedido Recibido':
      return 'Recibido';
    case 'Pedido Confirmado':
      return 'Confirmado';
    case 'Pedido Enviado':
      return 'Enviado';
    case 'Pedido Rechazado':
      return 'Rechazado';
    default:
      return estado;
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

  // Estados para manejar el diálogo de confirmación
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCheckIconClick = (orderId) => {
    // Mostrar diálogo de confirmación
    setSelectedOrderId(orderId);
    setOpenConfirmDialog(true);
  };

  const handleConfirmChange = (notificarCliente) => {
    // Cambiar el estado del pedido a "Pedido Enviado"
    onEstadoChange(selectedOrderId, 'Pedido Enviado', notificarCliente);
    setOpenConfirmDialog(false);
    setSelectedOrderId(null);
  };

  const handleCancelChange = () => {
    setOpenConfirmDialog(false);
    setSelectedOrderId(null);
  };

  // Vista de tarjetas compactas con 2 cards por fila y botones en la parte inferior para pantallas pequeñas
  return (
    <Box sx={{ padding: 1 }}>
      {isSmallScreen ? (
        <Grid container spacing={1}>
          {orders.map((order) => (
            <Grid item xs={6} key={order.id}>
              <Card
                sx={{
                  marginBottom: 1,
                  boxShadow: 2,
                  borderRadius: 2,
                  padding: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
                className={getRowClassName(order.estado)}
              >
                <Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 'bold', textAlign: 'center' }}
                  >
                    {order.nombre_completo}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    sx={{ textAlign: 'center' }}
                  >
                    {order.fecha}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5 }}>
                    <Chip
                      label={getShortStatus(order.estado)} // Usamos el estado abreviado
                      color={
                        order.estado === 'Pedido Recibido'
                          ? 'default'
                          : order.estado === 'Pedido Confirmado'
                          ? 'primary'
                          : order.estado === 'Pedido Enviado'
                          ? 'success'
                          : 'error'
                      }
                      size="small"
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Grid container alignItems="center" justifyContent="center" spacing={1}>
                      <Grid item>
                        <Tooltip title="Ver Dirección">
                          <IconButton
                            onClick={() =>
                              onOpenDireccionDialog(order.direccion, order.detalles_direccion)
                            }
                            size="small"
                            sx={{ color: '#FE6401' }}
                          >
                            <LocationOnIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Ver Productos">
                          <IconButton
                            onClick={() => onOpenProductosDialog(order.productosDetalles)}
                            size="small"
                            sx={{ color: '#9040F5' }}
                          >
                            <ShoppingCartIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                    <strong>Total:</strong> {formatCurrency(order.total_venta)}
                  </Typography>
                </Box>
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>
                  <IconButton
                    onClick={() => onEditOrder(order.id)}
                    size="small"
                    sx={{ color: 'black' }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDeleteOrder(order.id)}
                    size="small"
                    sx={{ color: '#DC001A' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  {/* Agregamos el ícono de check si el pedido no ha sido enviado */}
                  {order.estado !== 'Pedido Enviado' && (
                    <IconButton
                      onClick={() => handleCheckIconClick(order.id)}
                      size="small"
                      sx={{ color: 'green' }}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // Vista de tabla para pantallas grandes
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
                        onClick={() =>
                          onOpenDireccionDialog(row.direccion, row.detalles_direccion)
                        }
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
                        <EstadoCell
                          value={row.estado}
                          row={row}
                          onEstadoChange={onEstadoChange}
                          isSmallScreen={false} // En pantallas grandes usamos el texto completo
                        />
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
      )}

      {/* Diálogo de confirmación con estilo personalizado */}
      <Dialog
        open={openConfirmDialog}
        onClose={handleCancelChange}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 0,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon sx={{ color: green[500], marginRight: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Notificar al Cliente
            </Typography>
          </Box>
          <MuiIconButton onClick={handleCancelChange} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 1 }}>
          <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
            ¿Deseas notificar al cliente por <strong>WhatsApp</strong> sobre el estado de su
            pedido?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <Button
            onClick={() => handleConfirmChange(false)}
            variant="outlined"
            sx={{
              borderColor: green[500],
              color: green[500],
              textTransform: 'none',
              borderRadius: '8px',
              paddingX: 3,
              '&:hover': {
                backgroundColor: green[50],
                borderColor: green[700],
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={() => handleConfirmChange(true)}
            variant="contained"
            sx={{
              backgroundColor: green[500],
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              paddingX: 3,
              '&:hover': {
                backgroundColor: green[700],
              },
            }}
          >
            Sí, Notificar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderTable;
