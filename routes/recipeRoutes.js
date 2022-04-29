const express = require('express');
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');

const router = express.Router();

//get all recipes &create recipes
router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(authController.protect, recipeController.createRecipe);

//update recipes & delete recipes
router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(
    authController.protect,
    recipeController.uploadRecipeImages,
    recipeController.resizeRecipeImages,
    recipeController.updateRecipe
  )
  .delete(authController.protect, recipeController.deleteRecipe);

module.exports = router;
