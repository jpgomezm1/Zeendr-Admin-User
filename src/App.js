// App.js
import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './App.css';

// Importamos los componentes
import HomePage from './screens/HomePage/HomePage';
import Navbar from './components/Navbar/Navbar';
import LoginForm from './components/LoginForm/LoginForm';
import DeliveryScreen from './screens/DeliveryScreen/DeliveryScreen';
import PaginaProductos from './screens/PaginaProductos/PaginaProductos';
import DataScreen from './screens/DataScreen/DataScreen';
import ClientsScreen from './screens/ClientsScreen/ClientsScreen';
import ParametrosScreen from './screens/ParametrosScreen/ParametrosScreen';
import SoporteScreen from './screens/SoporteScreen/SoporteScreen';
import StockScreen from './screens/StockScreen/StockScreen';
import CostosScreen from './screens/CostosScreen/CostosScreen';
import ProvedoresScreen from './screens/ProvedoresScreen/ProvedoresScreen';
import GastosScreen from './screens/GastosScreen/GastosScreen';
import DespachosScreen from './screens/DespachosScreen/DespachosScreen';
import Loader from './components/Loader/Loader';
import Whatsapp from './components/Whatsapp/Whatsapp';

import { Provider } from 'react-redux';
import store from './redux/store';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

const ProtectedRoutes = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  if (showLoader) {
    return <Loader />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'center',
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: '100%', sm: '67%' },
          maxWidth: '1200px',
        }}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/orders" element={<DeliveryScreen />} />
          <Route path="/products" element={<PaginaProductos />} />
          <Route path="/data" element={<DataScreen />} />
          <Route path="/clients" element={<ClientsScreen />} />
          <Route path="/params" element={<ParametrosScreen />} />
          <Route path="/soporte" element={<SoporteScreen />} />
          <Route path="/stock" element={<StockScreen />} />
          <Route path="/costos" element={<CostosScreen />} />
          <Route path="/despachos" element={<DespachosScreen />} />
          <Route path="/suppliers" element={<ProvedoresScreen />} />
          <Route path="/gastos" element={<GastosScreen />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ProtectedRoutes />
          <Whatsapp />
        </ThemeProvider>
      </Router>
    </Provider>
  );
};

export default App;

