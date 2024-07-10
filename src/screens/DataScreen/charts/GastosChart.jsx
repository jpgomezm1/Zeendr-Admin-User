import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { CircularProgress, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { apiClient } from '../../../apiClient';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const GastosChart = () => {
  const [loading, setLoading] = useState(true);
  const [gastosData, setGastosData] = useState([]);
  const [pedidosData, setPedidosData] = useState([]);
  const [tipoGastoSeleccionado, setTipoGastoSeleccionado] = useState('Todos');
  const [tiposDeGasto, setTiposDeGasto] = useState([]);

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const responseGastos = await apiClient.get('/gastos');
        const responsePedidos = await apiClient.get('/pedidos_proveedores');
        const pedidosConTipo = responsePedidos.data.map(pedido => ({ ...pedido, tipo_gasto: 'Proveedores' }));

        setGastosData(responseGastos.data);
        setPedidosData(pedidosConTipo);

        const tipos = ['Todos', ...new Set(responseGastos.data.map(gasto => gasto.tipo_gasto)), 'Proveedores'];
        setTiposDeGasto(tipos);
      } catch (error) {
        console.error('Error fetching gastos or pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  const processData = (gastos, pedidos, tipoSeleccionado) => {
    const monthlyData = Array(12).fill(0);

    const filtrarPorTipo = (data) => {
      return data.filter(item => tipoSeleccionado === 'Todos' || item.tipo_gasto === tipoSeleccionado);
    };

    filtrarPorTipo(gastos).forEach((gasto) => {
      const month = new Date(gasto.fecha).getMonth();
      monthlyData[month] += gasto.monto;
    });

    filtrarPorTipo(pedidos).forEach((pedido) => {
      const month = new Date(pedido.fecha_hora).getMonth();
      monthlyData[month] += pedido.total_costo;
    });

    return monthlyData.map(value => formatCurrency(value));
  };

  const monthlyData = processData(gastosData, pedidosData, tipoGastoSeleccionado);

  const data = [
    {
      x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      y: monthlyData.map(value => parseFloat(value.replace(/[^0-9.-]+/g, ""))), // Convertir el valor a número
      type: 'bar',
      marker: { color: '#5E55FE' },
      hoverinfo: 'x+y',
      hovertemplate: '%{x}<br>%{y}<extra></extra>',
    }
  ];

  const annotations = monthlyData.map((value, index) => ({
    x: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'][index],
    y: parseFloat(value.replace(/[^0-9.-]+/g, "")),
    text: value,
    xanchor: 'center',
    yanchor: 'bottom',
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
        Gastos Mensuales
      </Typography>
      <FormControl sx={{ mb: 4, minWidth: 200 }}>
        <InputLabel id="tipo-gasto-select-label">Tipo de Gasto</InputLabel>
        <Select
          labelId="tipo-gasto-select-label"
          value={tipoGastoSeleccionado}
          onChange={(e) => setTipoGastoSeleccionado(e.target.value)}
          label="Tipo de Gasto"
        >
          {tiposDeGasto.map((tipo, index) => (
            <MenuItem key={index} value={tipo}>{tipo}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Plot data={data} layout={layout} />
      )}
    </Box>
  );
};

export default GastosChart;


