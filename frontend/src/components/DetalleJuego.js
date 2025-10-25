import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FormularioResena from './FormularioResena';
import ListaResenas from './ListaResenas';

const DetalleJuego = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [juego, setJuego] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJuego = async () => {
      try {
        const res = await axios.get(`/api/games/${id}`);
        setJuego(res.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar el juego');
        setLoading(false);
        console.error(err);
      }
    };

    fetchJuego();
  }, [id]);

  const eliminarJuego = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este juego?')) {
      try {
        await axios.delete(`/api/games/${id}`);
        navigate('/');
      } catch (err) {
        setError('Error al eliminar el juego');
        console.error(err);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!juego) {
    return <div>No se encontró el juego</div>;
  }

  return (
    <div>
      <Link to="/" className="btn btn-secondary">Volver a la Biblioteca</Link>
      
      <div className="juego-detalle">
        <div className="juego-imagen">
          <img 
            src={juego.image || 'https://via.placeholder.com/400x600?text=Sin+Imagen'} 
            alt={juego.title} 
          />
        </div>
        
        <div className="juego-info">
          <h2>{juego.title}</h2>
          
          <div className="juego-meta">
            <span>{juego.platform}</span>
            <span>{juego.genre}</span>
            <span>
              {juego.releaseDate 
                ? new Date(juego.releaseDate).toLocaleDateString() 
                : 'Fecha desconocida'}
            </span>
          </div>
          
          <p className="rating">★ {juego.rating || 'Sin calificación'}</p>
          
          <p className="descripcion">{juego.description}</p>
          
          <div className="actions">
            <Link to={`/juego/editar/${juego._id}`} className="btn">Editar</Link>
            <button onClick={eliminarJuego} className="btn btn-danger">Eliminar</button>
          </div>
        </div>
      </div>
      
      <div className="resenas-container">
        <h3>Reseñas</h3>
        <FormularioResena gameId={id} />
        <ListaResenas gameId={id} />
      </div>
    </div>
  );
};

export default DetalleJuego;