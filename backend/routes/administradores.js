const express = require('express');
const db = require('../models/database'); // Conexión a la base de datos
const router = express.Router(); // Aquí defines router

// Agregar un usuario
router.post('/usuarios', (req, res) => {
    const { nombre, clave, sector } = req.body;

    if (!nombre || !clave || !sector) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run(
        `INSERT INTO usuarios (nombre, clave, sector) VALUES (?, ?, ?)`,
        [nombre, clave, sector],
        (err) => {
            if (err) {
                res.status(500).json({ error: 'Error al registrar usuario' });
            } else {
                res.json({ message: 'Usuario registrado exitosamente' });
            }
        }
    );
});
router.get('/usuarios', (req, res) => {
    db.all('SELECT * FROM usuarios', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al consultar usuarios' });
        } else {
            res.json(rows);
        }
    });
});
router.post('/productos', (req, res) => {
    const { nombre, sector, precio_compra, precio_venta } = req.body;

    if (!nombre || !sector || !precio_compra || !precio_venta) {
        return res.status(400).json({ error: 'Faltan datos del producto' });
    }

    db.run(`
        INSERT INTO productos (nombre, sector, precio_compra, precio_venta, fecha_creacion)
        VALUES (?, ?, ?, ?, datetime('now'))
    `, [nombre, sector, precio_compra, precio_venta], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al agregar producto' });
        } else {
            res.json({ message: 'Producto agregado exitosamente' });
        }
    });
});

router.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Error al consultar productos' });
        } else {
            res.json(rows);
        }
    });
});
router.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar producto' });
        } else {
            res.json({ message: 'Producto eliminado exitosamente' });
        }
    });
});

router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM usuarios WHERE id = ?', [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar usuario' });
        } else {
            res.json({ message: 'Usuario eliminado exitosamente' });
        }
    });
});

router.put('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, clave, sector } = req.body;

    db.run(`
        UPDATE usuarios
        SET nombre = ?, clave = ?, sector = ?
        WHERE id = ?
    `, [nombre, clave, sector, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al actualizar usuario' });
        } else {
            res.json({ message: 'Usuario actualizado exitosamente' });
        }
    });
});

// Exporta las rutas para ser usadas en app.js
module.exports = router;
