import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Input, Typography, Box, CircularProgress } from '@mui/material';
import { useSelector } from 'react-redux';  // Para obtener el establecimiento
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';

const CargaMasivaDialog = ({ open, handleClose, onSuccessUpload }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Obtener el establecimiento desde el estado de Redux
  const establecimiento = useSelector((state) => state.auth.establecimiento);

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
      handleClose(); // Cerrar el modal
      
      // Llamar a la función para actualizar los datos en el componente padre
      onSuccessUpload(); 

    } catch (error) {
      console.error('Error al subir el archivo', error);
      alert('Hubo un error al subir el archivo');
    } finally {
      setLoading(false); // Termina la carga
    }
  };

  // Función para descargar el template de Excel
  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new(); // Crear nuevo libro

    // Verificamos si el establecimiento está disponible
    const establecimientoTexto = establecimiento || 'Establecimiento Ejemplo';

    const ws_data = [
      ['tipo_gasto', 'descripcion', 'monto', 'fecha', 'establecimiento'], // Encabezados
      // Ejemplo dinámico con el establecimiento
      ['Operativo', 'Descripción de ejemplo', 100.50, '2024-10-18', establecimientoTexto]
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data); // Convertir los datos a hoja
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos'); // Añadir la hoja al libro

    // Generar el archivo Excel
    XLSX.writeFile(wb, 'template_gastos.xlsx');
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
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: '#5E55FE' }}>
        Carga Masiva de Gastos
      </DialogTitle>

      <DialogContent
        sx={{
          textAlign: 'center',
          mt: 2,
          overflow: 'hidden',
        }}
      >
        <Typography sx={{ mb: 3, color: '#7b7b7b', fontSize: '1.2rem' }}>
          Selecciona un archivo Excel para cargar los gastos de manera masiva o descarga el template para empezar.
        </Typography>

        <Typography sx={{ mb: 3, color: '#7b7b7b', fontSize: '1.2rem' }}>
          Asegúrate de que el campo <strong>Establecimiento</strong> en todas las filas sea exactamente igual a: 
          <strong> {establecimiento || 'Establecimiento Ejemplo'}</strong>.
        </Typography>

        {/* Botón para descargar el template */}
       

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
          disabled={loading}
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
        <Button
          onClick={handleDownloadTemplate}
          startIcon={<DownloadIcon />}
          sx={{
            color: '#FFF',
            backgroundColor: '#28A745',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            '&:hover': {
              backgroundColor: '#218838',
            },
          }}
        >
          Descargar Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CargaMasivaDialog;
