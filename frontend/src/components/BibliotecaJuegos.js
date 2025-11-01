import React, { useState, useEffect } from 'react';
import TarjetaJuego from './TarjetaJuego';
import gamesData from '../data/gamesData'; 

const BibliotecaJuegos = () => {
  // Inicialización de estados con los datos importados
  const [juegos, setJuegos] = useState(gamesData);
  // Los siguientes estados de 'loading' y 'error' ya no son estrictamente necesarios
  // si los datos se cargan síncronamente, pero se mantienen para flexibilidad.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [busqueda, setBusqueda] = useState('');
  const [generoFiltro, setGeneroFiltro] = useState('');
  const [plataformaFiltro, setPlataformaFiltro] = useState('');
  const [generos, setGeneros] = useState([]);
  const [plataformas, setPlataformas] = useState([]);
  const [ordenarPor, setOrdenarPor] = useState('title');

  // El useEffect ahora solo se encarga de extraer los géneros y plataformas
  // únicos de los datos importados (gamesData).
  useEffect(() => {
    // Evita el error de "doble declaración" y lógica de 'try/catch'
    // innecesaria ya que no hay una llamada asíncrona (fetch/axios).

    // Extraer géneros y plataformas únicos de los datos importados
    const generosUnicos = [...new Set(gamesData.map(juego => juego.genre))];
    const plataformasUnicas = [...new Set(gamesData.map(juego => juego.platform))];

    setGeneros(generosUnicos);
    setPlataformas(plataformasUnicas);

    // Si los datos se cargan síncronamente al inicio,
    // puedes establecer loading a false inmediatamente, o simplemente
    // inicializarlo en false y eliminar el 'if (loading)' en el return.
    // Lo mantendremos así por ahora.
    setLoading(false); 
    setError(null);
  }, []); // Dependencia vacía para que se ejecute solo al montar el componente

  // Filtrar juegos por búsqueda, género y plataforma
  const juegosFiltrados = juegos
    .filter(juego => {
      // Se asegura que 'juego.title' exista antes de llamar toLowerCase
      const coincideBusqueda = juego.title && juego.title.toLowerCase().includes(busqueda.toLowerCase());
      const coincideGenero = generoFiltro === '' || juego.genre === generoFiltro;
      const coincidePlataforma = plataformaFiltro === '' || juego.platform === plataformaFiltro;
      return coincideBusqueda && coincideGenero && coincidePlataforma;
    })
    .sort((a, b) => {
      if (ordenarPor === 'title') {
        return a.title.localeCompare(b.title);
      } else if (ordenarPor === 'rating') {
        // Asume que 'rating' es un número
        return b.rating - a.rating;
      } else if (ordenarPor === 'releaseDate') {
        // Asegúrate de que 'releaseDate' sea un formato de fecha válido
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
            // Es crucial usar una 'key' única, asumo que 'juego._id' es única.
            <TarjetaJuego key={juego._id} juego={juego} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default BibliotecaJuegos;