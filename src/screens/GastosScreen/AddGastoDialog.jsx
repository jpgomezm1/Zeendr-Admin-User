import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import axios from 'axios';

const AddGastoDialog = ({ open, handleClose, handleSaveGasto, gasto }) => {
  const [tipoGasto, setTipoGasto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');

  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    if (gasto) {
      setTipoGasto(gasto.tipo_gasto);
      setDescripcion(gasto.descripcion);
      setMonto(gasto.monto);
      setFecha(gasto.fecha);
    } else {
      setTipoGasto('');
      setDescripcion('');
      setMonto('');
      setFecha('');
    }
  }, [gasto]);

  const handleSave = async () => {
    const newGasto = {
      tipo_gasto: tipoGasto,
      descripcion,
      monto: parseFloat(monto),
      fecha,
    };

    try {
      let response;
      if (gasto) {
        response = await axios.put(`${apiBaseUrl}/gastos/${gasto.id}`, newGasto, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      } else {
        response = await axios.post(`${apiBaseUrl}/gastos`, newGasto, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      handleSaveGasto(response.data);
    } catch (error) {
      console.error('Error al guardar el gasto:', error);
    }

    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{gasto ? 'Editar Gasto' : 'Agregar Gasto'}</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tipo de Gasto"
          type="text"
          fullWidth
          value={tipoGasto}
          onChange={(e) => setTipoGasto(e.target.value)}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <TextField
          margin="dense"
          label="Descripción"
          type="text"
          fullWidth
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <TextField
          margin="dense"
          label="Monto"
          type="number"
          fullWidth
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
        <TextField
          margin="dense"
          label="Fecha del Gasto"
          type="date"
          fullWidth
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
        <Button onClick={handleSave} sx={{ color: '#5E55FE', borderRadius: '8px' }}>{gasto ? 'Guardar Cambios' : 'Guardar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGastoDialog;
