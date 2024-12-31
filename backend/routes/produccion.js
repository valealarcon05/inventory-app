const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Registrar producción
router.post('/add', (req, res) => {
    const { producto_id, cantidad, unidad, sector } = req.body;
    const userId = req.session.user?.id;
    const now = new Date();

    if (!userId || !producto_id || !cantidad || !unidad || !sector) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run(
        `INSERT INTO produccion (usuario_id, producto_id, cantidad, unidad, sector, fecha)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, producto_id, cantidad, unidad, sector, now],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar producción' });
            } else {
                res.json({ message: 'Producción registrada exitosamente', fecha: now });
            }
        }
    );
});

// Consultar producción por usuario
router.get('/user', (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    db.all(
        `SELECT * FROM produccion WHERE usuario_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: 'Error al consultar producción' });
            } else {
                res.json(rows);
            }
        }
    );
});

module.exports = router;
