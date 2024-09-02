import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, AppBar, useTheme } from '@mui/material';
import CategoriaTable from './CategoriaTable';
import HorarioAtencion from './HorarioAtencion';
import CuponesDescuento from './CuponesDescuento';
import DomicilioPrice from './DomicilioPrice';
import TabPanel from '../GastosScreen/TabPanel';

import ConfigIcon from '../../assets/icons/config.png';

const ParametrosScreen = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <img src={ConfigIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2) }} />
        <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
          Tablero de Comandos
        </Typography>
      </Box>
      <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none', borderBottom: '2px solid #5E55FE' }}>
        <Box sx={{ overflowX: 'auto' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="parametros tabs"
            TabIndicatorProps={{ style: { backgroundColor: '#5E55FE', height: '4px' } }}
            variant="scrollable"
            scrollButtons="auto"
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
            <Tab label="Categorías del Menú" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Horarios de Atención" id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Cupones de Descuento" id="tab-2" aria-controls="tabpanel-2" />
            <Tab label="Domicilios" id="tab-3" aria-controls="tabpanel-3" />  {/* Nuevo tab */}
          </Tabs>
        </Box>
      </AppBar>
      <TabPanel value={tabValue} index={0}>
        <CategoriaTable />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <HorarioAtencion />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <CuponesDescuento />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <DomicilioPrice /> 
      </TabPanel>
    </Box>
  );
};

export default ParametrosScreen;
