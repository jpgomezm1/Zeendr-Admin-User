import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, CircularProgress
} from '@mui/material';
import { useSelector } from 'react-redux';
import axios from 'axios';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DownloadIcon from '@mui/icons-material/Download';

const CargaMasivaDialog = ({ open, handleClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Obtener el establecimiento desde el estado de Redux
  const establecimiento = useSelector((state) => state.auth.establecimiento);

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
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const wb = XLSX.utils.book_new();

    const establecimientoTexto = establecimiento || 'Establecimiento Ejemplo';

    const ws_data = [
      ['tipo_gasto', 'descripcion', 'monto', 'fecha', 'establecimiento'],
      ['Operativo', 'Descripción de ejemplo', 100.50, '2024-10-18', establecimientoTexto]
    ];

    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(wb, ws, 'Gastos');

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
      <DialogTitle
        sx={{
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#5E55FE',
          fontSize: '1.8rem',
        }}
      >
        Carga Masiva de Gastos
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
          Selecciona un archivo Excel para cargar los gastos de manera masiva o descarga el template para empezar.
        </Typography>

        <Typography
          sx={{
            mb: 3,
            color: '#7b7b7b',
            fontSize: '1rem',
            textAlign: 'center',
          }}
        >
          Asegúrate de que el campo <strong>Establecimiento</strong> en todas las filas sea exactamente igual a: <strong>{establecimiento || 'Establecimiento Ejemplo'}</strong>.
        </Typography>

        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          sx={{
            border: dragOver ? '2px solid #5E55FE' : '2px dashed #5E55FE',
            borderRadius: '10px',
            backgroundColor: dragOver ? '#E8E8FE' : '#F5F5FF',
            padding: '40px',
            textAlign: 'center',
            cursor: 'pointer',
            position: 'relative',
            transition: 'background-color 0.3s, border 0.3s',
          }}
        >
          <UploadFileIcon sx={{ fontSize: 60, color: '#5E55FE' }} />
          <Typography
            variant="body1"
            sx={{
              color: '#5E55FE',
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
            color: '#5E55FE',
            borderColor: '#5E55FE',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#E8E8FE',
              borderColor: '#5E55FE',
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
            backgroundColor: '#5E55FE',
            borderRadius: '10px',
            padding: '10px 20px',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#7b45a1',
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
          Descargar Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CargaMasivaDialog;
