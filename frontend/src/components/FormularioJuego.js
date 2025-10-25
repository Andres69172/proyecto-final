import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const FormularioJuego = () => {
  const { id } = useParams();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    title: '',
    platform: '',
    genre: '',
    releaseDate: '',
    image: '',
    description: '',
    developer: '',
    publisher: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isEditing) {
      const fetchGame = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`/api/games/${id}`);
          const game = res.data;
          
          // Formatear la fecha para el input date
          const releaseDate = game.releaseDate 
            ? new Date(game.releaseDate).toISOString().split('T')[0]
            : '';
            
          setFormData({
            title: game.title || '',
            platform: game.platform || '',
            genre: game.genre || '',
            releaseDate,
            image: game.image || '',
            description: game.description || '',
            developer: game.developer || '',
            publisher: game.publisher || ''
          });
          setLoading(false);
        } catch (err) {
          setError('Error al cargar el juego');
          setLoading(false);
          console.error('Error al cargar el juego:', err);
        }
      };
      
      fetchGame();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (formData.description.length < 10) {
      toast.error('La descripción debe tener al menos 10 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      if (isEditing) {
        await axios.put(`/api/games/${id}`, formData);
        toast.success('Juego actualizado correctamente');
      } else {
        await axios.post('/api/games', formData);
        toast.success('Juego creado correctamente');
      }
      
      navigate('/biblioteca');
    } catch (error) {
      setError('Error al guardar el juego');
      toast.error('Error al guardar el juego');
      console.error('Error al guardar el juego:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div className="loading">Cargando juego...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="formulario-container">
      <h2>{isEditing ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Título</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="platform">Plataforma</label>
          <select
            id="platform"
            name="platform"
            value={formData.platform}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una plataforma</option>
            <option value="PC">PC</option>
            <option value="PlayStation 5">PlayStation 5</option>
            <option value="PlayStation 4">PlayStation 4</option>
            <option value="Xbox Series X">Xbox Series X</option>
            <option value="Xbox One">Xbox One</option>
            <option value="Nintendo Switch">Nintendo Switch</option>
            <option value="Mobile">Mobile</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="genre">Género</label>
          <select
            id="genre"
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona un género</option>
            <option value="Acción">Acción</option>
            <option value="Aventura">Aventura</option>
            <option value="RPG">RPG</option>
            <option value="Estrategia">Estrategia</option>
            <option value="Deportes">Deportes</option>
            <option value="Simulación">Simulación</option>
            <option value="Puzzle">Puzzle</option>
            <option value="FPS">FPS</option>
            <option value="Plataformas">Plataformas</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="releaseDate">Fecha de Lanzamiento</label>
          <input
            type="date"
            id="releaseDate"
            name="releaseDate"
            value={formData.releaseDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="developer">Desarrollador</label>
          <input
            type="text"
            id="developer"
            name="developer"
            value={formData.developer}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="publisher">Distribuidor</label>
          <input
            type="text"
            id="publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">URL de la Imagen</label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />
          {formData.image && (
            <div className="image-preview">
              <img src={formData.image} alt="Vista previa" />
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            minLength="10"
            rows="5"
          ></textarea>
          <small>{formData.description.length}/10 caracteres mínimo</small>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/biblioteca')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Actualizar Juego' : 'Guardar Juego'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioJuego;