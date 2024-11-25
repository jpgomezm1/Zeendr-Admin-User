import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person'; // Ícono para el nombre del cliente

const ProductosDialog = ({
  open,
  onClose,
  productosContent,
  direccionContent,
}) => (
  <Dialog
    open={open}
    onClose={onClose}
    PaperProps={{
      sx: {
        borderRadius: '16px',
        padding: 2,
        maxWidth: 500,
      },
    }}
  >
    <DialogTitle>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
        Detalles del Pedido
      </Typography>
    </DialogTitle>
    <DialogContent>
      {/* Información del Cliente */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ mr: 1, color: '#E54E46' }} />
          <Typography variant="body1">
            <strong>{direccionContent.nombreCliente}</strong> 
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <HomeIcon sx={{ mr: 1, color: '#33A852' }} />
          <Typography variant="body1">
            <strong>{direccionContent.direccion}</strong> 
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PhoneIcon sx={{ mr: 1, color: '#FBBC04' }} />
          <Typography variant="body1">
            <strong>{direccionContent.telefono}</strong> 
          </Typography>
        </Box>
      </Box>

      {/* Productos del Pedido */}
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
        Productos:
      </Typography>
      {productosContent.map((prod, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <WineBarIcon
            fontSize="small"
            sx={{ mr: 1, color: '#5F54FB' }}
          />
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'bold',
              color: '#5F54FB',
              flex: 1,
            }}
          >
            {prod.nombre}
          </Typography>
          <Chip
            label={`x${prod.quantity}`}
            size="small"
            sx={{ fontWeight: 'bold', ml: 1 }}
          />
        </Box>
      ))}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cerrar</Button>
    </DialogActions>
  </Dialog>
);

export default ProductosDialog;
