import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';
import axios from 'axios';

const CargaMasivaPedidosDialog = ({ open, handleClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    setFile(event.dataTransfer.files[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/pedidos/carga-masiva`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Archivo cargado exitosamente');
      handleClose();
    } catch (error) {
      console.error('Error al subir el archivo', error);
      alert('Hubo un error al subir el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    const ws_data = [
      ['nombre_completo', 'numero_telefono', 'direccion', 'metodo_pago', 'fecha_hora', 'ids_productos', 'cantidad_productos', 'precio_productos', 'costo_domicilio'],
      ['Cliente Ejemplo', '123456789', 'Direccion Ejemplo', 'efectivo', '2024-10-18T14:30', '1,2', '2,1', '1000,2000', '5000']
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Pedidos');

    XLSX.writeFile(wb, 'template_pedidos.xlsx');
  };

  const handleDownloadProductList = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/productos`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const productos = response.data;

      const ws_data = [
        ['ID', 'Nombre del Producto'],
        ...productos.map((producto) => [producto.id, producto.nombre])
      ];

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      XLSX.utils.book_append_sheet(wb, ws, 'Productos');

      XLSX.writeFile(wb, 'lista_productos.xlsx');
    } catch (error) {
      console.error('Error al descargar la lista de productos', error);
      alert('Hubo un error al descargar la lista de productos');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: '20px',
          padding: '20px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#28A745',
          fontSize: '1.8rem',
        }}
      >
        Carga Masiva de Pedidos
      </DialogTitle>

      <DialogContent
        sx={{
          mt: 2,
          overflow: 'hidden',
          px: 4,
        }}
      >
        <Typography
          sx={{
            mb: 3,
            color: '#7b7b7b',
            fontSize: '1rem',
            textAlign: 'center',
          }}
        >
          Selecciona un archivo Excel para cargar los pedidos de manera masiva o descarga el template para empezar.
        </Typography>

        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            border: dragOver ? '2px solid #28A745' : '2px dashed #28A745',
            borderRadius: '10px',
            backgroundColor: dragOver ? '#E8F5E9' : '#F5F5FF',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 0.3s, border 0.3s',
          }}
        >
          <UploadFileIcon sx={{ fontSize: 60, color: '#28A745' }} />
          <Typography
            variant="body1"
            sx={{
              color: '#28A745',
              mt: 2,
              fontSize: '1rem',
            }}
          >
            {file ? `Archivo seleccionado: ${file.name}` : 'Arrastra y suelta un archivo aquí o haz clic para seleccionar'}
          </Typography>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            style={{
              opacity: 0,
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              cursor: 'pointer',
            }}
          />
        </Box>

        {file && (
          <Typography
            sx={{
              mt: 2,
              textAlign: 'center',
              color: '#555',
            }}
          >
            {`Archivo seleccionado: ${file.name}`}
          </Typography>
        )}

        <Typography
          sx={{
            mt: 3,
            color: '#7b7b7b',
            fontSize: '0.9rem',
            textAlign: 'center',
          }}
        >
          <strong>Nota:</strong> En cada fila, puedes definir múltiples productos separándolos por comas en los campos <strong>ids_productos</strong>, <strong>cantidad_productos</strong> y <strong>precio_productos</strong>.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: 'center',
          mt: 3,
          flexWrap: 'wrap',
          gap: 2,
          px: 4,
        }}
      >
        <Button
          onClick={handleClose}
          sx={{
            color: '#28A745',
            borderColor: '#28A745',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#E8F5E9',
              borderColor: '#28A745',
            },
          }}
          variant="outlined"
        >
          Cancelar
        </Button>

        <Button
          onClick={handleUpload}
          disabled={loading || !file}
          sx={{
            color: '#FFF',
            backgroundColor: '#28A745',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
          variant="contained"
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#FFF' }} /> : 'Subir Archivo'}
        </Button>

        <Button
          onClick={handleDownloadTemplate}
          startIcon={<DownloadIcon />}
          sx={{
            color: '#FFF',
            backgroundColor: '#007BFF',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
          variant="contained"
        >
          Descargar Template
        </Button>

        <Button
          onClick={handleDownloadProductList}
          startIcon={<DownloadIcon />}
          sx={{
            color: '#FFF',
            backgroundColor: '#17A2B8',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#138496',
            },
          }}
          variant="contained"
        >
          Descargar Lista de Productos
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CargaMasivaPedidosDialog;
