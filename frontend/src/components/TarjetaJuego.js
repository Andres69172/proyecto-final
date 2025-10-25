import React from 'react';
import { Link } from 'react-router-dom';

const TarjetaJuego = ({ juego }) => {
  const { _id, title, platform, image, rating, genre, releaseDate } = juego;
  
  // Imagen por defecto si no hay una disponible
  const imagenUrl = image || 'https://via.placeholder.com/150?text=Sin+Imagen';
  
  // Formatear fecha de lanzamiento
  const fechaFormateada = releaseDate ? new Date(releaseDate).toLocaleDateString() : 'Desconocida';

  return (
    <div className="tarjeta-juego">
      <div className="tarjeta-imagen">
        <img src={imagenUrl} alt={title} />
        <div className="tarjeta-genero">{genre}</div>
      </div>
      
      <div className="tarjeta-contenido">
        <h3>{title}</h3>
        <p className="plataforma">{platform}</p>
        <p className="fecha-lanzamiento">Lanzamiento: {fechaFormateada}</p>
        
        <div className="tarjeta-rating">
          <span className="estrellas">{'★'.repeat(Math.round(rating))}</span>
          <span className="rating-numero">{rating.toFixed(1)}</span>
        </div>
        
        <div className="tarjeta-acciones">
          <Link to={`/juegos/${_id}`} className="btn btn-ver">Ver detalles</Link>
          <Link to={`/juegos/editar/${_id}`} className="btn btn-editar">Editar</Link>
        </div>
      </div>
    </div>
  );
};

export default TarjetaJuego;