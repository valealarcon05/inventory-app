const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Agregar producto
router.post('/add', (req, res) => {
    const { nombre, sector, precio_compra, precio_venta } = req.body;
    const now = new Date();

    if (!nombre || !sector || !precio_compra || !precio_venta) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run(
        `INSERT INTO productos (nombre, sector, precio_compra, precio_venta, fecha_creacion)
         VALUES (?, ?, ?, ?, ?)`,
        [nombre, sector, precio_compra, precio_venta, now],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar producto' });
            } else {
                res.json({ message: 'Producto registrado exitosamente', fecha: now });
            }
        }
    );
});

// Consultar productos
router.get('/', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al consultar productos' });
        } else {
            res.json(rows);
        }
    });
});

module.exports = router;
