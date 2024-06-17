import React from 'react';
import { Box, Typography, Button, Grid, Container, useMediaQuery, useTheme, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoDeveloper from '../../assets/logo33.png';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StorefrontIcon from '@mui/icons-material/Storefront';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PaymentIcon from '@mui/icons-material/Payment';

function HomePage() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const logo_url = useSelector(state => state.auth.logo_url);
  const establecimiento = useSelector(state => state.auth.establecimiento);

  // Función para capitalizar cada palabra
  const capitalizeWords = (str) => {
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const cardStyles = {
    width: 275,
    height: 'auto',
    borderRadius: '18px',
    transition: 'transform 0.3s',
    border: '2px solid black',
    backgroundColor: '#f5f5f5',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    }
  };

  return (
    <Container style={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundSize: 'cover', 
      backgroundRepeat: 'no-repeat',
      padding: '2rem 0'
    }}>
      
      <Box sx={{ padding: '3rem 0', textAlign: isSmallScreen ? 'center' : 'initial' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img src={logo_url} alt="Logo del cliente" width={isSmallScreen ? '150' : '250'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              Bienvenido a <span style={{ fontWeight: 'bold', color: '#5E55FE' }}>Zeendr</span>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Gestiona eficazmente tus planes de servicio de domicilios propios y ten total control sobre tus pedidos.
            </Typography>
            {establecimiento && (
              <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 'bold', color: '#5E55FE' }}>
                {capitalizeWords(establecimiento)}
              </Typography>
            )}
            <Button 
              variant="contained" 
              size="large" 
              sx={{
                mt: 2, 
                backgroundColor: '#5E55FE', 
                color: 'white', 
                borderRadius: '10px', 
                '&:hover': { backgroundColor: '#7b45a1' },
              }}
            >
              Empezar
            </Button>
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ margin: '4rem 0' }}>
        <Typography variant="h3" gutterBottom textAlign="center" sx={{ mb: 3 }}>
          Funciones principales
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Domicilios", desc: "Visualice todos sus pedidos a domicilio en tiempo real", link: '/orders', icon: <DeliveryDiningIcon /> },
            { title: "Productos", desc: "Añade y elimina productos para que tus clientes ordenen", link: '/products', icon: <AddShoppingCartIcon /> },
            { title: "Stock Productos", desc: "Controle los inventarios de sus productos y sus ventas", link: '/stock', icon: <FastfoodIcon /> },
            { title: "Clientes", desc: "Conozca y entienda a sus clientes para vender mas", link: '/clients', icon: <EmojiPeopleIcon /> },
            { title: "Centro de Costos", desc: "Tenga control total sobre los costos de su negocio", link: '/costos', icon: <AttachMoneyIcon /> },
            { title: "Proveedores", desc: "Ten control total de tu proveedores", link: '/suppliers', icon: <StorefrontIcon /> },
            { title: "Data", desc: "Entiende tu negocio desde los datos", link: '/data', icon: <WaterfallChartIcon /> },
            { title: "Parametros", desc: "Personaliza tu software al 100% para tener lo que quieres", link: '/params', icon: <SettingsIcon /> },
            { title: "Gastos", desc: "Ten Control de tus gastos de operacion", link: '/gastos', icon: <PaymentIcon /> }
          ].map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={cardStyles}>
                  <CardHeader
                    avatar={<Avatar aria-label="feature" sx={{ backgroundColor: '#5E55FE', color: 'white' }}>{item.icon || item.title.charAt(0)}</Avatar>}
                    title={item.title}
                  />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">
                      {item.desc}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ padding: '3rem 0', backgroundColor: '#f0f0f0', width: '100%' }}>
        <Typography variant="body2" align="center">
          Desarrollado por:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <img src={logoDeveloper} alt="Logo del desarrollador" width="150" />
        </Box>
      </Box>
      
    </Container>
  );
}

export default HomePage;
