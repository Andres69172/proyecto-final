const express = require('express');
const router = express.Router();
const Game = require('../models/Game');

// GET todos los juegos
router.get('/', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET un juego específico
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    res.json(game);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST crear un nuevo juego
router.post('/', async (req, res) => {
  const game = new Game({
    title: req.body.title,
    platform: req.body.platform,
    genre: req.body.genre,
    releaseDate: req.body.releaseDate,
    image: req.body.image,
    description: req.body.description,
    rating: req.body.rating || 0
  });

  try {
    const newGame = await game.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT actualizar un juego
router.put('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    
    if (req.body.title) game.title = req.body.title;
    if (req.body.platform) game.platform = req.body.platform;
    if (req.body.genre) game.genre = req.body.genre;
    if (req.body.releaseDate) game.releaseDate = req.body.releaseDate;
    if (req.body.image) game.image = req.body.image;
    if (req.body.description) game.description = req.body.description;
    if (req.body.rating !== undefined) game.rating = req.body.rating;
    
    const updatedGame = await game.save();
    res.json(updatedGame);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE eliminar un juego
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' });
    
    await game.remove();
    res.json({ message: 'Juego eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;