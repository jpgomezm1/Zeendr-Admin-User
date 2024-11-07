import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import WineBarIcon from '@mui/icons-material/WineBar';

const ProductSummaryDialog = ({ open, onClose, productSummary }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: 2,
          maxWidth: 500,
          width: '100%',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Resumen de Productos a Despachar
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {productSummary.length === 0 ? (
          <Typography>No hay productos para despachar.</Typography>
        ) : (
          <List>
            {productSummary.map((product) => (
              <ListItem key={product.id}>
                <ListItemIcon>
                  <WineBarIcon sx={{ color: '#5F54FB' }} />
                </ListItemIcon>
                <ListItemText
                  primary={product.nombre}
                  secondary={`Cantidad Total: ${product.totalQuantity}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductSummaryDialog;
