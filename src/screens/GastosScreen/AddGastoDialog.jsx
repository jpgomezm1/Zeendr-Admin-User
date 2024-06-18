import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Button } from '@mui/material';

const AddGastoDialog = ({ open, handleClose, handleSaveGasto }) => {
  const [tipoGasto, setTipoGasto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [frecuencia, setFrecuencia] = useState('');

  const handleSave = () => {
    const newGasto = {
      tipoGasto,
      descripcion,
      monto: parseFloat(monto),
      frecuencia,
    };
    handleSaveGasto(newGasto);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Agregar Gasto</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Tipo de Gasto"
          type="text"
          fullWidth
          value={tipoGasto}
          onChange={(e) => setTipoGasto(e.target.value)}
          select
          sx={{ mb: 3, '& .MuiInputBase-root': { borderRadius: '8px' } }}
        >
          <MenuItem value="Arrendamiento">Arrendamiento</MenuItem>
          <MenuItem value="Servicios Públicos">Servicios Públicos</MenuItem>
          <MenuItem value="Mantenimiento">Mantenimiento</MenuItem>
          <MenuItem value="Marketing">Marketing</MenuItem>
          <MenuItem value="Cuotas">Cuotas</MenuItem>
          <MenuItem value="Otros">Otros</MenuItem>
        </TextField>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Cancelar</Button>
        <Button onClick={handleSave} sx={{ color: '#5E55FE', borderRadius: '8px' }}>Guardar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGastoDialog;


