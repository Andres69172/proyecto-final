const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo', 'Móvil']
  },
  genre: {
    type: String,
    required: true,
    enum: ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Simulación']
  },
  releaseDate: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Game', GameSchema);