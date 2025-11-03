const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db');

db.serialize(() => {
  // Borrar libros antiguos
  db.run("DELETE FROM libros");

  // Resetear contador AUTOINCREMENT (para que empiece en 1)
  db.run("DELETE FROM sqlite_sequence WHERE name='libros'");

  // Insertar libros
  const stmt = db.prepare("INSERT INTO libros (nombre, autor, genero, precio, imagen) VALUES (?, ?, ?, ?, ?)");

  stmt.run('Bajo la misma estrella', 'John Green', 'Romance', 799, 'Bajo la misma estrella.jpeg');
  stmt.run('Dracula', 'Bram Stocker', 'Terror', 799, 'Dracula.jpeg');
  stmt.run('Cocina comida real', 'Carlos Rios', 'Cocina', 799, 'Cocina comida real.jpg');

  stmt.finalize();
});

db.close();
console.log("Datos de libros insertados correctamente y contador AUTOINCREMENT reiniciado");

