const mongoose = require('mongoose');
// const validator = require('validator');

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      // required: [true, 'A recipe must have a name'],
      // unique: true,
      trim: true,
    },
    ingredient: {
      type: String,
      // required: [true, 'A recipe must have a ingredient'],
      // unique: true,
      trim: true,
    },

    // ratingsAverage: {
    //   type: Number,
    //   default: 4.5,
    //   min: [1, 'Rating must be above 1.0'],
    //   max: [5, 'Rating must be below 5.0'],
    //   set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    // },
    // ratingsQuantity: {
    //   type: Number,
    //   default: 0,
    // },
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

recipeSchema.index({ price: 1, ratingsAverage: -1 });

// QUERY MIDDLEWARE
recipeSchema.pre(/^find/, function (next) {
  this.find({ secretrecipe: { $ne: true } });

  this.start = Date.now();
  next();
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
