// Importamos Express y creamos el router
const express = require('express');
const router = express.Router();

// Importamos el modelo de Usuario y bcrypt
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// REGISTRO DE USUARIO
router.post('/registro', async (req, res) => {
    try {
        // Extracción de los datos del cuerpo de la petición
        const { usuario, password } = req.body;

        // Verificación de que los campos no estén vacíos
        if (!usuario || !password) {
            return res.status(400).json({ 
                message: "Error: Debes ingresar usuario y contraseña válidas" 
            });
        }

        // Verificación de si el usuario ya existe
        const existeUsuario = await Usuario.findOne({ usuario });
        if (existeUsuario) {
            return res.status(400).json({ 
                message: "Error: El usuario ya está registrado" 
            });
        }

        // Encriptación de la contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Creación del nuevo usuario
        const nuevoUsuario = new Usuario({
            usuario,
            password: passwordEncriptada
        });

        // Guardar en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();

        // Respospuesta al cliente
        res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: usuarioGuardado.usuario
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error en el servidor al registrar",
            error: error.message 
        });
    }
});


// INICIO DE SESIÓN (LOGIN)
router.post('/login', async (req, res) => {
    try {
        // Extraemos los datos
        const { usuario, password } = req.body;

        // Verificamos que los campos no estén vacíos
        if (!usuario || !password) {
            return res.status(400).json({ 
                message: "Error en la autenticación: Debes ingresar usuario y contraseña válidos" 
            });
        }

        // Buscamos el usuario en la base de datos
        const usuarioEncontrado = await Usuario.findOne({ usuario });
        if (!usuarioEncontrado) {
            return res.status(401).json({ 
                message: "Error en la autenticación: Usuario no encontrado" 
            });
        }

        // Comparar la contraseña ingresada con la encriptada
        const passwordValida = await bcrypt.compare(password, usuarioEncontrado.password);
        if (!passwordValida) {
            return res.status(401).json({ 
                message: "Error en la autenticación: Contraseña incorrecta" 
            });
        }

        // Si todo es correcto, responder con éxito
        res.status(200).json({ 
            message: "Autenticación satisfactoria" 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error en el servidor al iniciar sesión",
            error: error.message 
        });
    }
});

// Exportamos el router
module.exports = router;