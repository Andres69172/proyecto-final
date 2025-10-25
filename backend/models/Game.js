const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor ingresa el título del juego'],
    trim: true,
    maxlength: [100, 'El título no puede tener más de 100 caracteres'],
    index: true
  },
  platform: {
    type: String,
    required: [true, 'Por favor ingresa la plataforma'],
    trim: true,
    enum: ['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series X', 'Xbox One', 'Nintendo Switch', 'Mobile', 'Otro']
  },
  genre: {
    type: String,
    required: [true, 'Por favor ingresa el género'],
    trim: true,
    enum: ['Acción', 'Aventura', 'RPG', 'Estrategia', 'Deportes', 'Simulación', 'Puzzle', 'FPS', 'Plataformas', 'Otro']
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    required: [true, 'Por favor ingresa una descripción'],
    trim: true,
    minlength: [10, 'La descripción debe tener al menos 10 caracteres']
  },
  rating: {
    type: Number,
    min: [0, 'La calificación mínima es 0'],
    max: [5, 'La calificación máxima es 5'],
    default: 0
  },
  developer: {
    type: String,
    trim: true,
    default: 'Desconocido'
  },
  publisher: {
    type: String,
    trim: true,
    default: 'Desconocido'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices para mejorar el rendimiento de las consultas
GameSchema.index({ platform: 1 });
GameSchema.index({ genre: 1 });
GameSchema.index({ rating: -1 });

// Virtual para obtener las reseñas asociadas al juego
GameSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'gameId',
  justOne: false
});

module.exports = mongoose.model('Game', GameSchema);