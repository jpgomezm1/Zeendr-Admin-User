// DespachosScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Snackbar,
  Alert,
  useTheme,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  useMediaQuery,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useSelector } from 'react-redux';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { green } from '@mui/material/colors';
import { apiClient } from '../../apiClient';

import EnviosIcon from '../../assets/icons/envios2.png';
import ProductSummaryDialog from './ProductSummaryDialog';
import PedidoCard from './PedidoCard';
// Importamos el diálogo combinado
import ProductosDialog from './ProductosDialog';
import DeliveryDialog from './DeliveryDialog'; // Importamos el componente de Delivery

const DespachosScreen = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [pedidos, setPedidos] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [fadingOutPedidoId, setFadingOutPedidoId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('Pedido Confirmado');
  const [searchName, setSearchName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  // Estados para el diálogo combinado
  const [openPedidoDialog, setOpenPedidoDialog] = useState(false);
  const [direccionDialogContent, setDireccionDialogContent] = useState({
    direccion: '',
    detalles: '',
    telefono: '',
  });
  const [productosDialogContent, setProductosDialogContent] = useState([]);

  // Estado para el diálogo de resumen de productos
  const [openProductSummaryDialog, setOpenProductSummaryDialog] = useState(false);
  const [productSummary, setProductSummary] = useState([]);

  // Estado para el diálogo de envío al domiciliario
  const [openDeliveryDialog, setOpenDeliveryDialog] = useState(false);

  useEffect(() => {
    const fetchPedidosAndProducts = async () => {
      try {
        const [pedidosResponse, productsResponse] = await Promise.all([
          apiClient.get('/pedidos', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          apiClient.get('/productos', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // Crear el mapa de productos con nombre y precio
        const productsMap = {};
        productsResponse.data.forEach((product) => {
          productsMap[product.id] = {
            nombre: product.nombre,
            precio: product.precio,
          };
        });
        setProductsMap(productsMap);

        // Agregar total_venta a cada pedido
        const pedidosWithTotals = pedidosResponse.data.map((pedido) => {
          const productos = JSON.parse(pedido.productos);
          let total_venta = 0;
          productos.forEach((prod) => {
            const productData = productsMap[prod.id];
            if (productData) {
              total_venta += productData.precio * prod.quantity;
            }
          });
          return { ...pedido, total_venta };
        });
        setPedidos(pedidosWithTotals);
      } catch (error) {
        console.error('Error fetching pedidos or products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidosAndProducts();
  }, [token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDate('');
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleEstadoChange = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setOpenDialog(true);
  };

  const handleCloseDialog = async (notificarCliente) => {
    setOpenDialog(false);
    try {
      await apiClient.put(
        `/pedido/${selectedPedidoId}/estado`,
        { estado: 'Pedido Enviado', notificar_cliente: notificarCliente },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFadingOutPedidoId(selectedPedidoId);
      setTimeout(() => {
        setPedidos((prevPedidos) =>
          prevPedidos.filter((pedido) => pedido.id !== selectedPedidoId)
        );
        setFadingOutPedidoId(null);
      }, 300);

      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error updating pedido status:', error);
    }
  };

  const handleCancelDialog = () => {
    setOpenDialog(false);
    setSelectedPedidoId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEstadoSelectChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  // Función para abrir el diálogo combinado
  const onOpenPedidoDialog = (pedido) => {
    // Preparar contenido de dirección
    setDireccionDialogContent({
      direccion: pedido.direccion,
      detalles: pedido.detalles_direccion,
      telefono: pedido.numero_telefono,
      nombreCliente: pedido.nombre_completo,
    });

    // Preparar contenido de productos
    const productosArray = JSON.parse(pedido.productos).map((prod) => {
      const productData = productsMap[prod.id];
      return {
        ...prod,
        nombre: productData ? productData.nombre : 'Producto desconocido',
        precio: productData ? productData.precio : 0,
      };
    });
    setProductosDialogContent(productosArray);

    // Abrir el diálogo
    setOpenPedidoDialog(true);
  };

  const handleClosePedidoDialog = () => {
    setOpenPedidoDialog(false);
  };

  const uniqueDates = [
    'Todas',
    ...new Set(
      pedidos
        .filter(
          (pedido) =>
            new Date(pedido.fecha_hora).getMonth() + 1 === selectedMonth
        )
        .map((pedido) => new Date(pedido.fecha_hora).toLocaleDateString('es-ES'))
    ),
  ];

  const filteredPedidos = pedidos.filter((pedido) => {
    const orderDate = new Date(pedido.fecha_hora).toLocaleDateString('es-ES');
    const isDateMatch =
      selectedDate === '' ||
      selectedDate === 'Todas' ||
      selectedDate === orderDate;
    const isMonthMatch =
      new Date(pedido.fecha_hora).getMonth() + 1 === selectedMonth;
    const isEstadoMatch = pedido.estado === selectedEstado;
    const isNameMatch = pedido.nombre_completo
      .toLowerCase()
      .includes(searchName.toLowerCase());
    return isDateMatch && isMonthMatch && isEstadoMatch && isNameMatch;
  });

  // Función para manejar la apertura del diálogo de resumen de productos
  const handleOpenProductSummaryDialog = () => {
    // Calcular el resumen de productos
    const summary = {};

    filteredPedidos.forEach((pedido) => {
      const productos = JSON.parse(pedido.productos);
      productos.forEach((prod) => {
        const productId = prod.id;
        const quantity = prod.quantity;
        const productData = productsMap[productId];
        const productName = productData ? productData.nombre : 'Producto desconocido';

        if (!summary[productId]) {
          summary[productId] = {
            id: productId,
            nombre: productName,
            totalQuantity: 0,
          };
        }
        summary[productId].totalQuantity += quantity;
      });
    });

    // Convertir el resumen a un array
    const summaryArray = Object.values(summary);
    setProductSummary(summaryArray);
    setOpenProductSummaryDialog(true);
  };

  const handleCloseProductSummaryDialog = () => {
    setOpenProductSummaryDialog(false);
  };

  // Función para abrir el diálogo de envío al domiciliario
  const handleOpenDeliveryDialog = () => {
    setOpenDeliveryDialog(true);
  };

  const handleCloseDeliveryDialog = () => {
    setOpenDeliveryDialog(false);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4 },
        minHeight: '100vh',
      }}
    >
      {/* Encabezado */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: { xs: 'column', sm: 'row' },
          marginBottom: 4,
          justifyContent: 'space-between',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              marginRight: { xs: 0, sm: theme.spacing(2) },
              marginBottom: { xs: theme.spacing(2), sm: 0 },
            }}
          >
            <img
              src={EnviosIcon}
              alt="Gestión de Pedidos"
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
          <Typography
            variant="h3"
            style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}
            sx={{
              fontSize: { xs: '2rem', sm: '3rem' },
              textAlign: { xs: 'center', sm: 'left' },
            }}
          >
            Centro de Envios
          </Typography>
        </Box>
        {/* Botones para abrir los diálogos */}
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: { xs: 2, sm: 0 } }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenProductSummaryDialog}
            sx={{
              backgroundColor: '#5E55FE',
              borderRadius: '16px',
              '&:hover': { backgroundColor: '#7b45a1' },
            }}
          >
            Resumen de Productos
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleOpenDeliveryDialog}
            startIcon={<WhatsAppIcon />}
            sx={{
              backgroundColor: '#00AC47',
              borderRadius: '16px',
              '&:hover': { backgroundColor: '#007831' },
            }}
          >
            Reporte de Envios
          </Button>
        </Box>
      </Box>

      {/* Filtros */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: 4 }}
      >
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 200 },
          }}
        >
          <InputLabel>Filtrar por Mes</InputLabel>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('es-ES', {
                  month: 'long',
                })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 200 },
          }}
          disabled={!selectedMonth}
        >
          <InputLabel>Filtrar por Fecha</InputLabel>
          <Select
            value={selectedDate}
            onChange={handleDateChange}
            disabled={!selectedMonth}
          >
            {uniqueDates.map((date, index) => (
              <MenuItem key={index} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl
          sx={{
            minWidth: { xs: '100%', sm: 200 },
          }}
        >
          <InputLabel>Filtrar por Estado</InputLabel>
          <Select value={selectedEstado} onChange={handleEstadoSelectChange}>
            <MenuItem value="Pedido Confirmado">Pedido Confirmado</MenuItem>
            <MenuItem value="Pedido Enviado">Pedido Enviado</MenuItem>
          </Select>
        </FormControl>
        {/* Barra de Búsqueda */}
        <TextField
          label="Buscar por Nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{
            minWidth: { xs: '100%', sm: 200 },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </Stack>

      {/* Grid de Pedidos */}
      <Grid container spacing={2}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '80vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredPedidos.length === 0 ? (
          <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No hay pedidos {selectedEstado.toLowerCase()} para los filtros
              seleccionados.
            </Typography>
          </Box>
        ) : (
          filteredPedidos.map((pedido) => (
            <PedidoCard
              key={pedido.id}
              pedido={pedido}
              productsMap={productsMap}
              fadingOutPedidoId={fadingOutPedidoId}
              onOpenPedidoDialog={onOpenPedidoDialog}
              handleEstadoChange={handleEstadoChange}
              getRowClassName={getRowClassName}
              getShortStatus={getShortStatus}
              formatCurrency={formatCurrency}
            />
          ))
        )}
      </Grid>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Orden despachada con éxito
        </Alert>
      </Snackbar>

      {/* Diálogo de Notificación */}
      <Dialog
        open={openDialog}
        onClose={handleCancelDialog}
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
          <IconButton onClick={handleCancelDialog} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 1 }}>
          <DialogContentText
            sx={{ fontSize: '1rem', color: 'text.primary' }}
          >
            ¿Deseas notificar al cliente por <strong>WhatsApp</strong> sobre el
            estado de su pedido?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <Button
            onClick={() => handleCloseDialog(false)}
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
            onClick={() => handleCloseDialog(true)}
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

      {/* Diálogo combinado de Pedido */}
      <ProductosDialog
        open={openPedidoDialog}
        onClose={handleClosePedidoDialog}
        productosContent={productosDialogContent}
        direccionContent={direccionDialogContent}
      />

      {/* Diálogo de Resumen de Productos */}
      <ProductSummaryDialog
        open={openProductSummaryDialog}
        onClose={handleCloseProductSummaryDialog}
        productSummary={productSummary}
      />

      {/* Diálogo de Envío al Domiciliario */}
      <DeliveryDialog
        open={openDeliveryDialog}
        onClose={handleCloseDeliveryDialog}
        pedidos={filteredPedidos}
        productsMap={productsMap}
      />
    </Box>
  );
};

export default DespachosScreen;
