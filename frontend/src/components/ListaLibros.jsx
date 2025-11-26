import { useEffect, useState } from "react";

function ListaLibros() {
  const [libros, setLibros] = useState([]);
  const [cargando, setCargando] = useState(true);

  // 🔹 Cargar lista de libros desde el backend
  const cargarLibros = async () => {
    try {
      const res = await fetch("https://libreria-tano-backend.onrender.com/libros");
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

  // 🔹 Eliminar un libro por ID con confirmación personalizada
  const eliminarLibro = async (id) => {
    const libroAEliminar = libros.find((libro) => String(libro._id) === String(id));
    if (!libroAEliminar) return;

    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar el libro "${libroAEliminar.nombre}"?`
    );
    if (!confirmar) return;

    try {
      const res = await fetch(`https://libreria-tano-backend.onrender.com/libros/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar el libro");

      setLibros((prevLibros) => prevLibros.filter((libro) => String(libro._id) !== String(id)));

      alert(`Libro "${libroAEliminar.nombre}" eliminado correctamente`);
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
      padding: "20px",
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
    },
    imagen: {
      width: "80px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "5px",
      marginRight: "15px",
    },
    boton: {
      backgroundColor: "#b22222",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "8px 12px",
      cursor: "pointer",
    },
    info: {
      textAlign: "left",
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
            <div style={{ display: "flex", alignItems: "center" }}>
              {libro.imagen && (
                <img
                  src={`https://libreria-tano-backend.onrender.com/media/${libro.imagen}`}
                  alt={libro.nombre}
                  style={estilos.imagen}
                />
              )}
              <div style={estilos.info}>
                <h3>{libro.nombre}</h3>
                <p><strong>Autor:</strong> {libro.autor}</p>
                <p><strong>Género:</strong> {libro.genero}</p>
                <p><strong>Precio:</strong> ${libro.precio.toFixed(2)}</p>
              </div>
            </div>

            <button
              onClick={() => eliminarLibro(libro._id)}
              style={estilos.boton}
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
