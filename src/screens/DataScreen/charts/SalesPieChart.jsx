import React from 'react';
import Plot from 'react-plotly.js';
import { Typography } from '@mui/material';

const SalesPieChart = ({ orders, productsMap }) => {
  const productSalesValue = {};
  let totalSales = 0;

  orders.forEach(order => {
    try {
      const productos = JSON.parse(order.productos);
      productos.forEach(product => {
        const productName = productsMap[product.id] || product.id;
        const productValue = product.price || 0;
        const quantity = product.quantity || 1;

        totalSales += productValue * quantity;

        if (productSalesValue[productName]) {
          productSalesValue[productName] += productValue * quantity;
        } else {
          productSalesValue[productName] = productValue * quantity;
        }
      });
    } catch (error) {
      console.error('Error parsing products:', error);
    }
  });

  const data = [{
    type: 'pie',
    values: Object.values(productSalesValue),
    labels: Object.keys(productSalesValue),
    textinfo: 'percent',
    insidetextorientation: 'radial',
    marker: {
      colors: ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#AB47BC', '#00ACC1', '#FF7043', '#9E9D24'],
    },
    hoverinfo: 'label+value',
    text: Object.values(productSalesValue).map(value => `${((value / totalSales) * 100).toFixed(2)}%`),
  }];

  const layout = {
    font: {
      family: 'Poppins',
    },
    height: 600,
    width: 700,
    paper_bgcolor: '#f8f9fa',
    plot_bgcolor: '#f8f9fa',
    showlegend: true,
    legend: {
      orientation: 'h',
      x: 0.5,
      xanchor: 'center',
      y: -0.1
    }
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', marginBottom: '20px' }}>
        Valor de Ventas por Producto
      </Typography>
      <Plot data={data} layout={layout} />
    </>
  );
};

export default SalesPieChart;
