const mongoose = require('mongoose');
const { use } = require('passport');

const recipeSchema = new mongoose.Schema({
    userId: {
    type: String,
    required: true
    },
  label: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  totalTime: {
    type: Number,
    required: true
  },
  healthLabels: {
    type: [String],
    required: true
  },
  ingredientLines: {
    type: [String],
    required: true
  },
  calories: {
    type: Number,
    required: true
  },
  totalNutrients: {
    FAT: {
      label: String,
      quantity: Number,
      unit: String
    },
    CHOCDF: {
      label: String,
      quantity: Number,
      unit: String
    },
    PROCNT: {
      label: String,
      quantity: Number,
      unit: String
    }
  },
  
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
