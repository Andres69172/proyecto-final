import React from 'react';
import styles from './TarjetaJuego.module.css';
import { Link } from 'react-router-dom';

// Objeto con los iconos de plataforma
const PLATFORM_ICONS = {
  'PS5': '🎮',
  'PS4': '🎮',
  'Xbox Series X': '🟩',
  'Xbox One': '🟩',
  'Nintendo Switch': '🕹️',
  'PC': '💻',
  'default': '🎮'
};

// Función para obtener el icono según la plataforma
const getPlatformIcon = (platform) => {
  return PLATFORM_ICONS[platform] || PLATFORM_ICONS.default;
};

const TarjetaJuego = ({ juego }) => {
  const { _id, title, platform, image, rating = 0, genre = 'Sin género', releaseDate } = juego || {};

  // Imagen por defecto si no hay una disponible
  const imagenUrl = image || 'https://via.placeholder.com/600x400?text=Sin+Imagen';

  // Formatear fecha de lanzamiento
  const fechaFormateada = releaseDate ? new Date(releaseDate).toLocaleDateString() : 'Desconocida';

  const estrellas = '★'.repeat(Math.max(0, Math.min(5, Math.round(rating))));

  return (
    <article className={styles.card} aria-labelledby={`titulo-${_id}`}>
      <div className={styles.imageContainer}>
        <img className={styles.portada} src={imagenUrl} alt={`${title} - portada`} loading="lazy" />
        <span className={styles.genreBadge}>{genre}</span>
        <span className={styles.platformBadge} title={platform}>
          {getPlatformIcon(platform)} {platform}
        </span>
      </div>

      <div className={styles.content}>
        <h3 id={`titulo-${_id}`} className={styles.title}>{title}</h3>
        <p className={styles.date}>Lanzamiento: <time dateTime={releaseDate || ''}>{fechaFormateada}</time></p>

        <div className={styles.rating} title={`Puntuación ${rating.toFixed ? rating.toFixed(1) : rating}`}>
          <span className={styles.stars} aria-hidden>{estrellas}</span>
          <span className={styles.ratingNumber}>{(rating && rating.toFixed) ? rating.toFixed(1) : rating}</span>
        </div>

        <div className={styles.actions}>
          <Link to={`/juegos/${_id}`} className={`${styles.btn} ${styles.btnView}`} aria-label={`Ver detalles de ${title}`}>Ver detalles</Link>
          <Link to={`/juegos/editar/${_id}`} className={`${styles.btn} ${styles.btnEdit}`} aria-label={`Editar ${title}`}>Editar</Link>
        </div>
      </div>
    </article>
  );
};

export default TarjetaJuego;