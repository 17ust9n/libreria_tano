const express = require('express');
const cors = require('cors');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/media', express.static(path.join(__dirname, 'media')));

// Configuración de multer para guardar imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'media/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Conexión a la base de datos SQLite
const db = new sqlite3.Database('database.db', (err) => {
  if (err) console.error("Error al conectar con la BD:", err.message);
  else console.log("Conectado a la base de datos SQLite");
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS libros (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    autor TEXT NOT NULL,
    precio REAL NOT NULL,
    genero TEXT NOT NULL,
    imagen TEXT
  )
`);

// Rutas

// Obtener todos los libros
app.get('/libros', (req, res) => {
  db.all('SELECT * FROM libros', [], (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Añadir libro
app.post('/libros', upload.single('imagen'), (req, res) => {
  const { nombre, autor, precio, genero } = req.body;
  const imagen = req.file ? req.file.filename : null;

  db.run(
    `INSERT INTO libros (nombre, autor, precio, genero, imagen) VALUES (?, ?, ?, ?, ?)`,
    [nombre, autor, parseFloat(precio), genero, imagen],
    function(err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID });
    }
  );
});

// Eliminar libro por ID
app.delete('/libros/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM libros WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }
    res.json({ message: 'Libro eliminado correctamente' });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
