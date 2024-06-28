import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Select, MenuItem, FormControl, InputLabel, Stack, Button } from '@mui/material';
import OrderTable from './OrderTable';
import Modals from './Modals';
import SummaryCards from './SummaryCards';
import AddOrderDialog from './AddOrderDialog';
import './DeliveryScreen.css';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { apiClient } from '../../apiClient';  // Importa el apiClient configurado

const DeliveryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openComprobante, setOpenComprobante] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);
  const [selectedComprobante, setSelectedComprobante] = useState('');
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [openAddOrderDialog, setOpenAddOrderDialog] = useState(false);
  const token = useSelector((state) => state.auth.token);

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
        fecha: order.fecha_hora,
        fecha_entrega: order.fecha_entrega,
        rango_horas: order.rango_horas,
        productos: productosDescripcion,
        productosDetalles: productos,
        metodo_pago: order.metodo_pago,
        comprobante_pago: order.comprobante_pago,
        estado: order.estado,
        total: order.total_productos,
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

  return (
    <Box sx={{ p: 4 }}>
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
    </Box>
  );
};

export default DeliveryScreen;
