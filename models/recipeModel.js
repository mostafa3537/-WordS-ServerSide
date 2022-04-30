const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, 'A recipe must have a name'],
      // unique: true,
    },
    ingredient: {
      type: String,
      // required: [true, 'A recipe must have a ingredient'],
    },
    category: {
      type: String,
      enum: ['Egyption Recipes', 'Italian Recipes', 'Asian Recipes'],
      default: 'Egyption Recipes',
    },

    imageCover: {
      type: String,
      // required: [true, 'A recipe must have a cover image'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

recipeSchema.index({ title: 1 });

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
