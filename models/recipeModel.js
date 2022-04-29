const mongoose = require('mongoose');
// const validator = require('validator');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A recipe must have a name'],
      // unique: true,
    },
    ingredient: [
      {
        type: String,
        required: [true, 'A recipe must have a ingredient'],
      },
    ],
    imageCover: {
      type: String,
      required: [true, 'A recipe must have a cover image'],
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
