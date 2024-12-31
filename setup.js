const db = require('./backend/models/database');

// Crear tablas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            clave TEXT NOT NULL,
            sector TEXT NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS ingresos_egresos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            ingreso DATETIME NOT NULL,
            egreso DATETIME,
            horas_trabajadas REAL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            sector TEXT NOT NULL,
            precio_compra REAL NOT NULL,
            precio_venta REAL NOT NULL,
            fecha_creacion DATETIME NOT NULL
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS ventas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad REAL NOT NULL,
            unidad TEXT NOT NULL,
            sector TEXT NOT NULL,
            fecha DATETIME NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS produccion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            producto_id INTEGER NOT NULL,
            cantidad REAL NOT NULL,
            unidad TEXT NOT NULL,
            sector TEXT NOT NULL,
            fecha DATETIME NOT NULL,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
            FOREIGN KEY (producto_id) REFERENCES productos(id)
        );
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS materia_prima (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            cantidad REAL NOT NULL,
            unidad TEXT NOT NULL,
            sector TEXT NOT NULL,
            fecha DATETIME NOT NULL
        );
    `);

    console.log('Tablas creadas exitosamente.');
    db.close();
});
