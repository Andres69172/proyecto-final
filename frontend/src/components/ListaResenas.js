import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ListaResenas = ({ gameId }) => {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResenas = async () => {
      try {
        const res = await axios.get(`/api/reviews/game/${gameId}`);
        setResenas(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar reseñas:', err);
        setLoading(false);
      }
    };

    fetchResenas();
  }, [gameId]);

  const eliminarResena = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      try {
        await axios.delete(`/api/reviews/${id}`);
        setResenas(resenas.filter(resena => resena._id !== id));
      } catch (err) {
        console.error('Error al eliminar reseña:', err);
      }
    }
  };

  if (loading) {
    return <div>Cargando reseñas...</div>;
  }

  if (resenas.length === 0) {
    return <div>No hay reseñas para este juego.</div>;
  }

  return (
    <div className="resenas-lista">
      {resenas.map(resena => (
        <div key={resena._id} className="resena">
          <div className="resena-header">
            <span className="resena-rating">★ {resena.rating}</span>
            <span className="resena-fecha">
              {new Date(resena.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="resena-text">{resena.text}</p>
          <button 
            onClick={() => eliminarResena(resena._id)} 
            className="btn btn-danger btn-sm"
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
};

export default ListaResenas;