const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Agregar materia prima
router.post('/add', (req, res) => {
    const { nombre, cantidad, unidad, sector } = req.body;
    const now = new Date();

    if (!nombre || !cantidad || !unidad || !sector) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run(
        `INSERT INTO materia_prima (nombre, cantidad, unidad, sector, fecha)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, cantidad, unidad, sector, now],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar materia prima' });
            } else {
                res.json({ message: 'Materia prima registrada exitosamente', fecha: now });
            }
        }
    );
});

// Consultar toda la materia prima
router.get('/', (req, res) => {
    db.all('SELECT * FROM materia_prima', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al consultar materia prima' });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
