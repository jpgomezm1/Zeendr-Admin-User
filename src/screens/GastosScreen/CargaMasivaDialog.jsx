import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Input, Typography, Box, CircularProgress } from '@mui/material';
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const CargaMasivaDialog = ({ open, handleClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Por favor selecciona un archivo');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true); // Comienza la carga

    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/gastos/carga-masiva`, formData, {
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
      setLoading(false); // Termina la carga
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
          borderRadius: '20px', // Bordes redondeados
          padding: '20px',
          overflow: 'hidden', // Evitar que se desborde el contenido
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5E55FE' }}>
        Carga Masiva de Gastos
      </DialogTitle>

      <DialogContent
        sx={{
          textAlign: 'center',
          mt: 2,
          overflow: 'hidden', // Evitar scroll innecesario
        }}
      >
        <Typography variant="body1" sx={{ mb: 3, color: '#7b7b7b' }}>
          Selecciona un archivo Excel para cargar los gastos de manera masiva.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            border: '2px dashed #5E55FE',
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#F5F5FF',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#E8E8FE',
            },
          }}
        >
          <UploadFileIcon sx={{ fontSize: 50, color: '#5E55FE' }} />
          <Typography variant="body2" sx={{ color: '#5E55FE', mt: 1 }}>
            {file ? file.name : 'Arrastra y suelta un archivo aquí o haz clic para seleccionar'}
          </Typography>
          <Input
            type="file"
            onChange={handleFileChange}
            sx={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', cursor: 'pointer' }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', mt: 3 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#5E55FE',
            backgroundColor: '#F5F5FF',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#E8E8FE',
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleUpload}
          disabled={loading} // Deshabilitar mientras se está subiendo el archivo
          sx={{
            color: '#FFF',
            backgroundColor: '#5E55FE',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#7b45a1',
            },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: '#FFF' }} /> : 'Subir Archivo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CargaMasivaDialog;
