import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Stack, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from '@mui/material';
import OrderTable from './OrderTable';
import Modals from './Modals';
import SummaryCards from './SummaryCards';
import AddOrderDialog from './AddOrderDialog';
import EditOrderDialog from './EditOrderDialog';
import './DeliveryScreen.css';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { apiClient } from '../../apiClient';

import ordenesIcon from '../../assets/icons/ordenes.png';


const DeliveryScreen = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openComprobante, setOpenComprobante] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);
  const [selectedComprobante, setSelectedComprobante] = useState('');
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [openAddOrderDialog, setOpenAddOrderDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [openEditOrderDialog, setOpenEditOrderDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [openDireccionDialog, setOpenDireccionDialog] = useState(false); // Nuevo estado para manejar el diálogo de dirección
  const [selectedDireccion, setSelectedDireccion] = useState(''); // Estado para la dirección seleccionada
  const [selectedDetallesDireccion, setSelectedDetallesDireccion] = useState(''); // Estado para los detalles de la dirección seleccionada

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await apiClient.get('/pedidos');
        setOrders(ordersResponse.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsResponse = await apiClient.get('/productos');
        const productsMap = productsResponse.data.reduce((acc, product) => {
          acc[product.id] = product.nombre;
          return acc;
        }, {});
        setProductsMap(productsMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchOrders();
    fetchProducts();
  }, []);

  const handleOpenDireccionDialog = (direccion, detallesDireccion) => {
    setSelectedDireccion(direccion);
    setSelectedDetallesDireccion(detallesDireccion);
    setOpenDireccionDialog(true);
  };

  const handleCloseDireccionDialog = () => {
    setOpenDireccionDialog(false);
    setSelectedDireccion('');
    setSelectedDetallesDireccion('');
  };

  const handleOpenComprobanteDialog = (comprobanteUrl) => {
    setSelectedComprobante(comprobanteUrl);
    setOpenComprobante(true);
  };

  const handleCloseComprobanteDialog = () => {
    setOpenComprobante(false);
    setSelectedComprobante('');
  };

  const handleOpenProductosDialog = (productosDetalles) => {
    setSelectedProductos(productosDetalles);
    setOpenProductos(true);
  };

  const handleCloseProductosDialog = () => {
    setOpenProductos(false);
    setSelectedProductos([]);
  };

  const handleEstadoChange = async (orderId, newEstado) => {
    try {
      await apiClient.put(`/pedido/${orderId}/estado`, { estado: newEstado });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: newEstado } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleEditOrder = async (orderId) => {
    const orderToEdit = orders.find(order => order.id === orderId);
    setEditingOrder(orderToEdit);
    setOpenEditOrderDialog(true);
  };

  const handleDeleteOrder = async () => {
    if (deletingOrderId) {
      try {
        await apiClient.delete(`/pedido/${deletingOrderId}`);
        setOrders(prevOrders => prevOrders.filter(order => order.id !== deletingOrderId));
        setOpenDeleteDialog(false);  // Cerrar el diálogo después de eliminar
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const openDeleteConfirmation = (orderId) => {
    setDeletingOrderId(orderId);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const filteredOrders = selectedDate === 'Todas'
    ? orders
    : orders.filter((order) => {
        const orderDate = order.fecha_hora.split(' ')[0];
        const deliveryDate = order.fecha_entrega || orderDate;
        return selectedDate === orderDate || selectedDate === deliveryDate;
      });

  const transformOrders = filteredOrders
    .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
    .map((order) => {
      const productos = JSON.parse(order.productos);
      const productosDescripcion = productos
        .map((prod) => `${productsMap[prod.id]} (x${prod.quantity})`)
        .join(', ');

      const totalVenta = order.total_productos + order.costo_domicilio;

      return {
        id: order.id,
        nombre_completo: order.nombre_completo,
        numero_telefono: order.numero_telefono,
        direccion: order.direccion,
        detalles_direccion: order.detalles_direccion, // Incluir detalles de la dirección
        fecha: order.fecha_hora,
        fecha_entrega: order.fecha_entrega,
        rango_horas: order.rango_horas,
        productos: productosDescripcion,
        productosDetalles: productos,
        metodo_pago: order.metodo_pago,
        comprobante_pago: order.comprobante_pago,
        estado: order.estado,
        total: order.total_productos,
        total_con_descuento: order.total_con_descuento,
        total_domicilio: order.costo_domicilio,
        total_venta: totalVenta
      };
    });

  const summaryOrders = transformOrders.filter(order => ['Pedido Confirmado', 'Pedido Enviado'].includes(order.estado));

  const totalVentas = summaryOrders.reduce((sum, order) => sum + order.total_venta, 0);
  const totalProductos = summaryOrders.reduce((sum, order) => sum + order.total, 0);
  const totalDomicilios = summaryOrders.reduce((sum, order) => sum + order.total_domicilio, 0);
  const numeroPedidos = summaryOrders.length;

  const uniqueDates = ['Todas', ...new Set(
    orders.flatMap((order) => {
      const dates = [order.fecha_hora.split(' ')[0]];
      if (order.fecha_entrega && order.fecha_entrega !== 'No programada') {
        dates.push(order.fecha_entrega);
      }
      return dates;
    }).sort((a, b) => new Date(a) - new Date(b))
  )];

  const handleOpenAddOrderDialog = () => {
    setOpenAddOrderDialog(true);
  };

  const handleCloseAddOrderDialog = () => {
    setOpenAddOrderDialog(false);
  };

  const handleCloseEditOrderDialog = () => {
    setOpenEditOrderDialog(false);
    setEditingOrder(null);
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
     <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img src={ordenesIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2) }} />
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
           Aqui Aterrizan los Caprichos
        </Typography>
      </Box>
      <SummaryCards
        totalVentas={totalVentas}
        totalProductos={totalProductos}
        totalDomicilios={totalDomicilios}
        numeroPedidos={numeroPedidos}
      />
      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Fecha</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
          >
            {uniqueDates.map((date, index) => (
              <MenuItem key={index} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={handleOpenAddOrderDialog}
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: '#5E56FB',
            color: 'white',
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#7b45a1' }
          }}
          startIcon={<LocalShippingIcon />}
        >
          Agregar Pedido
        </Button>
      </Stack>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <OrderTable
          orders={transformOrders}
          onOpenComprobanteDialog={handleOpenComprobanteDialog}
          onEstadoChange={handleEstadoChange}
          onOpenProductosDialog={handleOpenProductosDialog}
          onEditOrder={handleEditOrder}
          onDeleteOrder={openDeleteConfirmation}
          onOpenDireccionDialog={handleOpenDireccionDialog} // Añadido para manejar el diálogo de dirección
        />
      )}
      <Modals
        openComprobante={openComprobante}
        openProductos={openProductos}
        handleCloseComprobanteDialog={handleCloseComprobanteDialog}
        handleCloseProductosDialog={handleCloseProductosDialog}
        selectedComprobante={selectedComprobante}
        selectedProductos={selectedProductos}
        productsMap={productsMap}
      />
      <AddOrderDialog 
        open={openAddOrderDialog} 
        handleClose={handleCloseAddOrderDialog} 
        productsMap={productsMap}
        setOrders={setOrders} 
        token={token}  // Pasar el token al componente AddOrderDialog
      />
      <EditOrderDialog 
        open={openEditOrderDialog} 
        order={editingOrder} 
        handleClose={handleCloseEditOrderDialog}
        setOrders={setOrders}
      />
      <Dialog
         open={openDeleteDialog}
         onClose={closeDeleteConfirmation}
         aria-labelledby="alert-dialog-title"
         aria-describedby="alert-dialog-description"
       >
         <DialogTitle id="alert-dialog-title">
           <Box display="flex" alignItems="center">
             <LocalShippingIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
             {"Confirmar Eliminación"}
           </Box>
         </DialogTitle>
         <DialogContent>
           <DialogContentText id="alert-dialog-description" sx={{ fontSize: '1rem' }}>
             ¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer.
           </DialogContentText>
         </DialogContent>
         <DialogActions>
           <Button onClick={closeDeleteConfirmation} sx={{ color: theme.palette.text.secondary }}>
             Cancelar
           </Button>
           <Button
             onClick={handleDeleteOrder}
             sx={{
               backgroundColor: theme.palette.error.main,
               color: theme.palette.getContrastText(theme.palette.error.main),
               '&:hover': {
                 backgroundColor: theme.palette.error.dark,
               },
             }}
             autoFocus
           >
             Eliminar
           </Button>
         </DialogActions>
       </Dialog>
      {/* Diálogo para mostrar detalles de la dirección */}
      <Dialog
  open={openDireccionDialog}
  onClose={handleCloseDireccionDialog}
  aria-labelledby="direccion-dialog-title"
  aria-describedby="direccion-dialog-description"
  PaperProps={{
    sx: {
      borderRadius: '16px',
      padding: 2,
      maxWidth: 500,
      backgroundColor: theme.palette.background.default,
    },
  }}
>
  <DialogTitle
    id="direccion-dialog-title"
    sx={{
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#801BF5',
      textAlign: 'center',
    }}
  >
    Detalles de la Dirección
  </DialogTitle>
  <DialogContent sx={{ marginTop: 2 }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        padding: 2,
        boxShadow: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Dirección:
      </Typography>
      <Typography variant="body1" sx={{ color: 'black' }}>
        {selectedDireccion}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
        Detalles:
      </Typography>
      <Typography variant="body1" sx={{  color: 'black' }}>
        {selectedDetallesDireccion || 'No hay detalles adicionales'}
      </Typography>
    </Box>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center', marginTop: 2 }}>
    <Button
      onClick={handleCloseDireccionDialog}
      sx={{
        backgroundColor: '#801BF5',
        color: theme.palette.getContrastText(theme.palette.primary.main),
        '&:hover': {
          backgroundColor: theme.palette.primary.dark,
        },
        borderRadius: '8px',
        paddingX: 3,
        paddingY: 1,
      }}
    >
      Cerrar
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
};

export default DeliveryScreen;


