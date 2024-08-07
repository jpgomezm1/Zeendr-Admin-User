import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, CircularProgress, IconButton } from '@mui/material';
import { styled, useTheme } from '@mui/system';
import { Edit, Delete, AcUnit } from '@mui/icons-material';
import { apiClient } from '../../apiClient';

import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
}));

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const SummaryContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
  backgroundColor: theme.palette.background.paper,
}));

const CuponesDescuento = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [cuponIdToEdit, setCuponIdToEdit] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [nuevoCupon, setNuevoCupon] = useState({
    nombre: '',
    comentario: '',
    descuento: '',
    categoria: '',
  });
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [cupones, setCupones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [cuponIdToDelete, setCuponIdToDelete] = useState(null);
  const [openFreezeDialog, setOpenFreezeDialog] = useState(false);
  const [cuponIdToFreeze, setCuponIdToFreeze] = useState(null);

  const [openSummaryDialog, setOpenSummaryDialog] = useState(false);
  const [cuponSummary, setCuponSummary] = useState({ total_ventas: 0, total_pedidos: 0 });

  const theme = useTheme();

  useEffect(() => {
    fetchCupones();
    fetchCategorias();
  }, []);

  const fetchCategorias = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/categorias_cupones');
      setCategorias(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    setLoading(false);
  };

  const fetchCupones = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/cupones');
      setCupones(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
    setLoading(false);
  };

  const handleClickOpen = (cupon = null) => {
    setOpen(true);
    if (cupon) {
      setEditMode(true);
      setCuponIdToEdit(cupon.id);
      setNuevoCupon({
        nombre: cupon.nombre,
        comentario: cupon.comentario,
        descuento: cupon.descuento,
        categoria: cupon.categoria.nombre,
      });
    } else {
      setEditMode(false);
      setNuevoCupon({ nombre: '', comentario: '', descuento: '', categoria: '' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setNuevoCupon({ nombre: '', comentario: '', descuento: '', categoria: '' });
    setNuevaCategoria('');
    setIsAddingCategory(false);
    setEditMode(false);
    setCuponIdToEdit(null);
  };

  const handleSave = async () => {
    try {
      let categoriaId;
      if (isAddingCategory && nuevaCategoria) {
        const categoriaResponse = await apiClient.post('/categorias_cupones', { nombre: nuevaCategoria });
        categoriaId = categoriaResponse.data.id;
        setCategorias([...categorias, categoriaResponse.data]);
      } else {
        const categoriaData = categorias.find((c) => c.nombre === nuevoCupon.categoria);
        categoriaId = categoriaData.id;
      }

      if (editMode) {
        await apiClient.put(`/cupones/${cuponIdToEdit}`, { ...nuevoCupon, categoria_id: categoriaId });
        setCupones(cupones.map((cupon) => (cupon.id === cuponIdToEdit ? { ...cupon, ...nuevoCupon, categoria: { nombre: nuevoCupon.categoria } } : cupon)));
      } else {
        const response = await apiClient.post('/cupones', { ...nuevoCupon, categoria_id: categoriaId });
        setCupones([...cupones, response.data]);
      }

      handleClose();
    } catch (error) {
      console.error('Error saving the coupon:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevoCupon((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (event) => {
    const value = event.target.value;
    if (value === 'Agregar nueva...') {
      setIsAddingCategory(true);
      setNuevoCupon((prev) => ({ ...prev, categoria: '' }));
    } else {
      setNuevoCupon((prev) => ({ ...prev, categoria: value }));
      setIsAddingCategory(false);
    }
  };

  const handleOpenDeleteDialog = (id) => {
    setCuponIdToDelete(id);
    setOpenDeleteDialog(true);
  };

  const closeDeleteConfirmation = () => {
    setOpenDeleteDialog(false);
    setCuponIdToDelete(null);
  };

  const handleDelete = async () => {
    try {
      await apiClient.delete(`/cupones/${cuponIdToDelete}`);
      setCupones(cupones.filter((cupon) => cupon.id !== cuponIdToDelete));
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting the coupon:', error);
    }
  };

  const handleOpenFreezeDialog = (id) => {
    setCuponIdToFreeze(id);
    setOpenFreezeDialog(true);
  };

  const closeFreezeConfirmation = () => {
    setOpenFreezeDialog(false);
    setCuponIdToFreeze(null);
  };

  const handleFreeze = async () => {
    try {
      const response = await apiClient.put(`/cupones/congelar/${cuponIdToFreeze}`);
      setCupones(cupones.map((cupon) => (cupon.id === cuponIdToFreeze ? response.data : cupon)));
      closeFreezeConfirmation();
    } catch (error) {
      console.error('Error freezing the coupon:', error);
    }
  };

  const handleOpenSummaryDialog = async (cuponId) => {
    try {
      const response = await apiClient.get(`/cupones/${cuponId}/ventas`);
      setCuponSummary(response.data);
      setOpenSummaryDialog(true);
    } catch (error) {
      console.error('Error fetching coupon summary:', error);
    }
  };

  const handleCloseSummaryDialog = () => {
    setOpenSummaryDialog(false);
    setCuponSummary({ total_ventas: 0, total_pedidos: 0 });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Administrar Cupones de Descuento
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleClickOpen()}
        sx={{ textTransform: 'none',backgroundColor: '#5E55FE', borderRadius: '18px','&:hover': { backgroundColor: '#7b45a1' } }}
      >
        Agregar Nuevo Cupón
      </Button>

      {loading ? (
        <CircularProgress />
      ) : (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editMode ? 'Editar Cupón' : 'Agregar Cupón'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="nombre"
              label="Nombre del Cupón"
              type="text"
              fullWidth
              variant="outlined"
              value={nuevoCupon.nombre}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="comentario"
              label="Comentario (Opcional)"
              type="text"
              fullWidth
              variant="outlined"
              value={nuevoCupon.comentario}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="descuento"
              label="Porcentaje de Descuento"
              type="number"
              fullWidth
              variant="outlined"
              value={nuevoCupon.descuento}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Categoría</InputLabel>
              <Select
                value={isAddingCategory ? '' : nuevoCupon.categoria}
                onChange={handleCategoriaChange}
                label="Categoría"
              >
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.nombre}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
                <MenuItem value="Agregar nueva...">+ Agregar Nueva Categoría</MenuItem>
              </Select>
            </FormControl>
            {isAddingCategory && (
              <TextField
                margin="dense"
                name="nuevaCategoria"
                label="Nueva Categoría"
                type="text"
                fullWidth
                variant="outlined"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} sx={{ color: '#5E55FE' }}>
              Cancelar
            </Button>
            <Button onClick={handleSave} sx={{ color: '#5E55FE' }}>
              Guardar
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table aria-label="tabla de cupones">
          <TableHead>
            <TableRow>
              <StyledTableCell>Nombre</StyledTableCell>
              <StyledTableCell>Comentario</StyledTableCell>
              <StyledTableCell>Descuento (%)</StyledTableCell>
              <StyledTableCell>Categoria</StyledTableCell>
              <StyledTableCell>Estado</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cupones.map((cupon) => (
              <TableRow key={cupon.id} onClick={() => handleOpenSummaryDialog(cupon.id)} style={{ cursor: 'pointer' }}>
                <TableCell>{cupon.nombre}</TableCell>
                <TableCell>{cupon.comentario}</TableCell>
                <TableCell>{cupon.descuento}</TableCell>
                <TableCell>{cupon.categoria.nombre}</TableCell>
                <TableCell>{cupon.congelado ? 'Congelado' : 'Activo'}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleClickOpen(cupon); }}>
                    <Edit sx={{ color: '#5E55FE'}}/>
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleOpenFreezeDialog(cupon.id); }}>
                    <AcUnit sx={{ color: '#5E55FE'}}/>
                  </IconButton>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleOpenDeleteDialog(cupon.id); }}>
                    <Delete sx={{ color: '#5E55FE'}}/>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openSummaryDialog}
        onClose={handleCloseSummaryDialog}
        aria-labelledby="summary-dialog-title"
        aria-describedby="summary-dialog-description"
      >
        <DialogTitle id="summary-dialog-title" sx={{ backgroundColor: '#5E55FE', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          Resumen de Ventas del Cupón
        </DialogTitle>
        <StyledDialogContent>
          <SummaryContent>
            <ShoppingCartIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total de Ventas
            </Typography>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              {formatCurrency(cuponSummary.total_ventas)}
            </Typography>
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
              Total de Pedidos
            </Typography>
            <Typography variant="h4" sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
              {cuponSummary.total_pedidos}
            </Typography>
          </SummaryContent>
        </StyledDialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseSummaryDialog} variant="contained" sx={{ textTransform: 'none', backgroundColor: '#5E55FE', '&:hover': { backgroundColor: '#7b45a1' } }}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={closeDeleteConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Box display="flex" alignItems="center">
            <LocalOfferIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
            {"Confirmar Eliminación"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography id="alert-dialog-description" sx={{ fontSize: '1rem' }}>
            ¿Estás seguro de que deseas eliminar este cupón? Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation} sx={{ color: theme.palette.text.secondary }}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
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
        open={openFreezeDialog}
        onClose={closeFreezeConfirmation}
        aria-labelledby="freeze-dialog-title"
        aria-describedby="freeze-dialog-description"
      >
        <DialogTitle id="freeze-dialog-title">
          <Box display="flex" alignItems="center">
            <AcUnit sx={{ color: theme.palette.info.main, mr: 1 }} />
            {"Confirmar Congelación"}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography id="freeze-dialog-description" sx={{ fontSize: '1rem' }}>
            ¿Estás seguro de que deseas {cupones.find(c => c.id === cuponIdToFreeze)?.congelado ? 'descongelar' : 'congelar'} este cupón?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeFreezeConfirmation} sx={{ color: theme.palette.text.secondary }}>
            Cancelar
          </Button>
          <Button
            onClick={handleFreeze}
            sx={{
              backgroundColor: theme.palette.info.main,
              color: theme.palette.getContrastText(theme.palette.info.main),
              '&:hover': {
                backgroundColor: theme.palette.info.dark,
              },
            }}
            autoFocus
          >
            {cupones.find(c => c.id === cuponIdToFreeze)?.congelado ? 'Descongelar' : 'Congelar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CuponesDescuento;
