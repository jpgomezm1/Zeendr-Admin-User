// components/ProductTable/ProductTable.jsx
import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box } from '@mui/material';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      padding: '6px 24px 6px 8px',  // Reduce el padding en pantallas pequeñas
      fontSize: '0.75rem',          // Reduce el tamaño del texto en pantallas pequeñas
    }
  }));

function ProductoTable({ productos, onDelete, onEdit }) {
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
                <StyledTableCell align="right">Descuento</StyledTableCell>
                <StyledTableCell align="right">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto) => (
                <TableRow key={producto.id}>
                  <TableCell component="th" scope="row">{producto.nombre}</TableCell>
                  <TableCell align="right">{formatCurrency(producto.precio)}</TableCell>
                  <TableCell align="right">{producto.categoria}</TableCell>
                  <TableCell align="right">{producto.descuento}%</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => onEdit(producto)} size="small" sx={{ color: '#5E55FE', marginRight: 1 }}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(producto)} size="small" sx={{ color: red[500] }}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default ProductoTable;
