import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import deliveryCosts from '../../data/barrios';
import { apiClient } from '../../apiClient';  // Importa el apiClient configurado

import ClientIcon from '../../assets/icons/clientes.png';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.common.black,
  color: theme.palette.common.white,
  fontWeight: 'bold',
}));

const ClientsScreen = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await apiClient.get('/pedidos');
        const ordersData = ordersResponse.data;
        setOrders(ordersData);

        const clientsMap = ordersData.reduce((acc, order) => {
          const { numero_telefono, nombre_completo, total_productos, barrio, correo_electronico } = order;

          const totalDomicilio = deliveryCosts[barrio] || 0;
          const totalVenta = total_productos + totalDomicilio;

          if (!acc[numero_telefono]) {
            acc[numero_telefono] = {
              nombre_completo,
              numero_telefono,
              correo_electronico,
              total_gastado: 0,
              total_productos_gastado: 0,
              pedidos: [],
            };
          }

          acc[numero_telefono].pedidos.push(order);
          acc[numero_telefono].total_gastado += totalVenta;
          acc[numero_telefono].total_productos_gastado += total_productos;
          return acc;
        }, {});

        const clientsArray = Object.values(clientsMap);
        setClients(clientsArray);

      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateAverageTicket = (totalProducts, numOrders) => {
    return numOrders === 0 ? 0 : totalProducts / numOrders;
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img src={ClientIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2) }} />
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
            Tu Escuadrón de Leales
        </Typography>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Nombre Completo</StyledTableCell>
                  <StyledTableCell>Número de Teléfono</StyledTableCell>
                  <StyledTableCell>Correo Electrónico</StyledTableCell>
                  <StyledTableCell>Número de Pedidos</StyledTableCell>
                  <StyledTableCell>Total Gastado</StyledTableCell>
                  <StyledTableCell>Gasto en Productos</StyledTableCell>
                  <StyledTableCell>Ticket Promedio</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clients.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell>{client.nombre_completo}</TableCell>
                    <TableCell>{client.numero_telefono}</TableCell>
                    <TableCell>{client.correo_electronico}</TableCell>
                    <TableCell>{client.pedidos.length}</TableCell>
                    <TableCell>{formatCurrency(client.total_gastado)}</TableCell>
                    <TableCell>{formatCurrency(client.total_productos_gastado)}</TableCell>
                    <TableCell>{formatCurrency(calculateAverageTicket(client.total_productos_gastado, client.pedidos.length))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default ClientsScreen;
