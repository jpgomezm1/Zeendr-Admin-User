import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton as MuiIconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import WineBarIcon from '@mui/icons-material/WineBar';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';
import { green } from '@mui/material/colors';
import { apiClient } from '../../apiClient';

import EnviosIcon from '../../assets/icons/envios2.png';

const DespachosScreen = () => {
  const theme = useTheme();
  const [pedidos, setPedidos] = useState([]);
  const [productsMap, setProductsMap] = useState({}); // Nuevo estado para el mapa de productos
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const [fadingOutPedidoId, setFadingOutPedidoId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Selección por defecto: mes actual
  const [selectedDate, setSelectedDate] = useState(''); // Deshabilitado inicialmente
  const [selectedEstado, setSelectedEstado] = useState('Pedido Confirmado');

  // Estados para el diálogo
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

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

        setPedidos(pedidosResponse.data);

        // Crear el mapa de productos
        const productsMap = {};
        productsResponse.data.forEach((product) => {
          productsMap[product.id] = product.nombre;
        });
        setProductsMap(productsMap);
      } catch (error) {
        console.error('Error fetching pedidos or products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidosAndProducts();
  }, [token]);

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    setSelectedDate(''); // Resetea la fecha seleccionada cuando se cambia el mes
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Modificar handleEstadoChange para abrir el diálogo
  const handleEstadoChange = (pedidoId) => {
    setSelectedPedidoId(pedidoId);
    setOpenDialog(true);
  };

  // Función para manejar el cierre del diálogo y actualizar el estado
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
    return (
      isDateMatch && isMonthMatch && pedido.estado === selectedEstado
    );
  });

  const PedidoCard = ({ pedido }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor:
            pedido.estado === 'Pedido Enviado' ? '#77DD77' : '#FFF',
          boxShadow: 4,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          p: 2,
          border: '1px solid',
          borderColor: '#ddd',
          opacity: fadingOutPedidoId === pedido.id ? 0 : 1,
          transform:
            fadingOutPedidoId === pedido.id ? 'scale(0.95)' : 'scale(1)',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 1 }}
          >
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {pedido.nombre_completo}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {new Date(pedido.fecha_hora).toLocaleString('es-ES')}
              </Typography>
            </Box>
            {pedido.estado === 'Pedido Confirmado' && (
              <Tooltip title="Marcar como Enviado">
                <IconButton
                  sx={{ color: '#5F54FB' }}
                  onClick={() => handleEstadoChange(pedido.id)}
                >
                  <DoneIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
          <Accordion sx={{ mb: 2 }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold', color: 'black' }}
              >
                Detalles del Pedido
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dirección:
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: 'normal', ml: 1 }}
                >
                  {pedido.direccion}
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Detalle:
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: 'normal', ml: 1 }}
                >
                  {pedido.detalles_direccion}
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Contacto:
                <Typography
                  variant="body1"
                  component="span"
                  sx={{ fontWeight: 'normal', ml: 1 }}
                >
                  {pedido.numero_telefono}
                </Typography>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}
          >
            Productos:
          </Typography>
          <Box
            sx={{
              maxHeight: 150,
              overflowY: 'auto',
              mt: 1,
              backgroundColor: '#f9f9f9',
              p: 2,
              borderRadius: 2,
            }}
          >
            {JSON.parse(pedido.productos).map((prod, index) => (
              <Box
                key={index}
                sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
              >
                <WineBarIcon
                  fontSize="small"
                  sx={{ mr: 1, color: '#5F54FB' }}
                />
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 'bold', color: '#5F54FB', flex: 1 }}
                >
                  {productsMap[prod.id] || 'Producto desconocido'}
                </Typography>
                <Chip
                  label={`x${prod.quantity}`}
                  size="small"
                  sx={{ fontWeight: 'bold', ml: 1 }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img
          src={EnviosIcon}
          alt="Gestión de Pedidos"
          style={{ width: 70, height: 70, marginRight: theme.spacing(2) }}
        />
        <Typography
          variant="h3"
          style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}
        >
          Centro de Envios
        </Typography>
      </Box>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: 4 }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Mes</InputLabel>
          <Select value={selectedMonth} onChange={handleMonthChange}>
            {Array.from({ length: 12 }, (_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {new Date(0, index).toLocaleString('es-ES', { month: 'long' })}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 200 }} disabled={!selectedMonth}>
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Estado</InputLabel>
          <Select value={selectedEstado} onChange={handleEstadoSelectChange}>
            <MenuItem value="Pedido Confirmado">Pedido Confirmado</MenuItem>
            <MenuItem value="Pedido Enviado">Pedido Enviado</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Grid container spacing={3}>
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
            <PedidoCard key={pedido.id} pedido={pedido} />
          ))
        )}
      </Grid>
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

      {/* Diálogo para confirmar notificación al cliente */}
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon sx={{ color: green[500], marginRight: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Notificar al Cliente
            </Typography>
          </Box>
          <MuiIconButton onClick={handleCancelDialog} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </MuiIconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 1 }}>
          <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
            ¿Deseas notificar al cliente por <strong>WhatsApp</strong> sobre el estado de su pedido?
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
    </Box>
  );
};

export default DespachosScreen;
