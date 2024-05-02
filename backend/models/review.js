const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  username: {type: String, required: true},
  recipeId: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Review', reviewSchema);

