import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, Tabs, Tab, AppBar, useTheme } from '@mui/material';
import SalesChart from './charts/SalesChart';
import TransactionCountChart from './charts/TransactionCountChart';
import SalesDataViewer from './SalesDataViewer';
import SummaryKPI from './SummaryKPI';
import SummaryGastos from './SummaryGastos';
import deliveryCosts from '../../data/barrios';
import { apiClient } from '../../apiClient';
import TabPanel from '../GastosScreen/TabPanel';
import GastosChart from './charts/GastosChart';
import GastosPorTipoChart from './charts/GastosPorTipoChart';
import UtilidadChart from './charts/UtilidadChart';
import MargenChart from './charts/MargenChart';
import MargenOperativoChart from './charts/MargenOperativoChart';
import IngresosGastosChart from './charts/IngresosGastosChart';

import DataIcon from '../../assets/icons/data.png';

const DataScreen = () => {
  const theme = useTheme();
  const [orders, setOrders] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingGastos, setLoadingGastos] = useState(true);
  const [productsMap, setProductsMap] = useState({});
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const ordersResponse = await apiClient.get('/pedidos');
        const filteredOrders = ordersResponse.data.filter(order => 
          order.estado === 'Pedido Confirmado' || order.estado === 'Pedido Enviado'
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoadingOrders(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const productsResponse = await apiClient.get('/productos');
        const productsMap = productsResponse.data.reduce((acc, product) => {
          acc[product.id] = product.nombre;
          return acc;
        }, {});
        setProductsMap(productsMap);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchGastos = async () => {
      try {
        const gastosResponse = await apiClient.get('/gastos');
        setGastos(gastosResponse.data);
      } catch (error) {
        console.error('Error fetching gastos:', error);
      } finally {
        setLoadingGastos(false);
      }
    };

    fetchOrders();
    fetchProducts();
    fetchGastos();
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const calculateUtilidadMensual = () => {
    const ventasPorMes = Array(12).fill(0);
    const gastosPorMes = Array(12).fill(0);

    orders.forEach(order => {
      const month = new Date(order.fecha_hora).getUTCMonth();  // Cambio aquí
      ventasPorMes[month] += order.total_productos + (deliveryCosts[order.barrio] || 0);
    });

    gastos.forEach(gasto => {
      const month = new Date(gasto.fecha).getUTCMonth();  // Cambio aquí
      gastosPorMes[month] += gasto.monto;
    });

    return ventasPorMes.map((venta, index) => ({
      mes: index,
      utilidad: venta - gastosPorMes[index],
      margen: venta !== 0 ? ((venta - gastosPorMes[index]) / venta) * 100 : 0
    }));
  };

  const calculateMargenBrutoMensual = () => {
    const ventasPorMes = Array(12).fill(0);
    const costosInsumosPorMes = Array(12).fill(0);

    orders.forEach(order => {
      const month = new Date(order.fecha_hora).getUTCMonth();  // Cambio aquí
      ventasPorMes[month] += order.total_productos + (deliveryCosts[order.barrio] || 0);
    });

    gastos.forEach(gasto => {
      if (gasto.tipo_gasto === 'Proveedores' || gasto.tipo_gasto === 'Insumos') {
        const month = new Date(gasto.fecha).getUTCMonth();  // Cambio aquí
        costosInsumosPorMes[month] += gasto.monto;
      }
    });

    return ventasPorMes.map((venta, index) => ({
      mes: index,
      margenBruto: venta !== 0 ? ((venta - costosInsumosPorMes[index]) / venta) * 100 : 0
    }));
  };

  const calculateMargenOperativoMensual = () => {
    const ventasPorMes = Array(12).fill(0);
    const gastosPorMes = Array(12).fill(0);

    orders.forEach(order => {
      const month = new Date(order.fecha_hora).getUTCMonth();  // Cambio aquí
      ventasPorMes[month] += order.total_productos + (deliveryCosts[order.barrio] || 0);
    });

    gastos.forEach(gasto => {
      const month = new Date(gasto.fecha).getUTCMonth();  // Cambio aquí
      gastosPorMes[month] += gasto.monto;
    });

    return ventasPorMes.map((venta, index) => ({
      mes: index,
      margenOperativo: venta !== 0 ? ((venta - gastosPorMes[index]) / venta) * 100 : 0
    }));
  };

  const calculateIngresosGastosMensuales = () => {
    const ingresosPorMes = Array(12).fill(0);
    const gastosPorMes = Array(12).fill(0);

    orders.forEach(order => {
      const month = new Date(order.fecha_hora).getUTCMonth();  // Cambio aquí
      ingresosPorMes[month] += order.total_productos + (deliveryCosts[order.barrio] || 0);
    });

    gastos.forEach(gasto => {
      const month = new Date(gasto.fecha).getUTCMonth();  // Cambio aquí
      gastosPorMes[month] += gasto.monto;
    });

    return {
      ingresosMensuales: ingresosPorMes,
      gastosMensuales: gastosPorMes,
    };
  };

  const { ingresosMensuales, gastosMensuales } = calculateIngresosGastosMensuales();

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img src={DataIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2) }} />
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
           El Centro de Inteligencia
        </Typography>
      </Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="data tabs"
          TabIndicatorProps={{ style: { backgroundColor: '#5E55FE', height: '4px' } }}
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              color: '#5E55FE',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px 8px 0 0',
              '&.Mui-selected': {
                color: '#ffffff',
                backgroundColor: '#5E55FE',
              },
            },
            '& .MuiTabs-flexContainer': {
              borderBottom: '1px solid #5E55FE',
            },
          }}
        >
          <Tab label="Ventas" />
          <Tab label="Gastos" />
          <Tab label="Operación" />
        </Tabs>
      </AppBar>
      <TabPanel value={currentTab} index={0}>
        {loadingOrders ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SummaryKPI orders={orders} productsMap={productsMap} />
            <SalesChart orders={orders} deliveryCosts={deliveryCosts} productsMap={productsMap} />
            <TransactionCountChart orders={orders} />
            <SalesDataViewer orders={orders} productsMap={productsMap} />
          </>
        )}
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        {loadingGastos ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <SummaryGastos gastos={gastos} />
            <GastosChart />
            <GastosPorTipoChart />
          </>
        )}
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        {loadingOrders || loadingGastos ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <UtilidadChart utilidadMensual={calculateUtilidadMensual()} />
            <MargenChart margenMensual={calculateMargenBrutoMensual()} />
            <MargenOperativoChart margenOperativoMensual={calculateMargenOperativoMensual()} />
            <IngresosGastosChart ingresosMensuales={ingresosMensuales} gastosMensuales={gastosMensuales} />
          </>
        )}
      </TabPanel>
    </Box>
  );
};

export default DataScreen;


