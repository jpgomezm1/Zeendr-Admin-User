import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Paper, IconButton, Typography, Snackbar } from '@mui/material';
import { styled } from '@mui/system';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import { apiClient } from '../../apiClient';

const primaryColor = '#5E55FE';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: primaryColor,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  textTransform: 'none',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: '#4A90E2',
  },
}));

const CategoriaTable = () => {
  const [categorias, setCategorias] = useState([]);
  const [newCategoria, setNewCategoria] = useState('');
  const [editCategoria, setEditCategoria] = useState(null);
  const [editNombre, setEditNombre] = useState('');
  const [ordenModificado, setOrdenModificado] = useState(false); // Nuevo estado para rastrear cambios en el orden
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await apiClient.get('/categorias');
        setCategorias(response.data);
      } catch (error) {
        console.error('Error fetching categorias:', error);
      }
    };

    fetchCategorias();
  }, []);

  const handleAddCategoria = async () => {
    if (newCategoria) {
      try {
        const response = await apiClient.post('/categorias', { nombre: newCategoria });
        setCategorias([...categorias, response.data]);
        setNewCategoria('');
      } catch (error) {
        console.error('Error adding categoria:', error);
      }
    }
  };

  const handleEdit = (categoria) => {
    setEditCategoria(categoria);
    setEditNombre(categoria.nombre);
  };

  const handleSave = async (oldCategoria) => {
    try {
      const response = await apiClient.put(`/categorias/${oldCategoria.id}`, { nombre: editNombre });
      const updatedCategorias = categorias.map(c => (c.id === oldCategoria.id ? response.data : c));
      setCategorias(updatedCategorias);
      setEditCategoria(null);
      setEditNombre('');
    } catch (error) {
      console.error('Error updating categoria:', error);
    }
  };

  const handleDeleteCategoria = async (categoria) => {
    try {
      await apiClient.delete(`/categorias/${categoria.id}`);
      setCategorias(categorias.filter(c => c.id !== categoria.id));
    } catch (error) {
      console.error('Error deleting categoria:', error);
    }
  };

  const moveCategoria = (index, direction) => {
    const newCategorias = [...categorias];
    const movedCategoria = newCategorias[index];
    newCategorias.splice(index, 1);
    newCategorias.splice(index + direction, 0, movedCategoria);
    setCategorias(newCategorias);
    setOrdenModificado(true); // Marcar que el orden ha cambiado
  };

  const handleSaveOrden = async () => {
    try {
      const categoriasAActualizar = categorias.map((categoria, index) => ({
        id: categoria.id,
        orden: index + 1,
      }));
      await apiClient.put('/categorias/orden', { categorias: categoriasAActualizar });
      setSnackbarOpen(true);
      setOrdenModificado(false); // Restablecer el estado una vez que se ha guardado
    } catch (error) {
      console.error('Error al actualizar el orden:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Administrar Categorías del Menú</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Posicion</StyledTableCell>
              <StyledTableCell>Categoría</StyledTableCell>
              <StyledTableCell align="center">Orden</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categorias.map((categoria, index) => (
              <TableRow key={categoria.id}>
                <TableCell>{index + 1}</TableCell> {/* Mostrar el número de posición */}
                {editCategoria?.id === categoria.id ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {/* Flechas deshabilitadas mientras editas */}
                    </TableCell>
                    <TableCell align="right">
                      <StyledIconButton onClick={() => handleSave(categoria)}>
                        <SaveIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => setEditCategoria(null)}>
                        <CloseIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell component="th" scope="row">
                      {categoria.nombre}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        disabled={index === 0}
                        onClick={() => moveCategoria(index, -1)}
                      >
                        <ArrowUpwardIcon />
                      </IconButton>
                      <IconButton
                        disabled={index === categorias.length - 1}
                        onClick={() => moveCategoria(index, 1)}
                      >
                        <ArrowDownwardIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell align="right">
                      <StyledIconButton onClick={() => handleEdit(categoria)}>
                        <EditIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => handleDeleteCategoria(categoria)}>
                        <DeleteIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ mt: 2 }}>
        <TextField
          label="Nueva Categoría"
          value={newCategoria}
          onChange={(e) => setNewCategoria(e.target.value)}
          sx={{ mr: 2 }}
        />
        <StyledButton variant="contained" onClick={handleAddCategoria} sx={{ borderRadius: '18px' }}>Agregar Categoría</StyledButton>
      </Box>
      {ordenModificado && (
        <StyledButton onClick={handleSaveOrden} sx={{ mt: 2 }}>Guardar Orden</StyledButton>
      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        message="El orden ha sido guardado exitosamente"
        action={
          <IconButton size="small" color="inherit" onClick={handleCloseSnackbar}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
};

export default CategoriaTable;


