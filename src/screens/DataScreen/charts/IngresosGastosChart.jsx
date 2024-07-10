import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography } from '@mui/material';

const IngresosGastosChart = ({ ingresosMensuales, gastosMensuales }) => {
  const data = [
    {
      x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      y: ingresosMensuales,
      type: 'bar',
      name: 'Ingresos',
      marker: { color: '#4285F4' },
      hoverinfo: 'x+y',
      hovertemplate: '%{x}<br>%{y}<extra></extra>',
    },
    {
      x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      y: gastosMensuales,
      type: 'bar',
      name: 'Gastos',
      marker: { color: '#DB4437' },
      hoverinfo: 'x+y',
      hovertemplate: '%{x}<br>%{y}<extra></extra>',
    }
  ];

  const layout = {
    font: {
      family: 'Poppins',
    },
    width: 1400,
    height: 600,
    margin: {
      l: 50,
      r: 50,
      b: 100,
      t: 100,
      pad: 4
    },
    paper_bgcolor: '#f8f9fa',
    plot_bgcolor: '#f8f9fa',
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.1
    },
    title: {
      font: {
        size: 24,
        color: '#333',
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      title: {
        font: {
          size: 18,
          color: '#333',
        },
      },
    },
    yaxis: {
      title: {
        font: {
          size: 18,
          color: '#333',
        },
      },
    },
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Ingresos y Gastos Mensuales
      </Typography>
      <Plot data={data} layout={layout} />
    </Box>
  );
};

export default IngresosGastosChart;
