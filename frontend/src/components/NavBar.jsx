import { useState } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      <h1 className="navbar-title">Mi Librería</h1>
      
      <div className="menu-container">
        <button className="menu-button" onClick={toggleMenu}>
          Menú {/* Texto del botón */}
        </button>
        
        {menuOpen && (
          <div className="menu-dropdown">
            <Link to="/" onClick={toggleMenu}>Inicio</Link>
            <Link to="/anadir" onClick={toggleMenu}>Añadir Libro</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
