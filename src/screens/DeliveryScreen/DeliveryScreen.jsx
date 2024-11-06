import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import OrderTable from './OrderTable';
import Modals from './Modals';
import SummaryCards from './SummaryCards';
import AddOrderDialog from './AddOrderDialog';
import EditOrderDialog from './EditOrderDialog';
import './DeliveryScreen.css';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';
import { useSelector } from 'react-redux';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { apiClient } from '../../apiClient';
import CargaMasivaPedidosDialog from './CargaMasivaPedidosDialog';

import ordenesIcon from '../../assets/icons/ordenes.png';

// Extender dayjs con los plugins necesarios
dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const DeliveryScreen = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // Detecta pantallas pequeñas
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [openComprobante, setOpenComprobante] = useState(false);
  const [openProductos, setOpenProductos] = useState(false);
  const [selectedComprobante, setSelectedComprobante] = useState('');
  const [selectedProductos, setSelectedProductos] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Selección por defecto: mes actual
  const [selectedWeek, setSelectedWeek] = useState(dayjs().isoWeek()); // Selección por defecto: semana actual
  const [selectedDate, setSelectedDate] = useState(''); // Deshabilitado inicialmente
  const [weeksInMonth, setWeeksInMonth] = useState([]);
  const [openAddOrderDialog, setOpenAddOrderDialog] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [openEditOrderDialog, setOpenEditOrderDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const [openDireccionDialog, setOpenDireccionDialog] = useState(false);
  const [selectedDireccion, setSelectedDireccion] = useState('');
  const [selectedDetallesDireccion, setSelectedDetallesDireccion] = useState('');
  const [openCargaMasiva, setOpenCargaMasiva] = useState(false);

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

  // Función para obtener las semanas dentro del mes seleccionado
  const getWeeksInMonth = (month, year) => {
    const weeks = [];
    let firstDayOfMonth = dayjs().year(year).month(month - 1).startOf('month');
    let lastDayOfMonth = dayjs().year(year).month(month - 1).endOf('month');

    // Comenzamos desde el inicio de la primera semana que incluye el mes
    let currentWeekStart = firstDayOfMonth.startOf('isoWeek');

    while (currentWeekStart.isBefore(lastDayOfMonth)) {
      const weekNumber = currentWeekStart.isoWeek();
      const weekStart = currentWeekStart;
      const weekEnd = currentWeekStart.endOf('isoWeek');

      // Verificamos si la semana se solapa con el mes seleccionado
      if (weekEnd.isBefore(firstDayOfMonth)) {
        // La semana termina antes de que empiece el mes, continuamos
      } else if (weekStart.isAfter(lastDayOfMonth)) {
        // La semana empieza después de que termina el mes, rompemos el ciclo
        break;
      } else {
        weeks.push({
          weekNumber,
          weekRange: `${weekStart.format('D MMM')} - ${weekEnd.format('D MMM')}`,
          weekStart,
          weekEnd,
        });
      }

      currentWeekStart = currentWeekStart.add(1, 'week');
    }

    return weeks;
  };

  useEffect(() => {
    const year = dayjs().year(); // Puedes hacer que el año sea seleccionable si es necesario
    const weeks = getWeeksInMonth(selectedMonth, year);
    setWeeksInMonth(weeks);

    // Verificar si la semana actual está dentro del mes seleccionado
    const currentWeek = dayjs().isoWeek();
    const currentWeekInMonth = weeks.find((week) => week.weekNumber === currentWeek);
    if (currentWeekInMonth) {
      setSelectedWeek(currentWeek);
    } else {
      setSelectedWeek(''); // O puedes seleccionar la primera semana por defecto
    }

    setSelectedDate(''); // Resetea la fecha seleccionada cuando cambia el mes
  }, [selectedMonth]);

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

  const handleEstadoChange = async (orderId, newEstado, notificarCliente = true) => {
    try {
      await apiClient.put(`/pedido/${orderId}/estado`, { estado: newEstado, notificar_cliente: notificarCliente });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, estado: newEstado } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Función para abrir el diálogo
  const handleOpenCargaMasiva = () => {
    setOpenCargaMasiva(true);
  };

  // Función para cerrar el diálogo
  const handleCloseCargaMasiva = () => {
    setOpenCargaMasiva(false);
  };

  const handleEditOrder = async (orderId) => {
    const orderToEdit = orders.find((order) => order.id === orderId);
    setEditingOrder(orderToEdit);
    setOpenEditOrderDialog(true);
  };

  const handleDeleteOrder = async () => {
    if (deletingOrderId) {
      try {
        await apiClient.delete(`/pedido/${deletingOrderId}`);
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== deletingOrderId));
        setOpenDeleteDialog(false);
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedWeek(''); // Resetea la semana seleccionada cuando cambia el mes
    setSelectedDate(''); // Resetea la fecha seleccionada cuando cambia el mes
  };

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    setSelectedDate(''); // Resetea la fecha seleccionada cuando cambia la semana
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Generar las fechas únicas basadas en el mes y la semana seleccionados
  const uniqueDates = ['Todas', ...new Set(
    orders
      .filter((order) => {
        const orderDate = dayjs(order.fecha_hora.split(' ')[0]);
        const deliveryDate = order.fecha_entrega ? dayjs(order.fecha_entrega) : orderDate;

        const isMonthMatch = orderDate.month() + 1 === selectedMonth;

        let isWeekMatch = true;
        if (selectedWeek !== '') {
          isWeekMatch =
            orderDate.isoWeek() === selectedWeek ||
            deliveryDate.isoWeek() === selectedWeek;
        }

        return isMonthMatch && isWeekMatch;
      })
      .flatMap((order) => {
        const dates = [order.fecha_hora.split(' ')[0]];
        if (order.fecha_entrega && order.fecha_entrega !== 'No programada') {
          dates.push(order.fecha_entrega);
        }
        return dates;
      })
      .sort((a, b) => new Date(a) - new Date(b))
  )];

  const filteredOrders = orders.filter((order) => {
    const orderDateStr = order.fecha_hora.split(' ')[0];
    const deliveryDateStr = order.fecha_entrega || orderDateStr;
    const orderDate = dayjs(orderDateStr);
    const deliveryDate = dayjs(deliveryDateStr);

    const isMonthMatch = orderDate.month() + 1 === selectedMonth;

    let isWeekMatch = true;
    if (selectedWeek !== '') {
      isWeekMatch =
        orderDate.isoWeek() === selectedWeek ||
        deliveryDate.isoWeek() === selectedWeek;
    }

    let isDateMatch = true;
    if (selectedDate !== '' && selectedDate !== 'Todas') {
      isDateMatch = orderDateStr === selectedDate || deliveryDateStr === selectedDate;
    }

    return isMonthMatch && isWeekMatch && isDateMatch;
  });

  const transformOrders = filteredOrders
    .sort((a, b) => {
      if (a.estado === 'Pedido Enviado' && b.estado !== 'Pedido Enviado') {
        return 1;
      } else if (a.estado !== 'Pedido Enviado' && b.estado === 'Pedido Enviado') {
        return -1;
      } else {
        return new Date(b.fecha_hora) - new Date(a.fecha_hora);
      }
    })
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
        detalles_direccion: order.detalles_direccion,
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
        total_venta: totalVenta,
      };
    });

  const summaryOrders = transformOrders.filter((order) =>
    ['Pedido Confirmado', 'Pedido Enviado'].includes(order.estado)
  );

  const totalVentas = summaryOrders.reduce((sum, order) => sum + order.total_venta, 0);
  const totalProductos = summaryOrders.reduce((sum, order) => sum + order.total, 0);
  const totalDomicilios = summaryOrders.reduce((sum, order) => sum + order.total_domicilio, 0);
  const numeroPedidos = summaryOrders.length;

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
    <Box
      sx={{
        padding: isSmallScreen ? 1 : 2,
        borderRadius: 2,
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          alignItems: isSmallScreen ? 'center' : 'flex-start',
          marginBottom: 4,
        }}
      >
        <img
          src={ordenesIcon}
          alt="Gestión de Pedidos"
          style={{
            width: isSmallScreen ? 50 : 70,
            height: isSmallScreen ? 50 : 70,
            marginRight: isSmallScreen ? 0 : theme.spacing(2),
            marginBottom: isSmallScreen ? theme.spacing(2) : 0,
          }}
        />
        <Typography
          variant={isSmallScreen ? 'h5' : 'h3'}
          style={{
            fontFamily: 'Providence Sans Pro',
            fontWeight: 'bold',
            textAlign: isSmallScreen ? 'center' : 'left',
          }}
        >
          Aqui Aterrizan los Caprichos
        </Typography>
      </Box>
      <SummaryCards
        totalVentas={totalVentas}
        totalProductos={totalProductos}
        totalDomicilios={totalDomicilios}
        numeroPedidos={numeroPedidos}
      />
      <Stack
        direction={isSmallScreen ? 'column' : 'row'}
        spacing={2}
        alignItems={isSmallScreen ? 'stretch' : 'center'}
        sx={{ marginBottom: 2 }}
      >
        <FormControl sx={{ minWidth: isSmallScreen ? '100%' : 200 }}>
          <InputLabel>Filtrar por Mes</InputLabel>
          <Select
            value={selectedMonth}
            onChange={handleMonthChange}
          >
            {Array.from({ length: 12 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('es-ES', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: isSmallScreen ? '100%' : 200 }} disabled={!selectedMonth}>
          <InputLabel>Filtrar por Semana</InputLabel>
          <Select
            value={selectedWeek}
            onChange={handleWeekChange}
            disabled={!selectedMonth}
          >
            <MenuItem value="">Todas</MenuItem>
            {weeksInMonth.map((week) => (
              <MenuItem key={week.weekNumber} value={week.weekNumber}>
                {`Semana ${week.weekNumber} (${week.weekRange})`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: isSmallScreen ? '100%' : 200 }} disabled={!selectedWeek}>
          <InputLabel>Filtrar por Fecha</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedWeek}
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
            '&:hover': { backgroundColor: '#7b45a1' },
            width: isSmallScreen ? '100%' : 'auto',
          }}
          startIcon={<LocalShippingIcon />}
        >
          Agregar Pedido
        </Button>

        <Button
          variant="contained"
          onClick={handleOpenCargaMasiva}
          sx={{
            backgroundColor: '#28A745',
            color: 'white',
            borderRadius: '10px',
            '&:hover': { backgroundColor: '#218838' },
            width: isSmallScreen ? '100%' : 'auto',
          }}
        >
          Cargar Pedidos en Lote
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
          onOpenDireccionDialog={handleOpenDireccionDialog}
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
        token={token}
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
            <Typography variant="body1" sx={{ color: 'black' }}>
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
      <CargaMasivaPedidosDialog open={openCargaMasiva} handleClose={handleCloseCargaMasiva} />
    </Box>
  );
};

export default DeliveryScreen;
