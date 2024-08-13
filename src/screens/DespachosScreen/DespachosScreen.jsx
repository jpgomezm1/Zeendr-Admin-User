import React, { useState, useEffect } from 'react';
import { Typography, Box, CircularProgress, Card, CardContent, Grid, Accordion, AccordionSummary, AccordionDetails, Chip, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel, Stack, Snackbar, Alert } from '@mui/material';
import { useSelector } from 'react-redux';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DoneIcon from '@mui/icons-material/Done';
import WineBarIcon from '@mui/icons-material/WineBar';
import { apiClient } from '../../apiClient';

const DespachosScreen = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const today = new Date().toLocaleDateString('es-ES'); // Fecha de hoy
  const [selectedDate, setSelectedDate] = useState(today); // Selecciona hoy por defecto
  const [selectedEstado, setSelectedEstado] = useState('Pedido Confirmado'); // Estado por defecto
  const token = useSelector((state) => state.auth.token);
  const [fadingOutPedidoId, setFadingOutPedidoId] = useState(null); // Estado para manejar la animación de salida

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await apiClient.get('/pedidos', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPedidos(response.data);
      } catch (error) {
        console.error('Error fetching pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [token]);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleEstadoChange = async (pedidoId) => {
    try {
      await apiClient.put(`/pedido/${pedidoId}/estado`, { estado: 'Pedido Enviado' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Inicia la animación de desvanecimiento
      setFadingOutPedidoId(pedidoId);
      setTimeout(() => {
        // Actualiza el estado de los pedidos una vez que la animación termina
        setPedidos((prevPedidos) =>
          prevPedidos.filter((pedido) => pedido.id !== pedidoId)
        );
        setFadingOutPedidoId(null); // Reinicia el estado de la animación
      }, 300); // Duración de la animación en milisegundos

      setSnackbarOpen(true); // Mostrar Snackbar cuando se actualice el estado
    } catch (error) {
      console.error('Error updating pedido status:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleEstadoSelectChange = (event) => {
    setSelectedEstado(event.target.value);
  };

  const uniqueDates = ['Todas', ...new Set(
    pedidos.map(pedido => new Date(pedido.fecha_hora).toLocaleDateString('es-ES'))
  )];

  const filteredPedidos = pedidos.filter((pedido) => {
    const orderDate = new Date(pedido.fecha_hora).toLocaleDateString('es-ES');
    return (selectedDate === 'Todas' || selectedDate === orderDate) && pedido.estado === selectedEstado;
  });

  const PedidoCard = ({ pedido }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Card
        sx={{
          borderRadius: 3,
          backgroundColor: pedido.estado === 'Pedido Enviado' ? '#77DD77' : '#FFF', // Color diferente para 'Pedido Enviado'
          boxShadow: 4,
          transition: 'transform 0.3s ease, opacity 0.3s ease',
          p: 2,
          border: '1px solid',
          borderColor: '#ddd',
          opacity: fadingOutPedidoId === pedido.id ? 0 : 1,
          transform: fadingOutPedidoId === pedido.id ? 'scale(0.95)' : 'scale(1)',
          '&:hover': {
            boxShadow: 6,
          },
        }}
      >
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
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
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'black' }}>
                Detalles del Pedido
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Dirección:
                <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', ml: 1 }}>
                  {pedido.direccion}
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Detalle:
                <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', ml: 1 }}>
                  {pedido.detalles_direccion}
                </Typography>
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Contacto:
                <Typography variant="body1" component="span" sx={{ fontWeight: 'normal', ml: 1 }}>
                  {pedido.numero_telefono}
                </Typography>
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: 'black' }}>
            Productos:
          </Typography>
          <Box sx={{ maxHeight: 150, overflowY: 'auto', mt: 1, backgroundColor: '#f9f9f9', p: 2, borderRadius: 2 }}>
            {JSON.parse(pedido.productos).map((prod, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <WineBarIcon fontSize="small" sx={{ mr: 1, color: '#5F54FB' }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#5F54FB', flex: 1 }}>
                  {prod.name}
                </Typography>
                <Chip label={`x${prod.quantity}`} size="small" sx={{ fontWeight: 'bold', ml: 1 }} />
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
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
          Centro de Envios
        </Typography>
      </Box>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ marginBottom: 4 }}>
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
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrar por Estado</InputLabel>
          <Select
            value={selectedEstado}
            onChange={handleEstadoSelectChange}
          >
            <MenuItem value="Pedido Confirmado">Pedido Confirmado</MenuItem>
            <MenuItem value="Pedido Enviado">Pedido Enviado</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <Grid container spacing={3}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
          </Box>
        ) : (
          filteredPedidos.length === 0 ? (
            <Box sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No hay pedidos {selectedEstado.toLowerCase()} para la fecha seleccionada.
              </Typography>
            </Box>
          ) : (
            filteredPedidos.map((pedido) => <PedidoCard key={pedido.id} pedido={pedido} />)
          )
        )}
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Orden despachada con exito
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DespachosScreen;
