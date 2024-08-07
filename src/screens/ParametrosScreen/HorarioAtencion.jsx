import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Paper, Typography, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { apiClient } from '../../apiClient';  // Importa el apiClient configurado

const primaryColor = '#5E55FE';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: primaryColor,
  color: theme.palette.common.white,
  borderRadius: '18px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#7b45a1',
  }
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: primaryColor,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold'
}));

const daysOfWeek = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HorarioAtencion = () => {
  const [horarios, setHorarios] = useState([]);
  const [newHorario, setNewHorario] = useState({ dia: 'Lunes', apertura: '', cierre: '' });
  const [editHorarioId, setEditHorarioId] = useState(null);
  const [editData, setEditData] = useState({ apertura: '', cierre: '' });

  useEffect(() => {
    const fetchHorarios = async () => {
      try {
        const response = await apiClient.get('/horarios');
        setHorarios(response.data);
      } catch (error) {
        console.error('Error fetching horarios:', error);
      }
    };

    fetchHorarios();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewHorario({ ...newHorario, [name]: value });
  };

  const handleAddHorario = async () => {
    try {
      const response = await apiClient.post('/horarios', newHorario);
      setHorarios([...horarios, response.data]);
      setNewHorario({ dia: 'Lunes', apertura: '', cierre: '' });
    } catch (error) {
      console.error('Error adding horario:', error);
    }
  };

  const handleEdit = (horario) => {
    setEditHorarioId(horario.id);
    setEditData({ apertura: horario.apertura, cierre: horario.cierre });
  };

  const handleSave = async () => {
    try {
      await apiClient.put(`/horarios/${editHorarioId}`, editData);
      setHorarios(horarios.map(h => (h.id === editHorarioId ? { ...h, ...editData } : h)));
      setEditHorarioId(null);
      setEditData({ apertura: '', cierre: '' });
    } catch (error) {
      console.error('Error saving horario:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiClient.delete(`/horarios/${id}`);
      setHorarios(horarios.filter(h => h.id !== id));
    } catch (error) {
      console.error('Error deleting horario:', error);
    }
  };

  return (
    <Box component={Paper} sx={{ p: 4, maxWidth: 800, margin: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Administrar Horarios de Atencion</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <TextField
          select
          label="Día"
          name="dia"
          value={newHorario.dia}
          onChange={handleChange}
          SelectProps={{ native: true }}
          variant="outlined"
          sx={{ width: '30%' }}
        >
          {daysOfWeek.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </TextField>
        <TextField
          label="Hora de Apertura"
          name="apertura"
          value={newHorario.apertura}
          onChange={handleChange}
          variant="outlined"
          sx={{ width: '30%' }}
        />
        <TextField
          label="Hora de Cierre"
          name="cierre"
          value={newHorario.cierre}
          onChange={handleChange}
          variant="outlined"
          sx={{ width: '30%' }}
        />
      </Box>
      <StyledButton
        variant="contained"
        onClick={handleAddHorario}
      >
        Agregar Horario
      </StyledButton>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Día</StyledTableCell>
              <StyledTableCell>Hora de Apertura</StyledTableCell>
              <StyledTableCell>Hora de Cierre</StyledTableCell>
              <StyledTableCell>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {horarios.map((horario) => (
              <TableRow key={horario.id}>
                <TableCell>{horario.dia}</TableCell>
                {editHorarioId === horario.id ? (
                  <>
                    <TableCell>
                      <TextField
                        value={editData.apertura}
                        onChange={(e) => setEditData({ ...editData, apertura: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        value={editData.cierre}
                        onChange={(e) => setEditData({ ...editData, cierre: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <StyledIconButton onClick={handleSave}>
                        <SaveIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{horario.apertura}</TableCell>
                    <TableCell>{horario.cierre}</TableCell>
                    <TableCell>
                      <StyledIconButton onClick={() => handleEdit(horario)}>
                        <EditIcon />
                      </StyledIconButton>
                      <StyledIconButton onClick={() => handleDelete(horario.id)}>
                        <DeleteIcon />
                      </StyledIconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default HorarioAtencion;
