// DeliveryDialog.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  Tooltip,
  Box,
  Snackbar,
  Alert,
  FormControlLabel,
  InputAdornment,
  Grid
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import DownloadIcon from '@mui/icons-material/Download';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

const DeliveryDialog = ({ open, onClose, pedidos, productsMap }) => {
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPedidos, setFilteredPedidos] = useState(pedidos);

  useEffect(() => {
    // Reiniciar selección y mensaje cuando se abra el diálogo
    if (open) {
      setSelectedPedidos([]);
      setWhatsappMessage('');
      setSelectAll(false);
      setSearchQuery('');
      setFilteredPedidos(pedidos);
    }
  }, [open, pedidos]);

  useEffect(() => {
    const results = pedidos.filter((pedido) =>
      pedido.nombre_completo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pedido.direccion.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPedidos(results);
  }, [searchQuery, pedidos]);

  const handleTogglePedido = (pedido) => () => {
    const currentIndex = selectedPedidos.indexOf(pedido);
    const newSelectedPedidos = [...selectedPedidos];

    if (currentIndex === -1) {
      newSelectedPedidos.push(pedido);
    } else {
      newSelectedPedidos.splice(currentIndex, 1);
    }

    setSelectedPedidos(newSelectedPedidos);
    setSelectAll(newSelectedPedidos.length === filteredPedidos.length);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPedidos([]);
    } else {
      setSelectedPedidos([...filteredPedidos]);
    }
    setSelectAll(!selectAll);
  };

  const generateWhatsappMessage = () => {
    let message = '';
    selectedPedidos.forEach((pedido) => {
      message += `• *${pedido.nombre_completo}*\n`;
      message += `  - Dirección: ${pedido.direccion}\n`;
      if (pedido.detalles_direccion) {
        message += `  - Detalles: ${pedido.detalles_direccion}\n`;
      }
      message += `  - Teléfono: ${pedido.numero_telefono}\n\n`;
    });
    setWhatsappMessage(message);
  };

  const generateOrderSummaryDocx = async () => {
    const doc = new Document();

    selectedPedidos.forEach((pedido) => {
      doc.addSection({
        children: [
          new Paragraph({
            text: `Cliente: ${pedido.nombre_completo}`,
            heading: HeadingLevel.HEADING_2,
          }),
          new Paragraph(`Dirección: ${pedido.direccion}`),
          pedido.detalles_direccion && new Paragraph(`Detalles: ${pedido.detalles_direccion}`),
          new Paragraph(`Teléfono: ${pedido.numero_telefono}`),
          new Paragraph({
            text: 'Productos:',
            heading: HeadingLevel.HEADING_3,
          }),
          ...JSON.parse(pedido.productos).map((prod) => {
            const productData = productsMap[prod.id];
            const productName = productData ? productData.nombre : 'Producto desconocido';
            return new Paragraph(`- ${productName} x${prod.quantity}`);
          }),
          new Paragraph(''), // Espacio
        ].filter(Boolean),
      });
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'resumen_pedidos.docx');
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: 0,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', padding: 2 }}>
        <WhatsAppIcon sx={{ color: '#25D366', marginRight: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
          Resumen Envios
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ marginLeft: 'auto' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {/* Botones de Acción */}
      <Box sx={{ paddingX: 2, paddingBottom: 1 }}>
        <Grid container spacing={1} alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  color="primary"
                />
              }
              label="Seleccionar Todos"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              placeholder="Buscar pedidos..."
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </Box>
      <DialogContent dividers sx={{ padding: 0, maxHeight: '50vh' }}>
        {/* Lista de Pedidos */}
        <List dense>
          {filteredPedidos.map((pedido) => {
            const isSelected = selectedPedidos.indexOf(pedido) !== -1;
            return (
              <ListItem
                key={pedido.id}
                button
                onClick={handleTogglePedido(pedido)}
                selected={isSelected}
                sx={{ paddingLeft: 2, paddingRight: 2 }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {pedido.nombre_completo.charAt(0).toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={pedido.nombre_completo}
                  secondary={pedido.direccion}
                />
                <Checkbox
                  edge="end"
                  checked={isSelected}
                  onChange={handleTogglePedido(pedido)}
                  color="primary"
                />
              </ListItem>
            );
          })}
          {filteredPedidos.length === 0 && (
            <Box sx={{ textAlign: 'center', padding: 2 }}>
              <Typography variant="body1" color="textSecondary">
                No se encontraron pedidos.
              </Typography>
            </Box>
          )}
        </List>
      </DialogContent>
      {/* Acciones */}
      <Box sx={{ paddingX: 2, paddingY: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<WhatsAppIcon />}
              onClick={generateWhatsappMessage}
              disabled={selectedPedidos.length === 0}
              sx={{backgroundColor: '#00AC47', borderRadius: '16px', textTransform: 'none','&:hover': { backgroundColor: '#007831' }}}
            >
              Generar Mensaje de WhatsApp
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={generateOrderSummaryDocx}
              disabled={selectedPedidos.length === 0}
              sx={{backgroundColor: '#2684FC', borderRadius: '16px', textTransform: 'none','&:hover': { backgroundColor: '#1e69c9' }}}
            >
              Descargar Resumen
            </Button>
          </Grid>
        </Grid>
        {whatsappMessage && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Mensaje Generado:
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={whatsappMessage}
              InputProps={{
                readOnly: true,
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <CopyToClipboard text={whatsappMessage}>
                <Button variant="outlined" startIcon={<FileCopyIcon />} sx={{ textTransform: 'none', fontWeight: 'bold'}}>
                  Copiar Mensaje
                </Button>
              </CopyToClipboard>
            </Box>
          </Box>
        )}
      </Box>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          Resumen de pedidos descargado con éxito
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default DeliveryDialog;
