const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS libros (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      autor TEXT NOT NULL,
      precio REAL,
      genero TEXT,
      imagen TEXT
    )
  `);
});

db.close();
console.log("Base de datos creada correctamente con el campo id autoincremental");
