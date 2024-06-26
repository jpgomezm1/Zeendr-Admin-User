import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';
import { styled } from '@mui/system';
import PaymentMethodCell from './PaymentMethodCell';
import EstadoCell from './EstadoCell';
import ProductosCell from './ProductosCell';
import './DeliveryScreen.css';

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
  fontWeight: 'bold'
}));

const getRowClassName = (estado) => {
  switch (estado) {
    case 'Pedido Recibido':
      return 'pedido-recibido';
    case 'Pedido Confirmado':
      return 'pedido-confirmado';
    case 'Pedido Enviado':
      return 'pedido-enviado';
    case 'Pedido Rechazado':
      return 'pedido-rechazado';
    default:
      return '';
  }
};

const OrderTable = ({ orders, onOpenComprobanteDialog, onEstadoChange, onOpenProductosDialog }) => {
  return (
    <Box sx={{ height: 'auto', width: '100%', padding: 2 }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Nombre</StyledTableCell>
                <StyledTableCell>Teléfono</StyledTableCell>
                <StyledTableCell>Dirección</StyledTableCell>
                <StyledTableCell>Fecha</StyledTableCell>
                <StyledTableCell>Fecha Entrega</StyledTableCell>
                <StyledTableCell>Rango Horas</StyledTableCell>
                <StyledTableCell>$ Productos</StyledTableCell>
                <StyledTableCell>$ Domicilio</StyledTableCell>
                <StyledTableCell>$ Total</StyledTableCell>
                <StyledTableCell>Productos</StyledTableCell>
                <StyledTableCell>Método de Pago</StyledTableCell>
                <StyledTableCell>Estado</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((row) => (
                <TableRow key={row.id} className={getRowClassName(row.estado)}>
                  <TableCell>{row.nombre_completo}</TableCell>
                  <TableCell>{row.numero_telefono}</TableCell>
                  <TableCell>{row.direccion}</TableCell>
                  <TableCell>{row.fecha}</TableCell>
                  <TableCell>{row.fecha_entrega || 'No programada'}</TableCell>
                  <TableCell>{row.rango_horas || 'No programado'}</TableCell>
                  <TableCell>{formatCurrency(row.total)}</TableCell>
                  <TableCell>{formatCurrency(row.total_domicilio)}</TableCell>
                  <TableCell>{formatCurrency(row.total_venta)}</TableCell>
                  <TableCell>
                    <ProductosCell value={row.productos} row={row} onOpenDialog={onOpenProductosDialog} />
                  </TableCell>
                  <TableCell>
                    <PaymentMethodCell value={row.metodo_pago} row={row} onOpenDialog={onOpenComprobanteDialog} />
                  </TableCell>
                  <TableCell>
                    <EstadoCell value={row.estado} row={row} onEstadoChange={onEstadoChange} />
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

export default OrderTable;
