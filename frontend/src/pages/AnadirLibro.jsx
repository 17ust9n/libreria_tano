import { useState } from "react";

function AnadirLibro({ onLibroAgregado }) {
  const [form, setForm] = useState({
    nombre: "",
    autor: "",
    precio: "",
    genero: "",
    imagen: null
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setForm({ ...form, imagen: e.target.files[0] });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    // ✅ Validación antes de enviar
    if (!form.nombre || !form.autor || !form.precio || !form.genero || !form.imagen) {
      alert("Por favor, completa todos los campos y sube una imagen del libro.");
      return;
    }

    try {
      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("autor", form.autor);
      data.append("precio", form.precio);
      data.append("genero", form.genero);
      data.append("imagen", form.imagen);

      const res = await fetch("http://localhost:3001/libros", {
        method: "POST",
        body: data
      });

      if (!res.ok) throw new Error("Error al agregar libro");

      alert("Libro agregado correctamente!");

      if (onLibroAgregado) {
        onLibroAgregado(parseFloat(form.precio));
      }

      setForm({ nombre: "", autor: "", precio: "", genero: "", imagen: null });
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar el libro.");
    }
  };

  const colores = {
    fondo: "#4b2e05",
    tarjeta: "#8b5e3c",
    texto: "#fffaf0",
    boton: "#d2b48c",
    botonHover: "#c3a16d"
  };

  return (
    <div
      style={{
        backgroundColor: colores.fondo,
        color: colores.texto,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >
      <div
        style={{
          backgroundColor: colores.tarjeta,
          padding: 30,
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          width: 350,
          textAlign: "center"
        }}
      >
        <h1 style={{ marginBottom: 20 }}>Añadir Libro</h1>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            name="nombre"
            placeholder="Nombre"
            onChange={handleChange}
            value={form.nombre}
            style={{ padding: 8, borderRadius: 5, border: "1px solid #3e2400" }}
          />
          <input
            name="autor"
            placeholder="Autor"
            onChange={handleChange}
            value={form.autor}
            style={{ padding: 8, borderRadius: 5, border: "1px solid #3e2400" }}
          />
          <input
            name="precio"
            type="number"
            step="0.01"
            placeholder="Precio"
            onChange={handleChange}
            value={form.precio}
            style={{ padding: 8, borderRadius: 5, border: "1px solid #3e2400" }}
          />
          <input
            name="genero"
            placeholder="Género"
            onChange={handleChange}
            value={form.genero}
            style={{ padding: 8, borderRadius: 5, border: "1px solid #3e2400" }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              padding: 8,
              borderRadius: 5,
              border: "1px solid #3e2400",
              backgroundColor: "#fffaf0",
              color: "#3e2400"
            }}
          />
          <button
            type="submit"
            style={{
              marginTop: 10,
              backgroundColor: colores.boton,
              color: "#3e2400",
              border: "none",
              borderRadius: 5,
              padding: "10px 0",
              cursor: "pointer",
              fontWeight: "bold"
            }}
            onMouseOver={e => (e.target.style.backgroundColor = colores.botonHover)}
            onMouseOut={e => (e.target.style.backgroundColor = colores.boton)}
          >
            Agregar Libro
          </button>
        </form>
      </div>
    </div>
  );
}

export default AnadirLibro;
