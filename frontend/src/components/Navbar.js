import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1>Mi Biblioteca de Videojuegos</h1>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <Link to="/juego/nuevo">Agregar Juego</Link>
        </li>
        <li>
          <Link to="/estadisticas">Estadísticas</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;