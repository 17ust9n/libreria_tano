import { useState } from "react";

function AnadirLibro() {
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

    try {
      const data = new FormData();
      data.append("nombre", form.nombre);
      data.append("autor", form.autor);
      data.append("precio", form.precio);
      data.append("genero", form.genero);
      if (form.imagen) data.append("imagen", form.imagen);

      const res = await fetch("http://localhost:3001/libros", {
        method: "POST",
        body: data
      });

      if (!res.ok) throw new Error("Error al agregar libro");

      alert("Libro agregado correctamente!");
      setForm({ nombre: "", autor: "", precio: "", genero: "", imagen: null });
    } catch (error) {
      console.error(error);
      alert("No se pudo agregar el libro.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Añadir Libro</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 300 }}>
        <input name="nombre" placeholder="Nombre" onChange={handleChange} value={form.nombre} required />
        <input name="autor" placeholder="Autor" onChange={handleChange} value={form.autor} required />
        <input name="precio" type="number" step="0.01" placeholder="Precio" onChange={handleChange} value={form.precio} required />
        <input name="genero" placeholder="Género" onChange={handleChange} value={form.genero} required />
        <input type="file" accept="image/*" onChange={handleFileChange} required />
        <button type="submit" style={{ marginTop: 10 }}>Agregar Libro</button>
      </form>
    </div>
  );
}

export default AnadirLibro;
