import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const EstadisticasPersonales = () => {
  const [juegos, setJuegos] = useState([]);
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const juegosRes = await axios.get('/api/games');
        const resenasRes = await axios.get('/api/reviews');
        
        setJuegos(juegosRes.data);
        setResenas(resenasRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Datos para gráfico de géneros
  const generarDatosGeneros = () => {
    const generos = {};
    juegos.forEach(juego => {
      if (juego.genre) {
        generos[juego.genre] = (generos[juego.genre] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(generos),
      datasets: [
        {
          label: 'Juegos por género',
          data: Object.values(generos),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(199, 199, 199, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Datos para gráfico de plataformas
  const generarDatosPlataformas = () => {
    const plataformas = {};
    juegos.forEach(juego => {
      if (juego.platform) {
        plataformas[juego.platform] = (plataformas[juego.platform] || 0) + 1;
      }
    });

    return {
      labels: Object.keys(plataformas),
      datasets: [
        {
          label: 'Juegos por plataforma',
          data: Object.values(plataformas),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Datos para gráfico de calificaciones
  const generarDatosCalificaciones = () => {
    const calificaciones = {
      '1 estrella': 0,
      '2 estrellas': 0,
      '3 estrellas': 0,
      '4 estrellas': 0,
      '5 estrellas': 0,
    };
    
    resenas.forEach(resena => {
      const rating = resena.rating;
      calificaciones[`${rating} ${rating === 1 ? 'estrella' : 'estrellas'}`]++;
    });

    return {
      labels: Object.keys(calificaciones),
      datasets: [
        {
          label: 'Distribución de calificaciones',
          data: Object.values(calificaciones),
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(54, 162, 235, 0.6)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading) {
    return <div>Cargando estadísticas...</div>;
  }

  return (
    <div>
      <h2>Estadísticas Personales</h2>
      
      <div className="stats-summary">
        <div className="stat-card">
          <h3>Resumen</h3>
          <p>Total de juegos: <strong>{juegos.length}</strong></p>
          <p>Total de reseñas: <strong>{resenas.length}</strong></p>
          <p>Calificación promedio: <strong>
            {resenas.length > 0 
              ? (resenas.reduce((sum, resena) => sum + resena.rating, 0) / resenas.length).toFixed(1)
              : 'N/A'}
          </strong></p>
        </div>
      </div>
      
      <div className="stats-container">
        <div className="stat-card">
          <h3>Juegos por Género</h3>
          <div className="chart-container">
            <Pie data={generarDatosGeneros()} />
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Juegos por Plataforma</h3>
          <div className="chart-container">
            <Bar 
              data={generarDatosPlataformas()} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: 'Distribución por plataforma'
                  }
                }
              }}
            />
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Distribución de Calificaciones</h3>
          <div className="chart-container">
            <Pie data={generarDatosCalificaciones()} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EstadisticasPersonales;