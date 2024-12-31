const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Registrar ingreso (al iniciar sesión)
router.post('/ingreso', (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const now = new Date();
    db.run('INSERT INTO ingresos_egresos (usuario_id, ingreso) VALUES (?, ?)', [userId, now], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar ingreso' });
        } else {
            res.json({ message: 'Ingreso registrado', fecha: now });
        }
    });
});

// Registrar egreso
router.post('/egreso', (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'No autorizado' });

    const now = new Date();
    db.run('UPDATE ingresos_egresos SET egreso = ?, horas_trabajadas = (strftime("%s", ?) - strftime("%s", ingreso)) / 3600 WHERE usuario_id = ? AND egreso IS NULL', [now, now, userId], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar egreso' });
        } else {
            res.json({ message: 'Egreso registrado', fecha: now });
        }
    });
});

// Agregar venta
router.post('/venta', (req, res) => {
    const userId = req.session.user?.id;
    const { producto_id, cantidad, unidad, sector } = req.body;
    const now = new Date();

    if (!userId || !producto_id || !cantidad || !unidad || !sector) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run('INSERT INTO ventas (usuario_id, producto_id, cantidad, unidad, sector, fecha) VALUES (?, ?, ?, ?, ?, ?)', [userId, producto_id, cantidad, unidad, sector, now], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar venta' });
        } else {
            res.json({ message: 'Venta registrada', fecha: now });
        }
    });
});

module.exports = router;
