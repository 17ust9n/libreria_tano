// src/App.js
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PaginaPrincipal from "./pages/PaginaPrincipal";
import AnadirLibro from "./pages/AnadirLibro";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="App" style={{ padding: 20 }}>
        <header>
          <h1>Librería Tano</h1>
          <nav style={{ marginBottom: 20 }}>
            <Link to="/" style={{ marginRight: 10 }}>🏠 Inicio</Link>
            <Link to="/agregar">➕ Añadir Libro</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<PaginaPrincipal />} />
          <Route path="/agregar" element={<AnadirLibro />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
