import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, IconButton, Paper, MenuItem, Select, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddGastoDialog from './AddGastoDialog';
import KPICard from './components/KPICard';
import { styled } from '@mui/system';
import axios from 'axios';

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
  const [gastos, setGastos] = useState([]);
  const [editGasto, setEditGasto] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState('Todos');
  const [viewAsTable, setViewAsTable] = useState(false);

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    fetchGastos();
  }, []);

  const fetchGastos = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/gastos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGastos(response.data);
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

  const handleDeleteGasto = async (id) => {
    try {
      await axios.delete(`${apiBaseUrl}/gastos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setGastos(gastos.filter(gasto => gasto.id !== id));
    } catch (error) {
      console.error('Error al eliminar el gasto:', error);
    }
  };

  const meses = ['Todos', 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const filtrarGastosPorMes = (gastos, mes) => {
    if (mes === 'Todos') {
      return gastos;
    }
    const mesIndex = meses.indexOf(mes) - 1;
    return gastos.filter(gasto => new Date(gasto.fecha).getMonth() === mesIndex);
  };

  const gastosFiltrados = filtrarGastosPorMes(gastos, mesSeleccionado);

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
              <IconButton onClick={() => handleDeleteGasto(gasto.id)} sx={{ color: '#5E55FE' }}>
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
                <IconButton onClick={() => handleDeleteGasto(gasto.id)} sx={{ color: '#5E55FE' }}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ color: '#5E55FE', fontWeight: 'bold' }}>Otros Gastos</Typography>
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
