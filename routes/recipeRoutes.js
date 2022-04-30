const express = require('express');
const recipeController = require('../controllers/recipeController');
const authController = require('../controllers/authController');

const router = express.Router();

//get all recipes &create recipes
router
  .route('/')
  .get(recipeController.getAllRecipes)
  .post(
    authController.protect,
    recipeController.createRecipe,
    recipeController.uploadRecipeImage,
    recipeController.resizeRecipeImage
  );

//update recipes & delete recipes
router
  .route('/:id')
  .get(recipeController.getRecipe)
  .patch(
    authController.protect,
    recipeController.uploadRecipeImage,
    recipeController.resizeRecipeImage,
    recipeController.updateRecipe
  )
  .delete(authController.protect, recipeController.deleteRecipe);

module.exports = router;
