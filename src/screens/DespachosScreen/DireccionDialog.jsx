// DireccionDialog.jsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

const DireccionDialog = ({
  open,
  onClose,
  direccionContent,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        padding: 2,
        maxWidth: 400,
      },
    }}
  >
    <DialogTitle>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Información del Cliente
      </Typography>
    </DialogTitle>
    <DialogContent>
      <Typography variant="body1">
        <strong>Dirección:</strong> {direccionContent.direccion}
      </Typography>
      <Typography variant="body1">
        <strong>Detalles:</strong> {direccionContent.detalles}
      </Typography>
      <Typography variant="body1">
        <strong>Teléfono:</strong> {direccionContent.telefono}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default DireccionDialog;
