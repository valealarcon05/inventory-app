const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'mi-secreto', // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: true,
}));

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
const authRoutes = require('./routes/auth');
const empleadosRoutes = require('./routes/empleados');
const adminRoutes = require('./routes/administradores');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');
const produccionRoutes = require('./routes/produccion');
const materiaPrimaRoutes = require('./routes/materia_prima');

// Usar las rutas
app.use('/auth', authRoutes);
app.use('/empleados', empleadosRoutes);
app.use('/admin', adminRoutes);
app.use('/productos', productosRoutes);
app.use('/ventas', ventasRoutes);
app.use('/produccion', produccionRoutes);
app.use('/materia_prima', materiaPrimaRoutes);

// Escuchar en un puerto
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
