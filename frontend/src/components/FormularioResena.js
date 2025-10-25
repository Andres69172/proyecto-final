import React, { useState } from 'react';
import axios from 'axios';

const FormularioResena = ({ gameId }) => {
  const [formData, setFormData] = useState({
    rating: 5,
    text: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post('/api/reviews', {
        gameId,
        rating: parseInt(formData.rating),
        text: formData.text
      });
      
      setFormData({
        rating: 5,
        text: ''
      });
      setSuccess(true);
      
      // Recargar la página para mostrar la nueva reseña
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError('Error al guardar la reseña');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h4>Escribe una reseña</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">Reseña guardada correctamente</div>}
      
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="rating">Calificación</label>
          <select
            name="rating"
            id="rating"
            value={formData.rating}
            onChange={onChange}
            className="form-control"
          >
            <option value="5">5 estrellas - Excelente</option>
            <option value="4">4 estrellas - Muy bueno</option>
            <option value="3">3 estrellas - Bueno</option>
            <option value="2">2 estrellas - Regular</option>
            <option value="1">1 estrella - Malo</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="text">Tu opinión</label>
          <textarea
            name="text"
            id="text"
            value={formData.text}
            onChange={onChange}
            className="form-control"
            rows="3"
            required
          ></textarea>
        </div>
        
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Guardando...' : 'Publicar Reseña'}
        </button>
      </form>
    </div>
  );
};

export default FormularioResena;