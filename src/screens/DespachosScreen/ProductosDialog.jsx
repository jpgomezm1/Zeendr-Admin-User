// ProductosDialog.jsx
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

const ProductosDialog = ({
  open,
  onClose,
  productosContent,
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
        Productos del Pedido
      </Typography>
    </DialogTitle>
    <DialogContent>
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
