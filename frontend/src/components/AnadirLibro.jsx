import { useState } from "react";

function ListaLibros() {
  // 🆕 Estado para nuevo libro
  const [nuevoLibro, setNuevoLibro] = useState({
    nombre: "",
    autor: "",
    precio: "",
    genero: "",
    imagen: null, // archivo
  });

  // 🆕 Agregar nuevo libro
  const agregarLibro = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("nombre", nuevoLibro.nombre);
      formData.append("autor", nuevoLibro.autor);
      formData.append("precio", nuevoLibro.precio);
      formData.append("genero", nuevoLibro.genero);
      if (nuevoLibro.imagen) formData.append("imagen", nuevoLibro.imagen);

      const res = await fetch("http://localhost:3001/libros", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al agregar libro");
      await res.json();

      // Limpiar formulario
      setNuevoLibro({
        nombre: "",
        autor: "",
        precio: "",
        genero: "",
        imagen: null,
      });

      alert("📘 Libro agregado con éxito");
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar el libro.");
    }
  };

  // 🎨 Estilos
  const estilos = {
    contenedor: {
      backgroundColor: "#f5f5dc",
      minHeight: "100vh",
      padding: "40px",
      textAlign: "center",
    },
    formulario: {
      backgroundColor: "#fff8dc",
      border: "1px solid #d2b48c",
      borderRadius: "10px",
      padding: "20px",
      marginBottom: "30px",
      width: "400px",
      margin: "0 auto",
    },
    input: {
      display: "block",
      width: "100%",
      padding: "8px",
      marginBottom: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    botonAgregar: {
      backgroundColor: "#2e8b57",
      color: "white",
      border: "none",
      borderRadius: "5px",
      padding: "10px 15px",
      cursor: "pointer",
    },
    tituloFormulario: {
      color: "black",
    },
  };

  return (
    <div style={estilos.contenedor}>
      <h1>📚 Lista de Libros</h1>

      {/* 🆕 Formulario para agregar libro */}
      <form onSubmit={agregarLibro} style={estilos.formulario}>
        <h2 style={estilos.tituloFormulario}>➕ Agregar Nuevo Libro</h2>
        <input
          style={estilos.input}
          type="text"
          placeholder="Nombre"
          value={nuevoLibro.nombre}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, nombre: e.target.value })
          }
          required
        />
        <input
          style={estilos.input}
          type="text"
          placeholder="Autor"
          value={nuevoLibro.autor}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, autor: e.target.value })
          }
          required
        />
        <input
          style={estilos.input}
          type="number"
          step="0.01"
          placeholder="Precio"
          value={nuevoLibro.precio}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, precio: e.target.value })
          }
        />
        <input
          style={estilos.input}
          type="text"
          placeholder="Género"
          value={nuevoLibro.genero}
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, genero: e.target.value })
          }
        />
        <input
          style={estilos.input}
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNuevoLibro({ ...nuevoLibro, imagen: e.target.files[0] })
          }
        />
        <button type="submit" style={estilos.botonAgregar}>
          📘 Agregar Libro
        </button>
      </form>
    </div>
  );
}

export default ListaLibros;
