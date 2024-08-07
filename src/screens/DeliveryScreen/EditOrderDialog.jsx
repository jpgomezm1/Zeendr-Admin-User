import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Stack, Grid, FormControl, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import dayjs from 'dayjs';
import { apiClient } from '../../apiClient';

const EditOrderDialog = ({ open, handleClose, order, setOrders }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [numeroTelefono, setNumeroTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [productos, setProductos] = useState([]);
  const [metodoPago, setMetodoPago] = useState('');
  const [fechaHora, setFechaHora] = useState('');
  const [costoDomicilio, setCostoDomicilio] = useState('');
  const [productList, setProductList] = useState([]);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await apiClient.get('/productos');
        const products = response.data;
        setProductList(products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  useEffect(() => {
    if (order) {
      setNombreCompleto(order.nombre_completo);
      setNumeroTelefono(order.numero_telefono);
      setDireccion(order.direccion);
      setProductos(JSON.parse(order.productos) || []);
      setMetodoPago(order.metodo_pago);
      setFechaHora(dayjs(order.fecha_hora).format('YYYY-MM-DDTHH:mm'));
      setCostoDomicilio(order.costo_domicilio);
    }
  }, [order]);

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
    try {
      const updatedOrder = {
        nombre_completo: nombreCompleto,
        numero_telefono: numeroTelefono,
        direccion: direccion,
        productos: JSON.stringify(productos),
        metodo_pago: metodoPago,
        fecha_hora: fechaHora,
        costo_domicilio: parseFloat(costoDomicilio)
      };

      const response = await apiClient.put(`/pedido/${order.id}`, updatedOrder);
      setOrders(prevOrders => prevOrders.map(o => o.id === order.id ? response.data.pedido : o));
      handleClose();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', backgroundColor: '#f3f4f6', color: '#7B12F5', fontWeight: 'bold' }}>
        Editar Orden
      </DialogTitle>
      <DialogContent sx={{ padding: '24px' }}>
        <Grid container spacing={3}>
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
              label="Dirección"
              fullWidth
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
            />
          </Grid>
          {productos.map((producto, index) => (
            <Grid item xs={12} key={index}>
              <Box display="flex" alignItems="center">
                <FormControl fullWidth margin="dense" sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}>
                  <InputLabel>Producto</InputLabel>
                  <Select
                    value={producto.id}
                    onChange={(e) => handleProductoChange(index, 'id', e.target.value)}
                    label="Producto"
                  >
                    {productList.map((product) => (
                      <MenuItem key={product.id} value={product.id}>
                        {product.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  margin="dense"
                  label="Cant."
                  type="number"
                  value={producto.quantity}
                  onChange={(e) => handleProductoChange(index, 'quantity', e.target.value)}
                  sx={{ width: 70, mx: 2, '& .MuiInputBase-root': { borderRadius: '10px' } }}
                />
                <IconButton onClick={() => handleAddProduct()} size="small" color="primary">
                  <AddCircleIcon />
                </IconButton>
                {productos.length > 1 && (
                  <IconButton onClick={() => handleRemoveProduct(index)} size="small" color="secondary">
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Box>
            </Grid>
          ))}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Método de Pago"
              fullWidth
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
            />
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
            <TextField
              margin="dense"
              label="Costo del Domicilio"
              type="number"
              fullWidth
              value={costoDomicilio}
              onChange={(e) => setCostoDomicilio(e.target.value)}
              sx={{ '& .MuiInputBase-root': { borderRadius: '10px' } }}
            />
          </Grid>
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

export default EditOrderDialog;
