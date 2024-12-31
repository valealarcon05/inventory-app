const express = require('express');
const db = require('../models/database');
const router = express.Router();

// Registrar venta
router.post('/add', (req, res) => {
    const { producto_id, cantidad, unidad, sector } = req.body;
    const userId = req.session.user?.id;
    const now = new Date();

    if (!userId || !producto_id || !cantidad || !unidad || !sector) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run(
        `INSERT INTO ventas (usuario_id, producto_id, cantidad, unidad, sector, fecha)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, producto_id, cantidad, unidad, sector, now],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar venta' });
            } else {
                res.json({ message: 'Venta registrada exitosamente', fecha: now });
            }
        }
    );
});

// Consultar ventas por usuario
router.get('/user', (req, res) => {
    const userId = req.session.user?.id;

    if (!userId) {
        return res.status(401).json({ error: 'No autorizado' });
    }

    db.all(
        `SELECT * FROM ventas WHERE usuario_id = ?`,
        [userId],
        (err, rows) => {
            if (err) {
                res.status(500).json({ error: 'Error al consultar ventas' });
            } else {
                res.json(rows);
            }
        }
    );
});
router.get('/ventas', (req, res) => {
    db.all(`
        SELECT v.fecha, p.nombre AS producto, v.cantidad, v.unidad, v.sector, u.nombre AS empleado
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        JOIN usuarios u ON v.usuario_id = u.id
    `, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al consultar ventas globales' });
        } else {
            res.json(rows);
        }
    });
});

router.get('/ingresos-sector', (req, res) => {
    db.all(`
        SELECT sector, SUM(v.cantidad * p.precio_venta) AS ingresos
        FROM ventas v
        JOIN productos p ON v.producto_id = p.id
        GROUP BY sector
    `, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al calcular ingresos por sector' });
        } else {
            res.json(rows);
        }
    });
});

router.get('/rendimiento-sector', (req, res) => {
    db.all(`
        SELECT sector, COUNT(*) AS total_ventas
        FROM ventas
        GROUP BY sector
    `, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al calcular rendimiento por sector' });
        } else {
            res.json(rows);
        }
    });
});


module.exports = router;
