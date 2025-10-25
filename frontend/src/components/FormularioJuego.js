import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FormularioJuego = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    genre: '',
    releaseDate: '',
    image: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchJuego = async () => {
        try {
          const res = await axios.get(`/api/games/${id}`);
          const juego = res.data;
          setFormData({
            title: juego.title,
            platform: juego.platform,
            genre: juego.genre,
            releaseDate: juego.releaseDate ? juego.releaseDate.substring(0, 10) : '',
            image: juego.image,
            description: juego.description
          });
        } catch (err) {
          setError('Error al cargar el juego');
          console.error(err);
        }
      };
      fetchJuego();
    }
  }, [id]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (id) {
        await axios.put(`/api/games/${id}`, formData);
      } else {
        await axios.post('/api/games', formData);
      }
      navigate('/');
    } catch (err) {
      setError('Error al guardar el juego');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>{id ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="platform">Plataforma</label>
          <input
            type="text"
            name="platform"
            id="platform"
            value={formData.platform}
            onChange={onChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="genre">Género</label>
          <select
            name="genre"
            id="genre"
            value={formData.genre}
            onChange={onChange}
            className="form-control"
            required
          >
            <option value="">Seleccionar género</option>
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="RPG">RPG</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Deportes">Deportes</option>
            <option value="Simulación">Simulación</option>
            <option value="Puzzle">Puzzle</option>
            <option value="Shooter">Shooter</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="releaseDate">Fecha de Lanzamiento</label>
          <input
            type="date"
            name="releaseDate"
            id="releaseDate"
            value={formData.releaseDate}
            onChange={onChange}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">URL de Imagen</label>
          <input
            type="url"
            name="image"
            id="image"
            value={formData.image}
            onChange={onChange}
            className="form-control"
            placeholder="https://ejemplo.com/imagen.jpg"
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={onChange}
            className="form-control"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar Juego'}
        </button>
      </form>
    </div>
  );
};

export default FormularioJuego;