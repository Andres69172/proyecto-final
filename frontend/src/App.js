import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<BibliotecaJuegos />} />
            <Route path="/juego/nuevo" element={<FormularioJuego />} />
            <Route path="/juego/editar/:id" element={<FormularioJuego />} />
            <Route path="/juego/:id" element={<DetalleJuego />} />
            <Route path="/estadisticas" element={<EstadisticasPersonales />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;