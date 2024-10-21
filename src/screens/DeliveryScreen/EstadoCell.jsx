import React, { useState } from 'react';
import {
  Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Box, IconButton
} from '@mui/material';
import { green } from '@mui/material/colors';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CloseIcon from '@mui/icons-material/Close';

const EstadoCell = ({ value, row, onEstadoChange }) => {
  const [estado, setEstado] = useState(value);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState(value);

  const handleChange = (event) => {
    const newEstado = event.target.value;
    if (newEstado === 'Pedido Enviado') {
      setSelectedEstado(newEstado);
      setOpenDialog(true);
    } else {
      setEstado(newEstado);
      onEstadoChange(row.id, newEstado);
    }
  };

  const handleCloseDialog = (notificarCliente) => {
    setOpenDialog(false);
    setEstado(selectedEstado);
    onEstadoChange(row.id, selectedEstado, notificarCliente);
  };

  const handleCancelDialog = () => {
    setOpenDialog(false);
    // Revertir al estado anterior si se cancela
    setEstado(value);
  };

  return (
    <>
      <Select value={estado} onChange={handleChange} variant="standard" fullWidth>
        <MenuItem value="Pedido Recibido">Pedido Recibido</MenuItem>
        <MenuItem value="Pedido Confirmado">Pedido Confirmado</MenuItem>
        <MenuItem value="Pedido Enviado">Pedido Enviado</MenuItem>
        <MenuItem value="Pedido Rechazado">Pedido Rechazado</MenuItem>
      </Select>

      <Dialog
        open={openDialog}
        onClose={handleCancelDialog}
        PaperProps={{
          sx: {
            borderRadius: '16px',
            padding: 2,
            maxWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WhatsAppIcon sx={{ color: green[500], marginRight: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Notificar al Cliente
            </Typography>
          </Box>
          <IconButton onClick={handleCancelDialog} sx={{ color: 'grey.500' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ paddingTop: 1 }}>
          <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary' }}>
            ¿Deseas notificar al cliente por <strong>WhatsApp</strong> sobre el estado de su pedido?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
          <Button
            onClick={() => handleCloseDialog(false)}
            variant="outlined"
            sx={{
              borderColor: green[500],
              color: green[500],
              textTransform: 'none',
              borderRadius: '8px',
              paddingX: 3,
              '&:hover': {
                backgroundColor: green[50],
                borderColor: green[700],
              },
            }}
          >
            No
          </Button>
          <Button
            onClick={() => handleCloseDialog(true)}
            variant="contained"
            sx={{
              backgroundColor: green[500],
              color: '#fff',
              textTransform: 'none',
              borderRadius: '8px',
              paddingX: 3,
              '&:hover': {
                backgroundColor: green[700],
              },
            }}
          >
            Sí, Notificar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EstadoCell;
