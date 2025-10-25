import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TarjetaJuego from './TarjetaJuego';

const BibliotecaJuegos = () => {
  const [juegos, setJuegos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [generoFiltro, setGeneroFiltro] = useState('');
  const [plataformaFiltro, setPlataformaFiltro] = useState('');
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState('title');

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/games');
        setJuegos(res.data);
        
        // Extraer géneros y plataformas únicos para los filtros
        const generosUnicos = [...new Set(res.data.map(juego => juego.genre))];
        const plataformasUnicas = [...new Set(res.data.map(juego => juego.platform))];
        
        setGeneros(generosUnicos);
        setPlataformas(plataformasUnicas);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los juegos');
        setLoading(false);
        console.error(err);
      }
    };

    fetchJuegos();
  }, []);

  // Filtrar juegos por búsqueda, género y plataforma
  const juegosFiltrados = juegos
    .filter(juego => {
      const coincideBusqueda = juego.title.toLowerCase().includes(busqueda.toLowerCase());
      const coincideGenero = generoFiltro === '' || juego.genre === generoFiltro;
      const coincidePlataforma = plataformaFiltro === '' || juego.platform === plataformaFiltro;
      return coincideBusqueda && coincideGenero && coincidePlataforma;
    })
    .sort((a, b) => {
      if (ordenarPor === 'title') {
        return a.title.localeCompare(b.title);
      } else if (ordenarPor === 'rating') {
        return b.rating - a.rating;
      } else if (ordenarPor === 'releaseDate') {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      }
      return 0;
    });

  const limpiarFiltros = () => {
    setBusqueda('');
    setGeneroFiltro('');
    setPlataformaFiltro('');
    setOrdenarPor('title');
  };

  if (loading) return <div className="loading">Cargando juegos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="biblioteca-juegos">
      <h1>Mi Biblioteca de Videojuegos</h1>
      
      <div className="filtros">
        <div className="filtros-busqueda">
          <input
            type="text"
            placeholder="Buscar juegos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="busqueda-input"
          />
          
          <select
            value={generoFiltro}
            onChange={(e) => setGeneroFiltro(e.target.value)}
            className="genero-select"
          >
            <option value="">Todos los géneros</option>
            {generos.map(genero => (
              <option key={genero} value={genero}>{genero}</option>
            ))}
          </select>
          
          <select
            value={plataformaFiltro}
            onChange={(e) => setPlataformaFiltro(e.target.value)}
            className="plataforma-select"
          >
            <option value="">Todas las plataformas</option>
            {plataformas.map(plataforma => (
              <option key={plataforma} value={plataforma}>{plataforma}</option>
            ))}
          </select>
        </div>
        
        <div className="filtros-ordenar">
          <label htmlFor="ordenar">Ordenar por:</label>
          <select
            id="ordenar"
            value={ordenarPor}
            onChange={(e) => setOrdenarPor(e.target.value)}
            className="ordenar-select"
          >
            <option value="title">Título</option>
            <option value="rating">Calificación</option>
            <option value="releaseDate">Fecha de lanzamiento</option>
          </select>
          
          <button onClick={limpiarFiltros} className="btn-limpiar">
            Limpiar filtros
          </button>
        </div>
      </div>
      
      {juegosFiltrados.length === 0 ? (
        <p className="no-juegos">No se encontraron juegos que coincidan con tu búsqueda.</p>
      ) : (
        <div className="juegos-grid">
          {juegosFiltrados.map(juego => (
            <TarjetaJuego key={juego._id} juego={juego} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;