import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TarjetaJuego from './TarjetaJuego';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [generoFiltro, setGeneroFiltro] = useState('');

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const res = await axios.get('/api/games');
        setJuegos(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar juegos:', err);
        setLoading(false);
      }
    };

    fetchJuegos();
  }, []);

  const filtrarJuegos = () => {
    return juegos.filter(juego => {
      const coincideTitulo = juego.title.toLowerCase().includes(busqueda.toLowerCase());
      const coincideGenero = generoFiltro === '' || juego.genre === generoFiltro;
      return coincideTitulo && coincideGenero;
    });
  };

  const generos = [...new Set(juegos.map(juego => juego.genre))];

  if (loading) {
    return <div>Cargando juegos...</div>;
  }

  return (
    <div>
      <h2>Mi Biblioteca de Videojuegos</h2>
      
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por título..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="form-control"
        />
        
        <select
          value={generoFiltro}
          onChange={(e) => setGeneroFiltro(e.target.value)}
          className="form-control"
        >
          <option value="">Todos los géneros</option>
          {generos.map(genero => (
            <option key={genero} value={genero}>{genero}</option>
          ))}
        </select>
      </div>
      
      {filtrarJuegos().length === 0 ? (
        <div className="mensaje-vacio">
          <p>No se encontraron juegos. ¿Quieres agregar uno?</p>
          <Link to="/juego/nuevo" className="btn">Agregar Juego</Link>
        </div>
      ) : (
        <div className="juegos-grid">
          {filtrarJuegos().map(juego => (
            <TarjetaJuego key={juego._id} juego={juego} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;