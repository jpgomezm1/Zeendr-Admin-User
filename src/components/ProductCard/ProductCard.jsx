import React from 'react';
import { CardContent, Typography, Grid, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { red } from '@mui/material/colors';
import { ProductCard, ProductMedia } from '../../styles/styledComponents';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

function ProductoCard({ producto, onDelete, onEdit, onToggleVisibility }) {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const discountedPrice = producto.precio * (1 - producto.descuento / 100);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <ProductCard style={{ position: 'relative', zIndex: '1' }}>
        {producto.descuento > 0 && (
          <div style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            backgroundColor: 'red',
            color: 'white',
            padding: '5px',
            borderRadius: '5px',
            zIndex: '2',
            '@media (max-width: 600px)': {
              top: '40px',
            }
          }}>
            <LocalOfferIcon /> {producto.descuento}%
          </div>
        )}
        <ProductMedia
          component="img"
          alt="Imagen del producto"
          image={producto.imagen_url || 'path_to_default_image.jpg'}
          title={producto.nombre}
        />
        <CardContent sx={{ textAlign: 'center' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ fontWeight: 'medium' }}>
            {producto.nombre}
          </Typography>
          {producto.descuento > 0 ? (
            <>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem', textDecoration: 'line-through' }}>
                Precio: {formatCurrency(producto.precio)}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                Precio con descuento: {formatCurrency(discountedPrice)}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
              Precio: {formatCurrency(producto.precio)}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            Categoría: {producto.categoria}
          </Typography>
          <div>
            <IconButton onClick={() => onEdit(producto)} size="small" sx={{ color: '#5E55FE', marginRight: 1 }}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={onDelete} size="small" sx={{ color: red[500] }}>
              <DeleteIcon />
            </IconButton>
            <IconButton onClick={onToggleVisibility} size="small" sx={{ color: '#5E55FE' }}>
              {producto.oculto ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </div>
        </CardContent>
      </ProductCard>
    </Grid>
  );
}

export default ProductoCard;
