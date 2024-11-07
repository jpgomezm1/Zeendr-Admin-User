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
  Collapse,
} from '@mui/material';
import dayjs from 'dayjs';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { apiClient } from '../../apiClient'; // Importa el apiClient configurado

const AddOrderDialog = ({ open, handleClose, productsMap, setOrders, token, onOrderAdded }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [direccion, setDireccion] = useState('');
  // Modificar productos para incluir precio personalizado y toggle visibility
  const [productos, setProductos] = useState([
    { id: '', quantity: 1, precio_personalizado: '', showPrecioPersonalizado: false },
  ]);
  const [metodoPago, setMetodoPago] = useState('');
  const [fechaHora, setFechaHora] = useState(dayjs().format('YYYY-MM-DDTHH:mm'));
  const [costoDomicilio, setCostoDomicilio] = useState('');
  const [esPuntoVenta, setEsPuntoVenta] = useState(false);
  const [clientes, setClientes] = useState([]); // Estado para clientes
  // Nuevo estado para descuento porcentual y toggle
  const [descuentoPorcentual, setDescuentoPorcentual] = useState('');
  const [aplicarDescuento, setAplicarDescuento] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (open) {
      // Resetear los campos cuando se abre el diálogo
      setNombreCompleto('');
      setNumeroTelefono('');
      setCorreoElectronico('');
      setDireccion('');
      setProductos([
        { id: '', quantity: 1, precio_personalizado: '', showPrecioPersonalizado: false },
      ]);
      setMetodoPago('');
      setFechaHora(dayjs().format('YYYY-MM-DDTHH:mm'));
      setCostoDomicilio('');
      setEsPuntoVenta(false);
      setDescuentoPorcentual('');
      setAplicarDescuento(false);

      // Obtener la lista de clientes
      fetchClientes();
    }
  }, [open]);

  const fetchClientes = async () => {
    try {
      const response = await apiClient.get('/clientes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setClientes(response.data);
    } catch (error) {
      console.error('Error fetching clientes:', error);
    }
  };

  const handleClienteSelect = (newValue) => {
    if (newValue) {
      setNombreCompleto(newValue.nombre_completo || '');
      setNumeroTelefono(newValue.numero_telefono || '');
      setCorreoElectronico(newValue.correo_electronico || '');
      setDireccion(newValue.direccion || '');
    }
  };

  const handleProductoChange = (index, key, value) => {
    const newProductos = [...productos];
    if (key === 'quantity') {
      newProductos[index][key] = parseInt(value, 10);
    } else if (key === 'precio_personalizado') {
      newProductos[index][key] = parseFloat(value);
    } else {
      newProductos[index][key] = value;
    }
    setProductos(newProductos);
  };

  const handleAddProduct = () => {
    setProductos([
      ...productos,
      { id: '', quantity: 1, precio_personalizado: '', showPrecioPersonalizado: false },
    ]);
  };

  const handleRemoveProduct = (index) => {
    setProductos(productos.filter((_, i) => i !== index));
  };

  const togglePrecioPersonalizado = (index) => {
    const newProductos = [...productos];
    newProductos[index].showPrecioPersonalizado = !newProductos[index].showPrecioPersonalizado;
    setProductos(newProductos);
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
      descuento_porcentual: aplicarDescuento ? parseFloat(descuentoPorcentual) || 0 : 0, // Nuevo campo
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      fullScreen={fullScreen}
    >
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
                <Autocomplete
                  freeSolo
                  options={clientes}
                  getOptionLabel={(option) => option.nombre_completo || ''}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setNombreCompleto(newValue);
                    } else {
                      handleClienteSelect(newValue);
                    }
                  }}
                  inputValue={nombreCompleto}
                  onInputChange={(event, newInputValue) => {
                    setNombreCompleto(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Nombre Completo"
                      fullWidth
                      sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  options={clientes}
                  getOptionLabel={(option) => option.numero_telefono || ''}
                  onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setNumeroTelefono(newValue);
                    } else {
                      handleClienteSelect(newValue);
                    }
                  }}
                  inputValue={numeroTelefono}
                  onInputChange={(event, newInputValue) => {
                    setNumeroTelefono(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Número de Teléfono"
                      fullWidth
                      sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                    />
                  )}
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
                    productsArray.find((product) => product.id === producto.id) ||
                    null
                  }
                  sx={{ flexGrow: 1 }}
                />
                <TextField
                  margin="dense"
                  label="Cantidad"
                  type="number"
                  value={producto.quantity}
                  onChange={(e) =>
                    handleProductoChange(index, 'quantity', e.target.value)
                  }
                  sx={{
                    width: 100,
                    marginLeft: 2,
                    '& .MuiInputBase-root': { borderRadius: '10px' },
                  }}
                  inputProps={{ min: 1 }}
                />
                <IconButton
                  onClick={() => togglePrecioPersonalizado(index)}
                  color="primary"
                >
                  {producto.showPrecioPersonalizado ? (
                    <VisibilityOffIcon />
                  ) : (
                    <VisibilityIcon />
                  )}
                </IconButton>
                {productos.length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveProduct(index)}
                    color="secondary"
                  >
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
              {producto.showPrecioPersonalizado && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TextField
                    margin="dense"
                    label="Precio Personalizado"
                    type="number"
                    value={producto.precio_personalizado}
                    onChange={(e) =>
                      handleProductoChange(
                        index,
                        'precio_personalizado',
                        e.target.value
                      )
                    }
                    sx={{
                      width: 200,
                      '& .MuiInputBase-root': { borderRadius: '10px' },
                    }}
                    inputProps={{ min: 0 }}
                  />
                </Box>
              )}
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              onClick={handleAddProduct}
              color="primary"
              startIcon={<AddCircleIcon />}
              sx={{ borderRadius: '10px' }}
            >
              Agregar Producto
            </Button>
          </Grid>
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
                <MenuItem value="Tarjeta">Pago Pendiente</MenuItem>
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
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={aplicarDescuento}
                  onChange={(e) => setAplicarDescuento(e.target.checked)}
                />
              }
              label="Aplicar Descuento"
            />
          </Grid>
          {aplicarDescuento && (
            <Grid item xs={12}>
              <TextField
                margin="dense"
                label="Descuento (%)"
                type="number"
                fullWidth
                value={descuentoPorcentual}
                onChange={(e) => setDescuentoPorcentual(e.target.value)}
                sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
          )}
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
