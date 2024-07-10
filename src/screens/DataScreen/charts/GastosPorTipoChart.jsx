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

// Función para generar colores aleatorios
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const GastosPorTipoChart = () => {
  const [loading, setLoading] = useState(true);
  const [gastosData, setGastosData] = useState([]);
  const [pedidosData, setPedidosData] = useState([]);
  const [mesSeleccionado, setMesSeleccionado] = useState('');
  const [colorMap, setColorMap] = useState({});

  useEffect(() => {
    const fetchGastos = async () => {
      try {
        const responseGastos = await apiClient.get('/gastos');
        const responsePedidos = await apiClient.get('/pedidos_proveedores');
        const pedidosConTipo = responsePedidos.data.map(pedido => ({ ...pedido, tipo_gasto: 'Proveedores' }));

        setGastosData(responseGastos.data);
        setPedidosData(pedidosConTipo);

        const uniqueMonths = [...new Set([...responseGastos.data.map(gasto => new Date(gasto.fecha).getMonth()), ...pedidosConTipo.map(pedido => new Date(pedido.fecha_hora).getMonth())])];
        setMesSeleccionado(uniqueMonths[0]);

        const uniqueTipos = [...new Set([...responseGastos.data.map(gasto => gasto.tipo_gasto), ...pedidosConTipo.map(pedido => pedido.tipo_gasto)])];
        const colors = uniqueTipos.reduce((acc, tipo) => {
          acc[tipo] = getRandomColor();
          return acc;
        }, {});
        setColorMap(colors);
      } catch (error) {
        console.error('Error fetching gastos or pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGastos();
  }, []);

  const handleMesChange = (event) => {
    setMesSeleccionado(event.target.value);
  };

  const processData = (gastos, pedidos, mesSeleccionado) => {
    const data = {};

    const addData = (item, dateField, amountField, typeField) => {
      const month = new Date(item[dateField]).getMonth();
      if (month === mesSeleccionado) {
        const type = item[typeField];
        if (!data[type]) data[type] = 0;
        data[type] += item[amountField];
      }
    };

    gastos.forEach(gasto => addData(gasto, 'fecha', 'monto', 'tipo_gasto'));
    pedidos.forEach(pedido => addData(pedido, 'fecha_hora', 'total_costo', 'tipo_gasto'));

    return Object.keys(data).map(type => ({
      x: [type],
      y: [data[type]],
      type: 'bar',
      name: type,
      marker: { color: colorMap[type] || getRandomColor() } // Default color if not found
    }));
  };

  const data = processData(gastosData, pedidosData, mesSeleccionado);

  const annotations = data.map((trace) => ({
    x: trace.x[0],
    y: trace.y[0],
    text: formatCurrency(trace.y[0]),
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
    showlegend: true,
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

  const uniqueMonths = [...new Set([...gastosData.map(gasto => new Date(gasto.fecha).getMonth()), ...pedidosData.map(pedido => new Date(pedido.fecha_hora).getMonth())])];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Gastos por Tipo
      </Typography>
      <FormControl sx={{ mb: 4, minWidth: 200 }}>
        <InputLabel id="mes-select-label">Mes</InputLabel>
        <Select
          labelId="mes-select-label"
          value={mesSeleccionado}
          onChange={handleMesChange}
          label="Mes"
        >
          {uniqueMonths.map((month, index) => (
            <MenuItem key={index} value={month}>{new Date(0, month).toLocaleString('es-CO', { month: 'long' }).charAt(0).toUpperCase() + new Date(0, month).toLocaleString('es-CO', { month: 'long' }).slice(1)}</MenuItem>
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

export default GastosPorTipoChart;
