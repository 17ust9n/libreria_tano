import { useEffect, useState } from "react";
import AnadirLibro from "./AnadirLibro";

function PaginaPrincipal() {
  const [libros, setLibros] = useState([]);
  const [ejemplares, setEjemplares] = useState({});
  const [dinero, setDinero] = useState(20000);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const fetchLibros = async () => {
    try {
      const res = await fetch("http://localhost:3001/libros");
      if (!res.ok) throw new Error("Error al obtener libros");
      const data = await res.json();
      setLibros(data);

      const inicial = {};
      data.forEach(libro => { inicial[libro.id] = 1; });
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
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    setEjemplares(prev => ({ ...prev, [id]: prev[id] + 1 }));
    setDinero(prev => Math.max(0, prev - libro.precio));
  };

  const decrementar = (id) => {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;
    if (ejemplares[id] > 1) {
      setEjemplares(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setDinero(prev => prev + libro.precio);
    }
  };

  const eliminarLibro = async (id) => {
    const libro = libros.find(l => l.id === id);
    if (!libro) return;

    const confirm = window.confirm(`¿Estás seguro de querer eliminar el libro "${libro.nombre}"?`);
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:3001/libros/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar libro");

      setLibros(prev => prev.filter(l => l.id !== id));
      setEjemplares(prev => {
        const nuevo = { ...prev };
        delete nuevo[id];
        return nuevo;
      });
      setDinero(prev => prev + libro.precio);
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el libro.");
    }
  };

  const colores = {
    fondo: "#4b2e05",
    tarjeta: "#8b5e3c",
    texto: "#fffaf0",
    boton: "#d2b48c",
    botonDeshabilitado: "#b08d57",
    botonEliminar: "#a83232"
  };

  return (
    <div style={{ padding: 20, backgroundColor: colores.fondo, color: colores.texto, minHeight: "100vh" }}>
      <h1 style={{ textAlign: "center" }}>Librería Tano</h1>

      {/* Mensaje de bienvenida solo si NO se muestra el formulario */}
      {!mostrarFormulario && (
        <p style={{ textAlign: "center" }}>
          Bienvenido a nuestra tienda de libros. Aquí encontrarás los mejores títulos para cada gusto.
        </p>
      )}

      {/* Botón para mostrar/ocultar formulario */}
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

      {/* Formulario */}
      {mostrarFormulario && (
        <AnadirLibro onLibroAgregado={(precio) => setDinero(prev => prev - precio)} />
      )}

      {/* Lista de libros */}
      {!mostrarFormulario && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {libros.map(libro => {
            const cantidad = ejemplares[libro.id] ?? 1;
            const sinStock = cantidad <= 1;

            return (
              <div
                key={libro.id}
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
                    onClick={() => incrementar(libro.id)}
                    style={{ backgroundColor: colores.boton, border: "none", borderRadius: 5, padding: "5px 8px", cursor: "pointer" }}
                  >⬆️</button>
                  <span><b>{cantidad}</b></span>
                  <button
                    onClick={() => decrementar(libro.id)}
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

                {/* Botón eliminar */}
                <button
                  onClick={() => eliminarLibro(libro.id)}
                  style={{
                    marginTop: 10,
                    backgroundColor: colores.botonEliminar,
                    color: "#fffaf0",
                    border: "none",
                    borderRadius: 5,
                    padding: "5px 10px",
                    cursor: "pointer"
                  }}
                >
                  Eliminar
                </button>
              </div>
            );
          })}
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