// Importamos mongoose para crear el esquema
const mongoose = require('mongoose');

// Se define el esquema del usuario
const UsuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    }
});

// Exportamos el modelo
module.exports = mongoose.model('Usuario', UsuarioSchema);