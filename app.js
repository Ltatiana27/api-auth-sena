// IMPORTACIÓN DE LIBRERÍAS
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Para leer el archivo .env

// INICIALIZACIÓN DE LA APLICACIÓN
const app = express();
const PORT = process.env.PORT || 10000;

// Middleware para procesar JSON
app.use(express.json());

// CONEXIÓN A MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch((error) => console.error('❌ Error al conectar a MongoDB:', error));

// RUTA DE PRUEBA
app.get('/', (req, res) => {
    res.send('API de Autenticación funcionando correctamente');
});

// IMPORTACIÓN Y USO DE RUTAS
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// INICIO DEL SERVIDOR
app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en el puerto ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});