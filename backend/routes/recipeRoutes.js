// create routes/recipeRoutes.js:

const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const authenticateJWT = require('../middleware/authmiddleware');

router.post('/createRecipe', authenticateJWT, recipeController.createRecipe);
router.get('/getRecipes', recipeController.getRecipes);
router.get('/getRecipesByUserId', authenticateJWT, recipeController.getRecipesByUserId);
router.put('/editRecipe/:id', authenticateJWT, recipeController.editRecipe);
router.delete('/deleteRecipe/:id', recipeController.deleteRecipe);

router.get('/searchRecipes', recipeController.searchRecipes);
router.get('/getRandomRecipes', recipeController.getRandomRecipes)
router.post('/getRecipeByUri', recipeController.getRecipeByUri); 
router.get('/searchRecipesWithHealth' , recipeController.searchRecipesWithHealth);
router.get('/getRecipieswithIngredients' , recipeController.getRecipieswithIngredients);
router.post('/advancedSearchRecipes', recipeController.advancedSearchRecipes);

module.exports = router;
