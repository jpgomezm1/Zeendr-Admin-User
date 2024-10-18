import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, IconButton, Paper, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';  // Importa el icono para "Carga Masiva"
import AddGastoDialog from './AddGastoDialog';
import CargaMasivaDialog from './CargaMasivaDialog';  // Importa tu componente de Carga Masiva
import KPICard from './components/KPICard';
import { styled } from '@mui/system';
import { apiClient } from '../../apiClient';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const OtrosGastos = () => {
  const [open, setOpen] = useState(false);
  const [openCargaMasiva, setOpenCargaMasiva] = useState(false); // Estado para abrir/cerrar el dialog de carga masiva
  const [gastos, setGastos] = useState([]);
  const [editGasto, setEditGasto] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState('Todos');
  const [tipoGastoSeleccionado, setTipoGastoSeleccionado] = useState('Todos');
  const [tiposDeGasto, setTiposDeGasto] = useState([]);
  const [viewAsTable, setViewAsTable] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [gastoToDelete, setGastoToDelete] = useState(null);

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await apiClient.get('/gastos');
      const gastosData = response.data;
      setGastos(gastosData);
      const tipos = ['Todos', ...new Set(gastosData.map(gasto => gasto.tipo_gasto))];
      setTiposDeGasto(tipos);
    } catch (error) {
      console.error('Error al obtener los gastos:', error);
    }
  };

  const handleOpen = () => {
    setEditGasto(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditGasto(null);
  };

  const handleSaveGasto = (gasto) => {
    if (editGasto) {
      setGastos(gastos.map(g => (g.id === gasto.id ? gasto : g)));
    } else {
      setGastos([...gastos, gasto]);
    }
  };

  const handleEditGasto = (gasto) => {
    setEditGasto(gasto);
    setOpen(true);
  };

  const handleOpenConfirmDelete = (gasto) => {
    setGastoToDelete(gasto);
    setOpenConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setOpenConfirmDelete(false);
    setGastoToDelete(null);
  };

  const handleDeleteGasto = async () => {
    if (gastoToDelete) {
      try {
        await apiClient.delete(`/gastos/${gastoToDelete.id}`);
        setGastos(gastos.filter(gasto => gasto.id !== gastoToDelete.id));
        handleCloseConfirmDelete();
      } catch (error) {
        console.error('Error al eliminar el gasto:', error);
      }
    }
  };

  const meses = ['Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filtrarGastosPorMes = (gastos, mes) => {
    if (mes === 'Todos') {
      return gastos;
    }
    
    const mesIndex = meses.indexOf(mes) - 1;
    return gastos.filter(gasto => {
      const gastoFecha = new Date(gasto.fecha);
      return gastoFecha.getUTCMonth() === mesIndex;
    });
  };

  const filtrarGastosPorTipo = (gastos, tipo) => {
    if (tipo === 'Todos') {
      return gastos;
    }
    return gastos.filter(gasto => gasto.tipo_gasto === tipo);
  };

  const gastosFiltradosPorMes = filtrarGastosPorMes(gastos, mesSeleccionado);
  const gastosFiltrados = filtrarGastosPorTipo(gastosFiltradosPorMes, tipoGastoSeleccionado);

  const totalGastadoFiltrado = gastosFiltrados.reduce((acc, gasto) => acc + gasto.monto, 0);

  const renderGastosAsCards = () => (
    <Grid container spacing={3} sx={{ mt: 4 }}>
      {gastosFiltrados.map((gasto, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: '10px' }}>
            <Typography variant="h6" sx={{ color: '#5E55FE', fontWeight: 'bold', mb: 1 }}>{gasto.tipo_gasto}</Typography>
            <Typography variant="body2" color="textSecondary">{gasto.descripcion}</Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold', mt: 1 }}>Monto: {formatCurrency(gasto.monto)}</Typography>
            <Typography variant="body2" color="textSecondary">Fecha: {gasto.fecha}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <IconButton onClick={() => handleEditGasto(gasto)} sx={{ color: '#5E55FE' }}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleOpenConfirmDelete(gasto)} sx={{ color: '#5E55FE' }}>
                <DeleteIcon />
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderGastosAsTable = () => (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell>Tipo de Gasto</StyledTableCell>
            <StyledTableCell>Descripción</StyledTableCell>
            <StyledTableCell>Monto</StyledTableCell>
            <StyledTableCell>Fecha</StyledTableCell>
            <StyledTableCell align="right">Acciones</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {gastosFiltrados.map((gasto) => (
            <TableRow key={gasto.id}>
              <TableCell>{gasto.tipo_gasto}</TableCell>
              <TableCell>{gasto.descripcion}</TableCell>
              <TableCell>{formatCurrency(gasto.monto)}</TableCell>
              <TableCell>{gasto.fecha}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => handleEditGasto(gasto)} sx={{ color: '#5E55FE' }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleOpenConfirmDelete(gasto)} sx={{ color: '#5E55FE' }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const handleOpenCargaMasiva = () => {
    setOpenCargaMasiva(true);
  };

  const handleCloseCargaMasiva = () => {
    setOpenCargaMasiva(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <KPICard title="Total Gastos" value={formatCurrency(totalGastadoFiltrado)} />
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Button
            onClick={handleOpen}
            sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' } }}
            variant="contained"
            startIcon={<AddIcon />}
          >
            Agregar Gasto
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={handleOpenCargaMasiva}
            sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' } }}
            variant="contained"
            startIcon={<UploadFileIcon />}
          >
            Carga Masiva
          </Button>
        </Grid>
        <Grid item>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="mes-select-label">Mes</InputLabel>
            <Select
              labelId="mes-select-label"
              value={mesSeleccionado}
              onChange={(e) => setMesSeleccionado(e.target.value)}
              label="Mes"
            >
              {meses.map((mes, index) => (
                <MenuItem key={index} value={mes}>{mes}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControl sx={{ mt: 2, minWidth: 120 }}>
            <InputLabel id="tipo-gasto-select-label">Tipo de Gasto</InputLabel>
            <Select
              labelId="tipo-gasto-select-label"
              value={tipoGastoSeleccionado}
              onChange={(e) => setTipoGastoSeleccionado(e.target.value)}
              label="Tipo de Gasto"
            >
              {tiposDeGasto.map((tipo, index) => (
                <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={viewAsTable}
                onChange={() => setViewAsTable(!viewAsTable)}
                color="primary"
              />
            }
            label="Ver como tabla"
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
      {viewAsTable ? renderGastosAsTable() : renderGastosAsCards()}

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={openConfirmDelete}
        onClose={handleCloseConfirmDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            borderRadius: '20px',
            padding: '20px',
          },
        }}
        BackdropProps={{
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title" sx={{ textAlign: 'center' }}>
          <Typography variant="h5" sx={{ color: '#FF5252', fontWeight: 'bold' }}>
            Confirmar eliminación
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <DeleteIcon sx={{ fontSize: 50, color: '#FF5252' }} />
          </Box>
          <DialogContentText id="alert-dialog-description" sx={{ color: '#5E55FE', fontWeight: '500' }}>
            ¿Estás seguro de que deseas eliminar este gasto? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 2 }}>
          <Button
            onClick={handleCloseConfirmDelete}
            sx={{
              color: '#5E55FE',
              backgroundColor: '#F5F5FF',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#E8E8FE',
              },
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteGasto}
            sx={{
              color: '#FFF',
              backgroundColor: '#FF5252',
              borderRadius: '10px',
              padding: '10px 20px',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#FF1744',
              },
            }}
            autoFocus
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Carga Masiva */}
      <CargaMasivaDialog
        open={openCargaMasiva}
        handleClose={handleCloseCargaMasiva}
      />

      <AddGastoDialog
        open={open}
        handleClose={handleClose}
        handleSaveGasto={handleSaveGasto}
        gasto={editGasto}
      />
    </Box>
  );
};

export default OtrosGastos;
