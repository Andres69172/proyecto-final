import React from 'react';
import { Link } from 'react-router-dom';

const TarjetaJuego = ({ juego }) => {
  return (
    <div className="juego-card">
      <img 
        src={juego.image || 'https://via.placeholder.com/300x180?text=Sin+Imagen'} 
        alt={juego.title} 
      />
      <div className="juego-card-content">
        <h3>{juego.title}</h3>
        <p>{juego.platform}</p>
        <p className="rating">★ {juego.rating || 'Sin calificación'}</p>
        <div className="actions">
          <Link to={`/juego/${juego._id}`} className="btn">Ver Detalles</Link>
          <Link to={`/juego/editar/${juego._id}`} className="btn btn-secondary">Editar</Link>
        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;