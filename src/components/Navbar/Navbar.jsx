import React, { useState } from 'react';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Modal,
  Typography,
  useMediaQuery,
  useTheme,
  ListItemText,
  Divider,
  Tooltip
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, useLocation } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

import LoginForm from '../LoginForm/LoginForm';
import logo from '../../assets/irr-texto.png';

// Iconos
import OrdenesIcon from '../../assets/icons/ordenes.png';
import ProductosIcon from '../../assets/icons/productos.png';
import CostosIcon from '../../assets/icons/costos.png';
import DataIcon from '../../assets/icons/data.png';
import SoporteIcon from '../../assets/icons/soporte.png';
import GastosIcon from '../../assets/icons/gastos.png';
import ProveedoresIcon from '../../assets/icons/proveedores.png';
import ClientIcon from '../../assets/icons/clientes.png';
import ConfigIcon from '../../assets/icons/config.png';
import EntregasIcon from '../../assets/icons/entregas.png';

import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { pathname } = useLocation();

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);
  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.up('sm'));

  const navItems = [
    { to: '/orders', icon: OrdenesIcon, text: 'Órdenes' },
    { to: '/products', icon: ProductosIcon, text: 'Productos' },
    { to: '/stock', icon: EntregasIcon, text: 'Inventarios' },
    { to: '/clients', icon: ClientIcon, text: 'Clientes' },
    { to: '/costos', icon: CostosIcon, text: 'Costos' },
    { to: '/suppliers', icon: ProveedoresIcon, text: 'Proveedores' },
    { to: '/gastos', icon: GastosIcon, text: 'Gastos' },
    { to: '/data', icon: DataIcon, text: 'Data' },
    { to: '/params', icon: ConfigIcon, text: 'Parámetros' },
    { to: '/soporte', icon: SoporteIcon, text: 'Soporte' }
  ];

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 1 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerOpen}
          sx={{ marginRight: 2, marginLeft: 1 }}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Drawer
        variant={isMatch ? 'permanent' : 'temporary'}
        open={isMatch ? true : drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          width: isMatch ? 240 : 'auto',
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: isMatch ? 240 : 'auto',
            boxSizing: 'border-box',
            padding: theme.spacing(3),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#ffffff',
            boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Link to="/" onClick={handleDrawerClose}>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img src={logo} alt="Logo" width="180" />
            </Box>
          </Link>
          <Divider sx={{ mb: 2 }} />
          <List>
            {navItems.map((item) => (
              <Tooltip title={item.text} key={item.text} placement="right" arrow>
                <ListItem
                  button
                  component={Link}
                  to={item.to}
                  sx={{
                    justifyContent: 'flex-start',
                    my: 1.5,
                    px: 2,
                    borderRadius: '8px',
                    '&:hover': { backgroundColor: '#f0f0f0' },
                    transition: 'background-color 0.3s ease, transform 0.2s ease',
                    '&:active': { transform: 'scale(0.98)' },
                    backgroundColor: pathname === item.to ? '#d7d7f7' : 'transparent', // Cambio de color si está activo
                  }}
                  onClick={handleDrawerClose}
                >
                  <ListItemIcon sx={{ minWidth: '45px' }}>
                    <img src={item.icon} alt={item.text} style={{ width: 24, height: 24 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: 'Providence Sans Pro',
                          color: '#333',
                          fontWeight: '600',
                        }}
                      >
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItem>
              </Tooltip>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 2.5 }}>
          <Button
            startIcon={isAuthenticated ? <LogoutIcon /> : <LoginIcon />}
            onClick={isAuthenticated ? handleLogout : handleLoginOpen}
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#5E55FE',
              '&:hover': { backgroundColor: '#7b45a1' },
              color: 'white',
              fontFamily: 'Poppins',
              borderRadius: '10px',
              textTransform: 'none',
              padding: '10px 7px',
              fontSize: '17px',
              marginTop: '7px',
              marginBottom: '5px',
              marginLeft: '7px',
              fontWeight: 'bold',
              boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            {isAuthenticated ? 'Cerrar Sesión' : 'Iniciar Sesión'}
          </Button>
        </Box>
      </Drawer>
      <Modal open={loginOpen} onClose={handleLoginClose}>
        <LoginForm handleClose={handleLoginClose} />
      </Modal>
    </Box>
  );
};

export default Navbar;


