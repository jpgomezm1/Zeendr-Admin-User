import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

const KPICard = ({ title, value }) => {
  const theme = useTheme();

  const cardStyles = {
    p: 2,
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
    <Box sx={cardStyles}>
      <Typography variant="h6" component="div" sx={{ marginTop: 1, fontFamily: 'Poppins', fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="h5" sx={{ fontFamily: 'Poppins', fontWeight: 400 }}>
        {value}
      </Typography>
    </Box>
  );
};

export default KPICard;
