import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, TextField, Box } from '@mui/material';
import { styled } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { red } from '@mui/material/colors';

// Función para formatear moneda, puede ser recibida como prop si ya existe
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Estilo para las celdas de la tabla
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
  [theme.breakpoints.down('sm')]: {
    padding: '6px 24px 6px 8px',  // Reduce el padding en pantallas pequeñas
    fontSize: '0.75rem',          // Reduce el tamaño del texto en pantallas pequeñas
  }
}));

const InventoryTable = ({
  productos,
  handleStockChange,
  handleSaveStock,
  handleCancelClick,
  handleEditClick,
  editing,
  stockChanges,
  formatCurrency,
}) => {
  return (
    <Box sx={{ height: 'auto', width: '100%', padding: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer component={Paper} sx={{ marginTop: 3, borderRadius: 2, maxWidth: '100%', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell align="right">Precio</StyledTableCell>
                <StyledTableCell align="right">Categoría</StyledTableCell>
                <StyledTableCell align="right">Stock</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell component="th" scope="row">{producto.nombre}</TableCell>
                  <TableCell align="right">{formatCurrency(producto.precio)}</TableCell>
                  <TableCell align="right">{producto.categoria}</TableCell>
                  <TableCell align="right">
                    {editing[producto.id] ? (
                      <TextField
                        type="number"
                        value={stockChanges[producto.id] !== undefined ? stockChanges[producto.id] : producto.stock}
                        onChange={(e) => handleStockChange(producto.id, e.target.value)}
                        fullWidth
                      />
                    ) : (
                      producto.stock
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {editing[producto.id] ? (
                      <>
                        <IconButton onClick={() => handleSaveStock(producto.id)} size="small" sx={{ color: '#5E55FE', marginRight: 1 }}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton onClick={() => handleCancelClick(producto.id)} size="small" sx={{ color: red[500] }}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton onClick={() => handleEditClick(producto.id)} size="small" sx={{ color: '#5E55FE', marginRight: 1 }}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default InventoryTable;
