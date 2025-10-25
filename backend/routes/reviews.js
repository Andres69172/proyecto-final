const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Game = require('../models/Game');

// GET todas las reseñas
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET reseñas por juego
router.get('/game/:gameId', async (req, res) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST crear una nueva reseña
router.post('/', async (req, res) => {
  const review = new Review({
    gameId: req.body.gameId,
    rating: req.body.rating,
    text: req.body.text
  });

  try {
    const newReview = await review.save();
    
    // Actualizar calificación promedio del juego
    const gameReviews = await Review.find({ gameId: req.body.gameId });
    const avgRating = gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length;
    
    await Game.findByIdAndUpdate(req.body.gameId, { rating: Math.round(avgRating * 10) / 10 });
    
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE eliminar una reseña
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });
    
    const gameId = review.gameId;
    await review.remove();
    
    // Actualizar calificación promedio del juego
    const gameReviews = await Review.find({ gameId });
    if (gameReviews.length > 0) {
      const avgRating = gameReviews.reduce((sum, review) => sum + review.rating, 0) / gameReviews.length;
      await Game.findByIdAndUpdate(gameId, { rating: Math.round(avgRating * 10) / 10 });
    } else {
      await Game.findByIdAndUpdate(gameId, { rating: 0 });
    }
    
    res.json({ message: 'Reseña eliminada' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;