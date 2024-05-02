const axios = require('axios');
const Recipe = require('../models/recipe');
const mongoose = require('mongoose');
const User = require('../models/users');
const reviewController = require('./reviewsController');

const createRecipe = async (req, res) => {
    try {
        console.log('createRecipe');
        req.body.userId = req.user.id;
        const user = await User.findById(req.user.id);
        req.body.source = user.username;

      const recipe = new Recipe(req.body);
      await recipe.save();
      res.status(201).json(recipe);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();
        // append the rating to each recipe
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const rating = await reviewController.calRating(recipe._id);
            recipe.rating = rating;
        }
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRecipesByUserId = async (req, res) => {
    try {
        const recipes = await Recipe.find({ userId: req.user.id });
        for (let i = 0; i < recipes.length; i++) {
            const recipe = recipes[i];
            const rating = await reviewController.calRating(recipe._id);
            recipe.rating = rating;
        }

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const editRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No recipe with id: ${id}`);
        const updatedRecipe = await Recipe.findByIdAndUpdate(id,recipe.recipe, { new: true });    

        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No recipe with id: ${id}`);

        await Recipe.findByIdAndDelete(id);

        res.json({ message: "Recipe deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}




const searchRecipes = async (req,res) => {
    console.log('searchRecipes');
    const criteria = req.body.criteria; 
    try {
        const appId = '01aa377a';
        const appKey = '15bd1380855384896c37d8a00fb41048';

        // Endpoint URL
        const url = 'https://api.edamam.com/api/recipes/v2';

        const response = await axios.get(url, {
            params: {
                type: 'public',
                q: criteria,
                app_id: appId,
                app_key: appKey
            }
        });
        console.log("here");

        const recipes = response.data.hits.map(hit => hit.recipe);

        res.status(200).json(recipes);


    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to fetch recipes');
    }
};

const getRecipeByUri = async (req, res) => {
    console.log('getRecipeByUri');
    try {
        const uri = req.body.uri;
        console.log(req.body);
        // Check if URI is provided
        if (!uri) {
            return res.status(400).json({ message: 'URI is required' });
        }

        // Fetch recipe from external API
        const appId = '01aa377a';
        const appKey = '15bd1380855384896c37d8a00fb41048';
        const url = 'https://api.edamam.com/api/recipes/v2/by-uri';

        const response = await axios.get(url, {
            params: {
                type: 'public',
                uri: uri,
                app_id: appId,
                app_key: appKey
            }
        });

        // If recipe is found, return it 
        if (response.status === 200 && response.data.hits.length > 0) {
            const recipe = response.data.hits[0].recipe;
            return res.status(200).json(recipe);
        } else {
            throw new Error('Recipe not found');
        }
    } catch (error) {
        try {
            const recipe = await Recipe.findById(id = req.body.uri);
            if (!recipe) {
                return res.status(404).json({ message: 'Recipe not found' });
            }
            return res.status(200).json(recipe);
        } catch (dbError) {
            console.error('Error in fetching recipe from database:', dbError.message);
            return res.status(500).json({ message: 'Error in fetching recipe from database' });
        }
    }
};
function containsIngredient(ingredientLine, ingredient) {
    return ingredientLine.indexOf(ingredient) !== -1;
}

function containsHealthLabel(healthLabel, dieterylabel) {
    return healthLabel.indexOf(dieterylabel) !== -1;
}

const advancedSearchRecipes = async (req, res) => {
    console.log('advancedSearchRecipes');
    const {mainsearch , ingredients , dieterylabels } = req.body;

    
    try {
        const appId = '01aa377a';
        const appKey = '15bd1380855384896c37d8a00fb41048';


        // Endpoint URL
        const url = 'https://api.edamam.com/api/recipes/v2';

        var response ;
        if(mainsearch === ''){

            var newmainsearch = ingredients.join(',');
            console.log(newmainsearch);
            console.log(dieterylabels.join(','));
            
            if(dieterylabels.length > 0){
                if(ingredients.length > 0){
                    response = await axios.get(url, {
                        params: {
                            type: 'public',
                            q: newmainsearch,
                            health: dieterylabels.join(','), 
                            app_id: appId,
                            app_key: appKey
                        }
                    });
                }
                else {
                    response = await axios.get(url, {
                        params: {
                            type: 'public',
                            health: dieterylabels.join(','), 
                            app_id: appId,
                            app_key: appKey
                        }
                    });
                }

            }
            else{
                if(ingredients.length > 0){
                    response = await axios.get(url, {
                        params: {
                            type: 'public',
                            q: newmainsearch,
                            app_id: appId,
                            app_key: appKey
                        }
                    });
                }
            }

        }
        else{
            response = await axios.get(url, {
                params: {
                    type: 'public',
                    q: mainsearch,
                    app_id: appId,
                    app_key: appKey
                }
            });
        }
        


        // get the recipes from the response

        const recipes = response.data.hits.map(hit => hit.recipe);

        //add the recipes from the database to the recipes array
        const recipesFromDB = await Recipe.find();

        recipesFromDB.forEach(recipe => {
            

            if (mainsearch != '') {
                if (recipe.label.includes(mainsearch)) {
                    recipes.push(recipe);
                }

            } 
            ingredients.forEach(ingredient => {
                recipe.ingredientLines.forEach(ingredientLine => {
                    if (containsIngredient(ingredientLine.toLowerCase(), ingredient.toLowerCase())) {
                        recipes.push(recipe);
                    }
                });
            });
            dieterylabels.forEach(dieterylabel => {
                    recipe.healthLabels.forEach(healthLabel => {
                        if (containsHealthLabel(healthLabel.toLowerCase(), dieterylabel.toLowerCase())) {
                            recipes.push(recipe);
                        }
                    });
                }
                );


            }

        );
        
       

            // append the rating to each recipe
            for (let i = 0; i < recipes.length; i++) {
                const recipe = recipes[i];
                const rating = await reviewController.calRating(recipe._id?recipe._id:recipe.uri);
                recipe.rating = rating;
            }

        res.status(200).json(recipes);

    } catch (error) {
        res.status(500).send('An error occurred while trying to fetch recipes');
    }
};

        

const searchRecipesWithHealth = async (req, res) => {
    console.log('searchRecipesWithHealth');
    const { criteria, healthLabels } = req.body; 
    try {
        const appId = '01aa377a';
        const appKey = '15bd1380855384896c37d8a00fb41048';

        // Endpoint URL
        const url = 'https://api.edamam.com/api/recipes/v2';

        const response = await axios.get(url, {
            params: {
                type: 'public',
                q: criteria,
                health: healthLabels.join(','),
                app_id: appId,
                app_key: appKey
            }
        });

        // get the recipes from the response
        const recipes = response.data.hits.map(hit => hit.recipe);

        res.status(200).json(recipes);

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to fetch recipes');
    }
};

const getRecipieswithIngredients = async (req,res) => {
    console.log('getRecipieswithIngredients');
    const ingredients = req.body.ingredients;
    const ingrString = ingredients.join(',');
    try {
        // Define API credentials
        const appId = '01aa377a';
        const appKey = '15bd1380855384896c37d8a00fb41048';

        // Endpoint URL
        const url = 'https://api.edamam.com/api/recipes/v2';

        const response = await axios.get(url, {
            params: {
                type: 'public',
                q : ingrString,
                app_id: appId,
                app_key: appKey,
                nutrients: 'PROCNT'
            }
        });

        // get the recipes from the response
        const recipes = response.data.hits.map(hit => hit.recipe);

        res.status(200).json(recipes);

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to fetch recipes');

    }
};

// get 5 random recipes
const getRandomRecipes = async (req, res) => {
    console.log('getRandomRecipes');
    try {
        const appId = '01aa377a';
        const appKey = '15bd1380855384896c37d8a00fb41048';

        // Endpoint URL
        const url = 'https://api.edamam.com/api/recipes/v2';

        const response = await axios.get(url, {
            params: {
                type: 'public',
                // this is not workingq: '*',
                q: 'chicken',
                app_id: appId,
                app_key: appKey
            }
        });

        // get 5 random recipes
        const recipes = response.data.hits.map(hit => hit.recipe);
        const randomRecipes = recipes.sort(() => Math.random() - Math.random()).slice(0, 12);

        // append the rating to each recipe
        for (let i = 0; i < randomRecipes.length; i++) {
            const recipe = randomRecipes[i];
            const rating = await reviewController.calRating(recipe._id?recipe._id:recipe.uri);
            recipe.rating = rating;
        }
        res.status(200).json(randomRecipes);

    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while trying to fetch recipes');
    }
};



module.exports = {
    advancedSearchRecipes,
    createRecipe,
    getRecipes,
    getRecipesByUserId,
    editRecipe,
    deleteRecipe,
    getRandomRecipes,
    getRecipeByUri,
    searchRecipes,
    searchRecipesWithHealth,
    getRecipieswithIngredients

};

