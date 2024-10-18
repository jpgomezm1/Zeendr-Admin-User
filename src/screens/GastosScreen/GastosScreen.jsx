import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, AppBar, Button, useTheme } from '@mui/material';
import OtrosGastos from './OtrosGastos';
import GastosProveedores from './GastosProveedores';
import TabPanel from './TabPanel';
import CargaMasivaDialog from './CargaMasivaDialog';  // Importar el componente del diálogo
import GastosIcon from '../../assets/icons/gastos.png';

const GastosScreen = () => {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState(0);
  const [openCargaMasiva, setOpenCargaMasiva] = useState(false);  // Estado para el diálogo

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleOpenCargaMasiva = () => {
    setOpenCargaMasiva(true);
  };

  const handleCloseCargaMasiva = () => {
    setOpenCargaMasiva(false);
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img src={GastosIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2) }} />
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
          Observatorio de Desembolsos
        </Typography>
      </Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="gastos tabs"
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
          <Tab label="Gastos Operacion" />
          <Tab label="Gastos de Proveedores" />
        </Tabs>
      </AppBar>
      
     <TabPanel value={currentTab} index={0}>
        <OtrosGastos />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <GastosProveedores />
      </TabPanel>

    </Box>
  );
};

export default GastosScreen;
