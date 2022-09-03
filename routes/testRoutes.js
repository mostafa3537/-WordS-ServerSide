const express = require('express');
const recipeController = require('../controllers/testController');

const router = express.Router();

//get words endpoint
router.route('/words').get(recipeController.getWords);
//post rank endpoint
router.route('/rank').post(recipeController.getRank);

module.exports = router;
