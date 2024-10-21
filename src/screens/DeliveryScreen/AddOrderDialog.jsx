import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Box,
  Stack,
  Grid,
  Checkbox,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Autocomplete,
} from '@mui/material';
import dayjs from 'dayjs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { apiClient } from '../../apiClient'; // Importa el apiClient configurado

const AddOrderDialog = ({ open, handleClose, productsMap, setOrders, token, onOrderAdded }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [direccion, setDireccion] = useState('');
  const [productos, setProductos] = useState([{ id: '', quantity: 1 }]);
  const [metodoPago, setMetodoPago] = useState('');
  const [fechaHora, setFechaHora] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [costoDomicilio, setCostoDomicilio] = useState('');
  const [esPuntoVenta, setEsPuntoVenta] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      // Resetear los campos cuando se abre el diálogo
      setNombreCompleto('');
      setNumeroTelefono('');
      setCorreoElectronico('');
      setDireccion('');
      setProductos([{ id: '', quantity: 1 }]);
      setMetodoPago('');
      setFechaHora(dayjs().format('YYYY-MM-DDTHH:mm'));
      setCostoDomicilio('');
      setEsPuntoVenta(false);
    }
  }, [open]);

  const handleProductoChange = (index, key, value) => {
    const newProductos = [...productos];
    newProductos[index][key] = key === 'quantity' ? parseInt(value, 10) : value;
    setProductos(newProductos);
  };

  const handleAddProduct = () => {
    setProductos([...productos, { id: '', quantity: 1 }]);
  };

  const handleRemoveProduct = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const newOrder = {
      nombre_completo: esPuntoVenta ? 'Punto de Venta' : nombreCompleto,
      numero_telefono: esPuntoVenta
        ? '0000000000'
        : numeroTelefono || 'No especificado',
      correo_electronico: esPuntoVenta
        ? 'puntodeventa@zeendr.com'
        : correoElectronico || 'No especificado',
      direccion: esPuntoVenta
        ? 'Punto de Venta'
        : direccion || 'No especificada',
      productos: JSON.stringify(productos),
      metodo_pago: metodoPago,
      fecha_hora: fechaHora,
      costo_domicilio: esPuntoVenta ? 0 : parseFloat(costoDomicilio || 0),
      estado: 'Pedido Confirmado', // Añadido este campo
    };

    try {
      const response = await apiClient.post('/pedido_manual', newOrder);
      setOrders((prevOrders) => [...prevOrders, response.data]);
      handleClose();
      if (onOrderAdded) {
        onOrderAdded();
      }
    } catch (error) {
      console.error('Error adding order:', error);
      if (onOrderAdded) {
        onOrderAdded(error);
      }
    }
  };

  // Convertir productsMap a un array de objetos para usar en Autocomplete
  const productsArray = Object.entries(productsMap).map(([id, nombre]) => ({
    id,
    nombre,
  }));

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle
        sx={{
          textAlign: 'center',
          backgroundColor: '#f3f4f6',
          color: '#7B12F5',
          fontWeight: 'bold',
        }}
      >
        Agregar Nueva Orden
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={esPuntoVenta}
              onChange={(e) => setEsPuntoVenta(e.target.checked)}
            />
          }
          label="Orden en Punto de Venta"
        />
        <Grid container spacing={3}>
          {!esPuntoVenta && (
            <>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Nombre Completo"
                  fullWidth
                  value={nombreCompleto}
                  onChange={(e) => setNombreCompleto(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Número de Teléfono"
                  fullWidth
                  value={numeroTelefono}
                  onChange={(e) => setNumeroTelefono(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Correo Electrónico"
                  fullWidth
                  value={correoElectronico}
                  onChange={(e) => setCorreoElectronico(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  margin="dense"
                  label="Dirección"
                  fullWidth
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
              </Grid>
            </>
          )}
          {productos.map((producto, index) => (
            <Grid item xs={12} key={index}>
              <Box display="flex" alignItems="center">
                <Autocomplete
                  options={productsArray}
                  getOptionLabel={(option) => option.nombre}
                  onChange={(event, newValue) => {
                    handleProductoChange(index, 'id', newValue ? newValue.id : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Producto"
                      margin="dense"
                      fullWidth
                      sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                    />
                  )}
                  value={
                    productsArray.find((product) => product.id === producto.id) || null
                  }
                  sx={{ flexGrow: 1 }}
                />
                <TextField
                  margin="dense"
                  label="Cantidad"
                  type="number"
                  value={producto.quantity}
                  onChange={(e) => handleProductoChange(index, 'quantity', e.target.value)}
                  sx={{
                    width: 100,
                    marginLeft: 2,
                    '& .MuiInputBase-root': { borderRadius: '10px' },
                  }}
                  inputProps={{ min: 1 }}
                />
                <IconButton onClick={handleAddProduct} color="primary">
                  <AddCircleIcon />
                </IconButton>
                {productos.length > 1 && (
                  <IconButton onClick={() => handleRemoveProduct(index)} color="secondary">
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              margin="dense"
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
            >
              <InputLabel>Método de Pago</InputLabel>
              <Select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                label="Método de Pago"
              >
                <MenuItem value="Efectivo">Efectivo</MenuItem>
                <MenuItem value="Transferencia">Transferencia</MenuItem>
                <MenuItem value="Tarjeta">Tarjeta</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Fecha y Hora"
              type="datetime-local"
              fullWidth
              value={fechaHora}
              onChange={(e) => setFechaHora(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          {!esPuntoVenta && (
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Costo del Domicilio"
                type="number"
                fullWidth
                value={costoDomicilio}
                onChange={(e) => setCostoDomicilio(e.target.value)}
                sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                inputProps={{ min: 0 }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleClose}
            sx={{ color: '#5E55FE', borderRadius: '10px' }}
            startIcon={<CancelIcon />}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            sx={{ color: '#5E55FE', borderRadius: '10px' }}
            startIcon={<SaveIcon />}
          >
            Guardar
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default AddOrderDialog;
