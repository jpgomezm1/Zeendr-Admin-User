import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Container,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  CardHeader,
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoDeveloper from '../../assets/irre-logo.png';

// Importar iconos personalizados
import OrdenesIcon from '../../assets/icons/ordenes.png';
import ProductosIcon from '../../assets/icons/productos.png';
import EntregasIcon from '../../assets/icons/entregas.png';
import ClientIcon from '../../assets/icons/clientes.png';
import CostosIcon from '../../assets/icons/costos.png';
import ProveedoresIcon from '../../assets/icons/proveedores.png';
import GastosIcon from '../../assets/icons/gastos.png';
import DataIcon from '../../assets/icons/data.png';
import ConfigIcon from '../../assets/icons/config.png';

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
      padding: '2rem 0',
    }}>
      <Box sx={{ padding: '3rem 0', textAlign: isSmallScreen ? 'center' : 'initial' }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <img src={logo_url} alt="Logo del cliente" width={isSmallScreen ? '150' : '250'} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontFamily: 'Providence Sans Pro' }}>
               Bienvenido a <span style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold', color: '#5E55FE' }}>ir</span><span style={{fontFamily: 'Providence Sans Pro', fontWeight: 'bold', color: '#000000' }}>relevant</span>
            </Typography>
            <Typography variant="h6" gutterBottom>
              Donde la tecnología hace lo aburrido y tú te quedas con lo divertido. Toma las decisiones que importan mientras nosotros manejamos el resto.
            </Typography>
            {establecimiento && (
              <Typography variant="h4" component="h2" gutterBottom sx={{fontFamily: 'Providence Sans Pro', mt: 2, fontWeight: 'bold', color: '#5E55FE' }}>
                {capitalizeWords(establecimiento)}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
      
      <Box sx={{ margin: '4rem 0' }}>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: "Órdenes", desc: "Visualice todos sus pedidos a domicilio en tiempo real", link: '/orders', icon: OrdenesIcon },
            { title: "Productos", desc: "Añade y elimina productos para que tus clientes ordenen", link: '/products', icon: ProductosIcon },
            { title: "Inventarios", desc: "Controle los inventarios de sus productos y sus ventas", link: '/stock', icon: EntregasIcon },
            { title: "Clientes", desc: "Conozca y entienda a sus clientes para vender más", link: '/clients', icon: ClientIcon },
            { title: "Costos", desc: "Tenga control total sobre los costos de su negocio", link: '/costos', icon: CostosIcon },
            { title: "Proveedores", desc: "Ten control total de tu proveedores", link: '/suppliers', icon: ProveedoresIcon },
            { title: "Data", desc: "Entiende tu negocio desde los datos", link: '/data', icon: DataIcon },
            { title: "Parámetros", desc: "Personaliza tu software al 100% para tener lo que quieres", link: '/params', icon: ConfigIcon },
            { title: "Gastos", desc: "Ten control de tus gastos de operación", link: '/gastos', icon: GastosIcon }
          ].map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4}>
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card sx={cardStyles}>
                  <CardHeader
                    avatar={<Avatar aria-label="feature" sx={{ backgroundColor: 'white', color: 'white'}}>
                      <img src={item.icon} alt={item.title} style={{ width: 24, height: 24 }} />
                    </Avatar>}
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

      <Box sx={{  width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <img src={logoDeveloper} alt="Logo del desarrollador" width="300" />
        </Box>
      </Box>
      
    </Container>
  );
}

export default HomePage;
