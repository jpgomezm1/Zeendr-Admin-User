import React from 'react';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PaymentIcon from '@mui/icons-material/Payment';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import DoneIcon from '@mui/icons-material/Done';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ListAltIcon from '@mui/icons-material/ListAlt'; // Nuevo icono para Total de Pedidos

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const cardData = [
  {
    title: 'Total Ventas',
    valueKey: 'totalVentas',
    icon: AttachMoneyIcon,
    isCurrency: true,
  },
  {
    title: 'Total Productos',
    valueKey: 'totalProductos',
    icon: PaymentIcon,
    isCurrency: true,
  },
  {
    title: 'Total Domicilios',
    valueKey: 'totalDomicilios',
    icon: PendingActionsIcon,
    isCurrency: true,
  },
  {
    title: 'Número de Pedidos',
    valueKey: 'numeroPedidos',
    icon: ListAltIcon,
    isCurrency: false,
  }
];

const SummaryCards = (summary) => {
  const theme = useTheme();
  const cardStyles = {
    width: '100%',
    maxWidth: 225,
    borderRadius: 2,
    boxShadow: 3,
    textAlign: 'center',
    color: 'white',
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #7B11F5, #A46BF5)',
  };

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))',
        gap: 4,
        marginBottom: 3,
      }}
    >
      {cardData.map((card) => {
        const IconComponent = card.icon;
        return (
          <Card key={card.title} sx={cardStyles}>
            <CardContent>
              <IconComponent sx={{ fontSize: 40 }} />
              <Typography variant="h6" component="div" sx={{ marginTop: 1, fontFamily: 'Poppins', fontWeight: 600 }}>
                {card.title}
              </Typography>
              <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 400 }}>
                {card.isCurrency ? formatCurrency(summary[card.valueKey]) : summary[card.valueKey]}
              </Typography>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
};

export default SummaryCards;
