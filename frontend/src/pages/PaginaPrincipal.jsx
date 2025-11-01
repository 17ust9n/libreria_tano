import { useEffect, useState } from "react";

function PaginaPrincipal() {
  const [libros, setLibros] = useState([]);

  // Obtener los libros desde el backend
  const fetchLibros = async () => {
    try {
      const res = await fetch("http://localhost:3001/libros");
      if (!res.ok) throw new Error("Error al obtener libros");
      const data = await res.json();
      setLibros(data);
    } catch (error) {
      console.error(error);
      alert("No se pudieron cargar los libros.");
    }
  };

  useEffect(() => {
    fetchLibros();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Librería Tano</h1>
      <p>Bienvenido a nuestra tienda de libros. Aquí encontrarás los mejores títulos para cada gusto.</p>

      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {libros.map(libro => (
          <div key={libro.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10, width: 200 }}>
            {libro.imagen && (
              <img
                src={`http://localhost:3001/media/${libro.imagen}`}
                alt={libro.nombre}
                style={{ width: "100%", height: "auto" }}
              />
            )}
            <h3>{libro.nombre}</h3>
            <p><b>Autor:</b> {libro.autor}</p>
            <p><b>Precio:</b> ${libro.precio.toFixed(2)}</p>
            <p><b>Género:</b> {libro.genero}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PaginaPrincipal;
