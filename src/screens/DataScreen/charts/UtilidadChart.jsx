import React from 'react';
import Plot from 'react-plotly.js';
import { Box, Typography } from '@mui/material';

const UtilidadChart = ({ utilidadMensual }) => {
  const data = [
    {
      x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      y: utilidadMensual.map(item => item.utilidad),
      type: 'bar',
      marker: { color: '#5E55FE' },
      hoverinfo: 'x+y',
      hovertemplate: '%{x}<br>%{y}<extra></extra>',
    }
  ];

  const annotations = utilidadMensual.map((item, index) => ({
    x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][index],
    y: item.utilidad,
    text: `$${item.utilidad.toLocaleString('es')}`,
    xanchor: 'center',
    yanchor: item.utilidad >= 0 ? 'bottom' : 'top',
    yshift: item.utilidad >= 0 ? 10 : -10,  // Ajusta la distancia del texto a la barra
    showarrow: false,
    font: {
      family: 'Poppins',
      size: 15,
      color: 'black',
      weight: 'bold',
    },
  }));

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
    showlegend: false,
    annotations: annotations,
    title: {
      font: {
        size: 24,
        color: '#333',
      },
      xref: 'paper',
      x: 0.05,
    },
    xaxis: {
      titlefont: {
        size: 18,
        color: '#333',
      },
    },
    yaxis: {
      titlefont: {
        size: 18,
        color: '#333',
      },
    },
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        EBITDA Mensual
      </Typography>
      <Plot data={data} layout={layout} />
    </Box>
  );
};

export default UtilidadChart;



