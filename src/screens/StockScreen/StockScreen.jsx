import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  CircularProgress,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Switch,
  FormControlLabel,
  useTheme
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';
import { styled } from '@mui/system';
import InventoryDialog from './InventoryDialog';
import MovimientosDialog from './MovimientosDialog';
import { apiClient } from '../../apiClient';
import InventoryTable from './InventoryTable'; // Importa el componente InventoryTable

import EntregasIcon from '../../assets/icons/entregas.png';

const primaryColor = '#5E55FE';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: theme.palette.common.white,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#7b45a1',
  }
}));

const StyledCard = styled(Card)({
  border: '1px solid black',
  borderRadius: '16px',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.02)',
  }
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const StockScreen = () => {
  const theme = useTheme();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockChanges, setStockChanges] = useState({});
  const [editing, setEditing] = useState({});
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [movimientosDialogOpen, setMovimientosDialogOpen] = useState(false);
  const [isTableView, setIsTableView] = useState(false); // Nuevo estado para controlar la vista

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      const response = await apiClient.get('/productos');
      setProductos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener los productos', error);
      setLoading(false);
    }
  };

  const handleStockChange = (id, cantidad) => {
    setStockChanges(prev => ({ ...prev, [id]: cantidad }));
  };

  const handleSaveStock = async (id) => {
    const cantidad = stockChanges[id];
    if (cantidad !== undefined) {
      try {
        const response = await apiClient.post(`/productos/${id}/stock`, { cantidad });
        setEditing(prev => ({ ...prev, [id]: false }));
        setProductos(prevProductos => prevProductos.map(producto => 
          producto.id === id ? { ...producto, stock: response.data.stock } : producto
        ));
        alert('Stock actualizado con éxito');
      } catch (error) {
        console.error('Error al actualizar el stock', error);
      }
    }
  };

  const handleEditClick = (id) => {
    setEditing(prev => ({ ...prev, [id]: true }));
  };

  const handleCancelClick = (id) => {
    setEditing(prev => ({ ...prev, [id]: false }));
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMovimientosDialogOpen = () => {
    setMovimientosDialogOpen(true);
  };

  const handleMovimientosDialogClose = () => {
    setMovimientosDialogOpen(false);
  };

  const handleSaveMovement = async (tipoMovimiento, comentario, cambiosStock) => {
    try {
      const response = await apiClient.post('/inventarios/movimiento', {
        tipo: tipoMovimiento,
        comentario: comentario,
        cambiosStock: cambiosStock
      });
      alert(response.data.mensaje);
      fetchProductos();
    } catch (error) {
      console.error('Error al registrar los movimientos de inventario', error);
      alert('Error al registrar los movimientos de inventario');
    }
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img src={EntregasIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2) }} />
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
          Bodega de los Caprichos 
        </Typography>
      </Box>
      <TextField
      sx={{ mb: 3 }}
        variant="outlined"
        placeholder="Buscar producto"
        fullWidth
        margin="normal"
        value={search}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <FormControlLabel
        control={
          <Switch
            checked={isTableView}
            onChange={() => setIsTableView(!isTableView)}
            color="primary"
          />
        }
        label="Vista en Tabla"
      />
      <Button variant="contained" onClick={handleDialogOpen} size="medium" sx={{my: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, mr: 1}}>
        Registrar Movimiento de Inventario
      </Button>
      <Button variant="contained" onClick={handleMovimientosDialogOpen} size="medium" sx={{my: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' },}}>
        Ver Movimientos de Inventario
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        isTableView ? (
          <InventoryTable
          productos={filteredProductos}
          handleStockChange={handleStockChange}
          handleSaveStock={handleSaveStock}
          handleCancelClick={handleCancelClick}
          handleEditClick={handleEditClick}
          editing={editing}
          stockChanges={stockChanges}
          formatCurrency={formatCurrency}
          />
        ) : (
          <Grid container spacing={3} sx={{ mt: 2}}>
            {filteredProductos.map(producto => (
              <Grid item xs={12} sm={6} md={4} key={producto.id}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h5">{producto.nombre}</Typography>
                    <Typography variant="body1">Precio: {formatCurrency(producto.precio)}</Typography>
                    <Typography variant="body2">Categoría: {producto.categoria}</Typography>
                    {editing[producto.id] ? (
                      <>
                        <TextField
                          label="Stock"
                          type="number"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={stockChanges[producto.id] !== undefined ? stockChanges[producto.id] : producto.stock}
                          onChange={(e) => handleStockChange(producto.id, e.target.value)}
                        />
                        <IconButton onClick={() => handleSaveStock(producto.id)} sx={{ color: '#5E55FE'}}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleCancelClick(producto.id)} color="secondary">
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1">Stock: {producto.stock !== undefined && producto.stock !== null ? producto.stock : 0}</Typography>
                        <IconButton onClick={() => handleEditClick(producto.id)} sx={{ color: '#5E55FE'}}>
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </CardContent>
                </StyledCard>
              </Grid>
            ))}
          </Grid>
        )
      )}
      <InventoryDialog
        open={dialogOpen}
        handleClose={handleDialogClose}
        productos={productos}
        handleSaveMovement={handleSaveMovement}
      />
      <MovimientosDialog
        open={movimientosDialogOpen}
        handleClose={handleMovimientosDialogClose}
      />
    </Box>
  );
};

export default StockScreen;


