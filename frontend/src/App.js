import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import AnadirLibro from "./components/AnadirLibro";
import ListaLibros from "./components/ListaLibros";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: 20 }}>
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<PaginaPrincipal />} />

          {/* Página para añadir libros */}
          <Route path="/anadir" element={<AnadirLibro />} />

          {/* Página para listar libros */}
          <Route path="/libros" element={<ListaLibros />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
