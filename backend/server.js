const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Rutas
const gameRoutes = require('./routes/games');
const reviewRoutes = require('./routes/reviews');

// Configuración
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/videogames-library', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conexión a MongoDB establecida'))
.catch(err => console.error('Error al conectar a MongoDB:', err));

// Rutas API
app.use('/api/games', gameRoutes);
app.use('/api/reviews', reviewRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Biblioteca de Videojuegos funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});