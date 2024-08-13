import React from 'react';
import { IconButton, useMediaQuery, Box, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useTheme } from '@mui/material/styles';

function Whatsapp() {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

  if (!matches) return null;

  // Mensaje predeterminado para el chat de soporte
  const defaultMessage = encodeURIComponent('Hola, necesito ayuda con irrelevant');

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        backgroundColor: theme.palette.success.main,
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          backgroundColor: theme.palette.success.dark,
          transform: 'scale(1.1)',
        },
        transition: 'all 0.3s ease-in-out',
        cursor: 'pointer',
        zIndex: 1100,
      }}
      aria-label="Chat de soporte por WhatsApp"
    >
      <Tooltip
        title="Soporte"
        enterTouchDelay={0}
        placement="left"
        sx={{
          fontSize: '3.5rem',
          '& .MuiTooltip-tooltip': {
            padding: theme.spacing(1.5),
            fontSize: '3.2rem',
          },
        }}
      >
        <IconButton
          href={`https://wa.me/573216605193?text=${defaultMessage}`}
          target="_blank"
          sx={{
            color: 'white',
            padding: 1,
            '& svg': {
              fontSize: '4.5rem',
            },
            '&:hover': {
              color: theme.palette.success.light,
            },
          }}
        >
          <WhatsAppIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

export default Whatsapp;
