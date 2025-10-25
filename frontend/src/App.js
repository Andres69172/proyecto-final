import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes
import Navbar from './components/Navbar';
import BibliotecaJuegos from './components/BibliotecaJuegos';
import FormularioJuego from './components/FormularioJuego';
import DetalleJuego from './components/DetalleJuego';
import EstadisticasPersonales from './components/EstadisticasPersonales';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<BibliotecaJuegos />} />
            <Route path="/juegos/nuevo" element={<FormularioJuego />} />
            <Route path="/juegos/editar/:id" element={<FormularioJuego />} />
            <Route path="/juegos/:id" element={<DetalleJuego />} />
            <Route path="/estadisticas" element={<EstadisticasPersonales />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <footer className="footer">
          <p>&copy; {new Date().getFullYear()} Biblioteca de Videojuegos - Todos los derechos reservados</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;