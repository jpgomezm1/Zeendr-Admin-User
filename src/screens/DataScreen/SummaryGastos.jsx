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

const SummaryGastos = ({ gastos }) => {
  const currentMonthDate = new Date();
  const lastMonthDate = new Date(new Date().setMonth(currentMonthDate.getMonth() - 1));

  const currentMonth = currentMonthDate.toISOString().slice(0, 7);
  const lastMonth = lastMonthDate.toISOString().slice(0, 7);

  const currentMonthGastos = gastos.filter(gasto => gasto.fecha.startsWith(currentMonth));
  const lastMonthGastos = gastos.filter(gasto => gasto.fecha.startsWith(lastMonth));

  const calculateTotalGastos = (gastos) => {
    return gastos.reduce((sum, gasto) => sum + gasto.monto, 0);
  };

  const totalCurrentMonthGastos = calculateTotalGastos(currentMonthGastos);
  const totalLastMonthGastos = calculateTotalGastos(lastMonthGastos);

  const currentMonthGastosByType = currentMonthGastos.reduce((acc, gasto) => {
    if (acc[gasto.tipo_gasto]) {
      acc[gasto.tipo_gasto] += gasto.monto;
    } else {
      acc[gasto.tipo_gasto] = gasto.monto;
    }
    return acc;
  }, {});

  const currentMonthName = getMonthName(currentMonthDate);
  const lastMonthName = getMonthName(lastMonthDate);

  return (
    <Box sx={{ flexGrow: 1, mb: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Total Gastos ${currentMonthName}`} value={formatCurrency(totalCurrentMonthGastos)} />
        </Grid>
        <Grid item xs={12} md={4}>
          <SummaryCard title={`Total Gastos ${lastMonthName}`} value={formatCurrency(totalLastMonthGastos)} />
        </Grid>
        {Object.entries(currentMonthGastosByType).map(([tipo, monto], index) => (
          <Grid item xs={12} md={4} key={index}>
            <SummaryCard title={`Gastos en ${tipo}`} value={formatCurrency(monto)} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SummaryGastos;
