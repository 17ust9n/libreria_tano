import { useEffect, useState } from "react";

function ListaLibros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar lista de libros desde el backend
  const cargarLibros = async () => {
    try {
      const res = await fetch("http://localhost:3001/libros");
      if (!res.ok) throw new Error("Error al obtener libros");
      const data = await res.json();
      setLibros(data);
    } catch (error) {
      console.error("Error al cargar libros:", error);
      alert("No se pudieron cargar los libros.");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 Eliminar un libro por ID
  const eliminarLibro = async (libro) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el libro "${libro.nombre}"?`
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:3001/libros/${libro._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar el libro");

      // Filtramos el libro eliminado del estado
      setLibros((prevLibros) =>
        prevLibros.filter((l) => l._id !== libro._id)
      );

      alert(`Libro "${libro.nombre}" eliminado correctamente`);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el libro.");
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  // 🎨 Estilos
  const estilos = {
    contenedor: {
      backgroundColor: "#f5f5dc",
      minHeight: "100vh",
      padding: "40px",
      textAlign: "center",
    },
    tarjeta: {
      backgroundColor: "#fffaf0",
      border: "1px solid #d2b48c",
      borderRadius: "10px",
      padding: "15px",
      margin: "10px",
      width: "200px",
      textAlign: "center",
      display: "inline-block",
      verticalAlign: "top",
      boxShadow: "0 3px 6px rgba(0,0,0,0.2)",
    },
    imagen: {
      width: "100%",
      height: "auto",
      borderRadius: "5px",
      cursor: "pointer",
    },
    boton: {
      backgroundColor: "#b22222",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "8px 12px",
      cursor: "pointer",
      marginTop: "10px",
    },
    info: {
      textAlign: "left",
      marginTop: "10px",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h1>📚 Lista de Libros</h1>

      {cargando ? (
        <p>Cargando libros...</p>
      ) : libros.length === 0 ? (
        <p>No hay libros registrados aún.</p>
      ) : (
        libros.map((libro) => (
          <div key={libro._id} style={estilos.tarjeta}>
            {/* Imagen del libro */}
            {libro.imagen && (
              <img
                src={`http://localhost:3001/media/${libro.imagen}`}
                alt={libro.nombre}
                style={estilos.imagen}
              />
            )}

            {/* Información del libro */}
            <div style={estilos.info}>
              <h3>{libro.nombre}</h3>
              <p><strong>Autor:</strong> {libro.autor}</p>
              <p><strong>Género:</strong> {libro.genero}</p>
              <p><strong>Precio:</strong> ${libro.precio.toFixed(2)}</p>
            </div>

            {/* Botón de eliminar dentro de la tarjeta */}
            <button
              style={estilos.boton}
              onClick={() => eliminarLibro(libro)}
            >
              🗑️ Eliminar
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ListaLibros;
