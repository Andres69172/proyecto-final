import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="brand">
        <span className="logo" aria-hidden></span>
        <h1>Mi Biblioteca</h1>
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/estadisticas">Estadísticas</Link>
        </li>
        <li>
          <Link to="/juego/nuevo" className="nav-cta">Agregar Juego</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;