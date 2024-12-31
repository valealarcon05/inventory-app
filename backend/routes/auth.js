const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Login
router.post('/login', (req, res) => {
    const { nombre, clave } = req.body;
    db.get('SELECT * FROM usuarios WHERE nombre = ? AND clave = ?', [nombre, clave], (err, user) => {
        if (err) {
            res.status(500).json({ error: 'Error al iniciar sesión' });
        } else if (user) {
            req.session.user = user;
            res.json({ message: 'Inicio de sesión exitoso', user });
        } else {
            res.status(401).json({ error: 'Credenciales incorrectas' });
        }
    });
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Sesión cerrada' });
});

module.exports = router;
