const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: String, required: true},
    recipeId: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, required: true }
  });
  
  module.exports = mongoose.model('Rating', ratingSchema);
  