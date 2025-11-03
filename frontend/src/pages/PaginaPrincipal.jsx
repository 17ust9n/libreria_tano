import { useEffect, useState } from "react";
import AnadirLibro from "../components/AnadirLibro";

function PaginaPrincipal() {
  const [libros, setLibros] = useState([]);
  const [ejemplares, setEjemplares] = useState({});
  const [dinero, setDinero] = useState(20000);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [libroSeleccionado, setLibroSeleccionado] = useState(null); // Para el modal

  // 🔹 Cargar libros desde el backend
  const fetchLibros = async () => {
    try {
      const res = await fetch("http://localhost:3001/libros");
      if (!res.ok) throw new Error("Error al obtener libros");
      const data = await res.json();
      setLibros(data);

      // Inicializar stock
      const inicial = {};
      data.forEach(libro => { inicial[String(libro._id)] = 1; });
      setEjemplares(inicial);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los libros.");
    }
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  const incrementar = (id) => {
    const libro = libros.find(l => String(l._id) === String(id));
    if (!libro) return;
    setEjemplares(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setDinero(prev => Math.max(0, prev - libro.precio));
  };

  const decrementar = (id) => {
    const libro = libros.find(l => String(l._id) === String(id));
    if (!libro) return;
    if (ejemplares[id] > 1) {
      setEjemplares(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setDinero(prev => prev + libro.precio);
    }
  };

  const manejarLibroAgregado = (precio) => {
    setDinero(prev => prev - precio);
    fetchLibros();
    setMostrarFormulario(false);
  };

  const eliminarLibro = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/libros/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error al eliminar el libro");
      fetchLibros();
      setLibroSeleccionado(null);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el libro");
    }
  };

  const colores = {
    fondo: "#4b2e05",
    tarjeta: "#8b5e3c",
    texto: "#fffaf0",
    boton: "#d2b48c",
    botonDeshabilitado: "#b08d57",
    botonVerImagen: "#6a9fb5"
  };

  return (
    <div style={{ padding: 20, backgroundColor: colores.fondo, color: colores.texto, minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>📚 Librería Tano</h1>

      {!mostrarFormulario && (
        <p style={{ textAlign: "center" }}>
          Bienvenido a nuestra tienda de libros. Aquí encontrarás los mejores títulos para cada gusto.
        </p>
      )}

      {/* Botón mostrar/ocultar formulario */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{
            backgroundColor: colores.boton,
            border: "none",
            borderRadius: 5,
            padding: "10px 15px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {mostrarFormulario ? "Cerrar formulario" : "Añadir libro"}
        </button>
      </div>

      {mostrarFormulario && <AnadirLibro onLibroAgregado={manejarLibroAgregado} />}

      {/* Lista de libros */}
      {!mostrarFormulario && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {libros.length === 0 ? (
            <p>No hay libros disponibles actualmente.</p>
          ) : (
            libros.map(libro => {
              const cantidad = ejemplares[libro._id] ?? 1;
              const sinStock = cantidad <= 1;

              return (
                <div
                  key={libro._id}
                  style={{
                    backgroundColor: colores.tarjeta,
                    border: "2px solid #3e2400",
                    borderRadius: 8,
                    margin: 10,
                    padding: 10,
                    width: 200,
                    textAlign: "center",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.3)"
                  }}
                >
                  {libro.imagen && (
                    <img
                      src={`http://localhost:3001/media/${libro.imagen}`}
                      alt={libro.nombre}
                      style={{ width: "100%", height: "auto", borderRadius: 5 }}
                    />
                  )}

                  <h3>{libro.nombre}</h3>
                  <p><b>Autor:</b> {libro.autor}</p>
                  <p><b>Precio:</b> ${libro.precio.toFixed(2)}</p>
                  <p><b>Género:</b> {libro.genero}</p>

                  {/* Botones de stock */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 10 }}>
                    <span><b>Stock:</b></span>
                    <button
                      onClick={() => incrementar(libro._id)}
                      style={{ backgroundColor: colores.boton, border: "none", borderRadius: 5, padding: "5px 8px", cursor: "pointer" }}
                    >⬆️</button>
                    <span><b>{cantidad}</b></span>
                    <button
                      onClick={() => decrementar(libro._id)}
                      disabled={sinStock}
                      style={{
                        backgroundColor: sinStock ? colores.botonDeshabilitado : colores.boton,
                        border: "none",
                        borderRadius: 5,
                        padding: "5px 8px",
                        cursor: sinStock ? "not-allowed" : "pointer",
                        opacity: sinStock ? 0.6 : 1
                      }}
                    >⬇️</button>
                  </div>

                  {/* Botón Ver Libro */}
                  <div style={{ marginTop: 10 }}>
                    <button
                      onClick={() => setLibroSeleccionado(libro)}
                      style={{
                        backgroundColor: colores.botonVerImagen,
                        border: "none",
                        borderRadius: 5,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: "bold",
                        color: "#fffaf0"
                      }}
                    >
                      👀 Ver Libro
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal para ver y eliminar libro */}
      {libroSeleccionado && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: colores.tarjeta,
            padding: 20,
            borderRadius: 8,
            width: 350,
            textAlign: "center",
            position: "relative"
          }}>
            {libroSeleccionado.imagen && (
              <img
                src={`http://localhost:3001/media/${libroSeleccionado.imagen}`}
                alt={libroSeleccionado.nombre}
                style={{ width: "100%", height: "auto", borderRadius: 5 }}
              />
            )}
            <h2>{libroSeleccionado.nombre}</h2>
            <p><b>Autor:</b> {libroSeleccionado.autor}</p>
            <p><b>Precio:</b> ${libroSeleccionado.precio.toFixed(2)}</p>
            <p><b>Género:</b> {libroSeleccionado.genero}</p>

            <div style={{ marginTop: 15, display: "flex", justifyContent: "space-around" }}>
              <button
                onClick={() => eliminarLibro(libroSeleccionado._id)}
                style={{
                  backgroundColor: "red",
                  border: "none",
                  borderRadius: 5,
                  padding: "8px 12px",
                  color: "#fffaf0",
                  cursor: "pointer"
                }}
              >
                🗑️ Eliminar
              </button>
              <button
                onClick={() => setLibroSeleccionado(null)}
                style={{
                  backgroundColor: colores.boton,
                  border: "none",
                  borderRadius: 5,
                  padding: "8px 12px",
                  cursor: "pointer"
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dinero total */}
      <div style={{
        marginTop: 30,
        padding: 15,
        borderTop: "2px solid #d2b48c",
        textAlign: "center",
        fontSize: 20,
        backgroundColor: "#3b2402",
        borderRadius: 8,
        width: "fit-content",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <b>Dinero total: ${dinero.toFixed(2)}</b>
      </div>
    </div>
  );
}

export default PaginaPrincipal;
