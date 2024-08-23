import React, { useState, useEffect } from 'react';
import { Button, Grid, CircularProgress, Typography, Box, useTheme, Switch } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ProductoCard from '../../components/ProductCard/ProductCard';
import ProductoDialog from '../../components/ProductDialog/ProductDialog';
import ProductoTable from './ProductTable';
import ConfirmationDialog from './ConfirmationDialog';
import { apiClient } from '../../apiClient';
import ProductosIcon from '../../assets/icons/productos.png';

function PaginaProductos() {
    const theme = useTheme();
    const [open, setOpen] = useState(false);
    const [productos, setProductos] = useState([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', precio: '', imagen: null, categoria: '', descripcion: '', descuento: 0 });
    const [editMode, setEditMode] = useState(false);
    const [productoId, setProductoId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('cards');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false); // Estado para el diálogo de confirmación
    const [confirmAction, setConfirmAction] = useState(() => {}); // Estado para la acción de confirmación

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error al obtener los productos', error);
        }
        setLoading(false);
    };

    const handleAddProducto = async () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('nombre', nuevoProducto.nombre);
        formData.append('precio', nuevoProducto.precio);
        formData.append('categoria', nuevoProducto.categoria);
        formData.append('descripcion', nuevoProducto.descripcion || '');
        formData.append('descuento', nuevoProducto.descuento);
        if (nuevoProducto.imagen) {
            formData.append('imagen', nuevoProducto.file);
        }

        try {
            const response = await apiClient({
                method: editMode ? 'PUT' : 'POST',
                url: `/productos${editMode ? `/${productoId}` : ''}`,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (editMode) {
                setProductos(productos.map(p => (p.id === productoId ? response.data : p)));
            } else {
                setProductos([...productos, response.data]);
            }
            handleClose();
        } catch (error) {
            console.error('Error al agregar o editar el producto', error.response);
        }
        setLoading(false);
    };

    const handleEdit = producto => {
        setNuevoProducto({
            nombre: producto.nombre,
            precio: producto.precio,
            categoria: producto.categoria,
            descripcion: producto.descripcion,
            descuento: producto.descuento,
            imagen: null
        });
        setProductoId(producto.id);
        setEditMode(true);
        setOpen(true);
    };

    const confirmDelete = producto => {
        setConfirmDialogOpen(true);
        setConfirmAction(() => () => handleDelete(producto));
    };

    const handleDelete = async producto => {
        setLoading(true);
        try {
            await apiClient.delete(`/productos/${producto.id}`);
            setProductos(productos.filter(p => p.id !== producto.id));
        } catch (error) {
            console.error('Error al eliminar el producto', error);
        }
        setLoading(false);
        setConfirmDialogOpen(false); // Cerrar el diálogo después de la acción
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditMode(false);
        setNuevoProducto({ nombre: '', precio: '', imagen: null, categoria: '', descripcion: '', descuento: 0 });
    };

    const handleChange = (e) => {
        const { name, files } = e.target;
        if (name === 'imagen' && files) {
            const file = files[0];
            const imageUrl = URL.createObjectURL(file);
            setNuevoProducto(prev => ({ ...prev, imagen: imageUrl, file }));
        } else {
            setNuevoProducto(prev => ({ ...prev, [name]: e.target.value }));
        }
    };

    const toggleViewMode = () => {
        setViewMode((prevMode) => (prevMode === 'cards' ? 'table' : 'cards'));
    };

    return (
        <Box sx={{ padding: 2, borderRadius: 2, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
               <img src={ProductosIcon} alt="Gestión de Pedidos" style={{ width: 70, height: 70, marginRight: theme.spacing(2)}} />
               <Typography variant="h3" style={{ fontFamily: 'Providence Sans Pro', fontWeight: 'bold' }}>
                  Galeria de Caprichos
               </Typography>
            </Box>
            <Button 
                startIcon={<AddCircleOutlineIcon />} 
                onClick={handleClickOpen} 
                variant="contained" 
                size="large" 
                sx={{ mt: 2, backgroundColor: '#5E55FE', color: 'white', borderRadius: '10px', '&:hover': { backgroundColor: '#7b45a1' }, }}
            >
                Agregar Producto
            </Button>

            <Typography component="div" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Switch
                    checked={viewMode === 'table'}
                    onChange={toggleViewMode}
                    color="primary"
                    inputProps={{ 'aria-label': 'Toggle view mode' }}
                />
                {viewMode === 'table' ? 'Vista de Tabla' : 'Vista de Tarjetas'}
            </Typography>

            {loading ? (
                <CircularProgress />
            ) : (
                viewMode === 'cards' ? (
                    <Grid container spacing={3} justifyContent="center" alignItems="center" sx={{ mt: 5 }}>
                        {productos.map((producto, index) => (
                            <ProductoCard 
                                key={index} 
                                producto={producto} 
                                onDelete={() => confirmDelete(producto)} 
                                onEdit={handleEdit}
                            />
                        ))}
                    </Grid>
                ) : (
                    <ProductoTable 
                        productos={productos} 
                        onDelete={confirmDelete} 
                        onEdit={handleEdit} 
                    />
                )
            )}

            <ProductoDialog
                open={open}
                handleClose={handleClose}
                handleChange={handleChange}
                handleAddProducto={handleAddProducto}
                nuevoProducto={nuevoProducto}
                loading={loading}
                editMode={editMode}
            />

            <ConfirmationDialog
                open={confirmDialogOpen}
                handleClose={() => setConfirmDialogOpen(false)}
                handleConfirm={confirmAction}
                title="Confirmar acción"
                content="¿Estás seguro de que quieres realizar esta acción?"
            />
        </Box>
    );
}

export default PaginaProductos;


