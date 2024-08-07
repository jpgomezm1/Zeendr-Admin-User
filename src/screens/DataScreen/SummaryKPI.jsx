import React from 'react';
import { Box, Typography, Grid, useTheme } from '@mui/material';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const getMonthName = (date) => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[date.getMonth()];
};

const SummaryCard = ({ title, value }) => {
  const theme = useTheme();

  const cardStyles = {
    padding: 2,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: 'center',
    color: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7B11F5, #A46BF5)',
  };

  return (
    <Box sx={cardStyles}>
      <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
        {title}
      </Typography>
      <Typography variant="h5" component="div" sx={{ fontWeight: 400, fontFamily: 'Poppins' }}>
        {value}
      </Typography>
    </Box>
  );
};

const TopProductsCard = ({ title, products }) => {
  const theme = useTheme();

  const cardStyles = {
    padding: 2,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: 'center',
    color: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7B11F5, #A46BF5)',
  };

  return (
    <Box sx={cardStyles}>
      <Typography variant="h6" component="div" sx={{ fontWeight: 600, fontFamily: 'Poppins' }}>
        {title}
      </Typography>
      <Box sx={{ mt: 1 }}>
        {products.map((product, index) => (
          <Typography key={index} variant="body1" sx={{ fontWeight: 600, fontFamily: 'Poppins', color: 'white' }}>
            {product}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

const SummaryKPI = ({ orders, productsMap }) => {
  const currentMonthDate = new Date();
  const lastMonthDate = new Date(new Date().setMonth(currentMonthDate.getMonth() - 1));

  const currentMonth = currentMonthDate.toISOString().slice(0, 7);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);

  const filterOrdersByState = (orders) => {
    return orders.filter(order => order.estado === 'Pedido Confirmado' || order.estado === 'Pedido Enviado');
  };

  const currentMonthOrders = filterOrdersByState(orders.filter(order => order.fecha_hora.startsWith(currentMonth)));
  const lastMonthOrders = filterOrdersByState(orders.filter(order => order.fecha_hora.startsWith(lastMonth)));

  const calculateKPIs = (orders) => {
    const totalVentas = orders.reduce((sum, order) => sum + order.total_productos, 0);
    const numeroPedidos = orders.length;
    const ticketPromedio = numeroPedidos === 0 ? 0 : totalVentas / numeroPedidos;

    const productSales = {};
    orders.forEach(order => {
      const productos = JSON.parse(order.productos);
      productos.forEach(product => {
        const productName = productsMap[product.id] || product.id;
        const quantity = product.quantity || 1;
        if (productSales[productName]) {
          productSales[productName] += quantity;
        } else {
          productSales[productName] = quantity;
        }
      });
    });

    const top5Products = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, quantity]) => `${name}: ${quantity}`);

    return { totalVentas, numeroPedidos, ticketPromedio, top5Products };
  };

  const currentMonthKPIs = calculateKPIs(currentMonthOrders);
  const lastMonthKPIs = calculateKPIs(lastMonthOrders);

  const currentMonthName = getMonthName(currentMonthDate);
  const lastMonthName = getMonthName(lastMonthDate);

  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Total Ventas ${currentMonthName}`} value={formatCurrency(currentMonthKPIs.totalVentas)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Total Ventas ${lastMonthName}`} value={formatCurrency(lastMonthKPIs.totalVentas)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Número de Pedidos ${currentMonthName}`} value={currentMonthKPIs.numeroPedidos} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Número de Pedidos ${lastMonthName}`} value={lastMonthKPIs.numeroPedidos} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Ticket Promedio ${currentMonthName}`} value={formatCurrency(currentMonthKPIs.ticketPromedio)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Ticket Promedio ${lastMonthName}`} value={formatCurrency(lastMonthKPIs.ticketPromedio)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopProductsCard title={`Top 5 Productos ${currentMonthName}`} products={currentMonthKPIs.top5Products} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopProductsCard title={`Top 5 Productos ${lastMonthName}`} products={lastMonthKPIs.top5Products} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default SummaryKPI;


