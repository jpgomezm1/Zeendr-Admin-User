import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddGastoDialog from './AddGastoDialog';

const OtrosGastos = () => {
  const [open, setOpen] = useState(false);
  const [gastos, setGastos] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSaveGasto = (gasto) => {
    setGastos([...gastos, gasto]);
    handleClose();
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ color: '#5E55FE', fontWeight: 'bold' }}>Otros Gastos</Typography>
      <Button
        onClick={handleOpen}
        sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' } }}
        variant="contained"
        startIcon={<AddIcon />}
      >
        Agregar Gasto
      </Button>
      <Grid container spacing={2} sx={{ mt: 4 }}>
        {gastos.map((gasto, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: '8px', boxShadow: 1 }}>
              <Typography variant="h6">{gasto.tipoGasto}</Typography>
              <Typography variant="body1">{gasto.descripcion}</Typography>
              <Typography variant="body1">Monto: {gasto.monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</Typography>
              <Typography variant="body1">Frecuencia: {gasto.frecuencia}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <AddGastoDialog open={open} handleClose={handleClose} handleSaveGasto={handleSaveGasto} />
    </Box>
  );
};

export default OtrosGastos;

