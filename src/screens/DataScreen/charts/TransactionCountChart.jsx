import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { Box, FormControl, InputLabel, Select, MenuItem, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

const TransactionCountChart = ({ orders }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [viewType, setViewType] = useState('Mensual');

  const filteredOrders = orders.filter(order =>
    order.estado === 'Pedido Confirmado' || order.estado === 'Pedido Enviado'
  );

  const groupTransactions = () => {
    const grouped = {};
    filteredOrders.forEach(order => {
      const date = order.fecha_hora.split(' ')[0];
      const period = viewType === 'Diario' ? date : date.slice(0, 7);

      if (grouped[period]) {
        grouped[period] += 1;
      } else {
        grouped[period] = 1;
      }
    });
    return grouped;
  };

  const getMonthlyData = (year) => {
    const monthlyData = Array(12).fill(0);
    Object.entries(groupTransactions()).forEach(([date, count]) => {
      if (date.startsWith(year)) {
        const month = parseInt(date.split('-')[1], 10) - 1;
        monthlyData[month] = count;
      }
    });
    return monthlyData;
  };

  const filteredTransactions = viewType === 'Diario'
    ? Object.entries(groupTransactions()).reduce((acc, [date, count]) => {
        if (date.startsWith(selectedMonth)) {
          acc[date] = count;
        }
        return acc;
      }, {})
    : getMonthlyData(selectedYear);

  const data = [
    {
      type: 'bar',
      x: viewType === 'Diario' ? Object.keys(filteredTransactions) : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      y: viewType === 'Diario' ? Object.values(filteredTransactions) : filteredTransactions,
      marker: {
        color: '#5E55FE',
        opacity: 0.8,
        line: {
          color: '#3E3BA0',
          width: 2,
        },
      },
      hoverinfo: 'x+y',
      hovertemplate: '%{x}<br>%{y}<extra></extra>',
    },
  ];

  const annotations = (viewType === 'Diario' ? Object.entries(filteredTransactions) : filteredTransactions.map((value, index) => ([index, value])))
    .map(([key, value]) => ({
      x: viewType === 'Diario' ? key : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][key],
      y: value,
      text: `${value}`,
      xanchor: 'center',
      yanchor: 'bottom',
      showarrow: false,
      font: {
        family: 'Poppins, sans-serif',
        size: 14,
        color: '#333333',
      },
    }));

  const layout = {
    title: {
      text: viewType === 'Diario' ? 'Cantidad de Transacciones Diarias' : 'Cantidad de Transacciones Mensuales',
      font: {
        family: 'Poppins, sans-serif',
        size: 24,
        color: '#333333',
        weight: 'bold',
      },
      xref: 'paper',
      x: 0.5,
      xanchor: 'center',
    },
    plot_bgcolor: 'transparent',
    paper_bgcolor: '#ffffff',
    xaxis: {
      showgrid: false,
      tickfont: {
        family: 'Roboto, sans-serif',
        size: 14,
        color: '#666666',
      },
    },
    yaxis: {
      showgrid: true,
      gridcolor: '#eaeaea',
      tickfont: {
        family: 'Roboto, sans-serif',
        size: 14,
        color: '#666666',
      },
    },
    margin: {
      l: 60,
      r: 30,
      b: 50,
      t: 50,
    },
    hovermode: 'closest',
    height: 400,
    annotations: annotations,
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleViewTypeChange = (event, newViewType) => {
    if (newViewType !== null) {
      setViewType(newViewType);
    }
  };

  const uniqueMonths = Array.from(new Set(orders.map(order => order.fecha_hora.slice(0, 7)))).sort();
  const uniqueYears = Array.from(new Set(orders.map(order => order.fecha_hora.slice(0, 4)))).sort();

  const getLocaleDateString = (dateString) => {
    const [year, month] = dateString.split('-');
    const date = new Date(year, month - 1, 1);
    return date.toLocaleDateString('es', { month: 'long', year: 'numeric' });
  };

  return (
    <Box
      sx={{
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
        maxWidth: '1000px',
        margin: '0 auto',
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Cantidad de Transacciones
      </Typography>

      {/* Toggle de vista */}
      <Box sx={{ maxWidth: 300, mb: 2, display: 'flex', justifyContent: 'center' }}>
        <ToggleButtonGroup
          value={viewType}
          exclusive
          onChange={handleViewTypeChange}
        >
          <ToggleButton value="Diario">Diario</ToggleButton>
          <ToggleButton value="Mensual">Mensual</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Dropdown para Mes o Año */}
      {viewType === 'Diario' ? (
        <Box sx={{ maxWidth: 300, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="month-select-label">Mes</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {uniqueMonths.map((month) => (
                <MenuItem key={month} value={month}>
                  {getLocaleDateString(month)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      ) : (
        <Box sx={{ maxWidth: 300, mb: 2, display: 'flex', justifyContent: 'center' }}>
          <FormControl fullWidth>
            <InputLabel id="year-select-label">Año</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {uniqueYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box sx={{ width: '100%' }}>
        <Plot
          data={data}
          layout={layout}
          style={{ width: '100%', height: '100%' }}
          config={{
            responsive: true,
            displayModeBar: false,
          }}
        />
      </Box>
    </Box>
  );
};

export default TransactionCountChart;
