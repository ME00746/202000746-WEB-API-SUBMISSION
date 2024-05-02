import React, { useState } from 'react';
import axios from 'axios';
const CreateRecipe = () => {
  const [newIngredient, setNewIngredient] = useState('');

  const [recipe, setRecipe] = useState({
    label: '',
    image: '',
    totalTime: 0,
    healthLabels: [],
    ingredientLines: [],
    calories: 0,
    cookingMethod: '',
    totalNutrients: {
      FAT: { label: '', quantity: 0, unit: '' },
      CHOCDF: { label: '', quantity: 0, unit: '' },
      PROCNT: { label: '', quantity: 0, unit: '' },
    },
  });
  
  const [dietarySearchQuery, setDietarySearchQuery] = useState('');

  const [dietaryPreferencesList, setDietaryPreferencesList] = useState([
    'alcohol-cocktail', 'alcohol-free', 'celery-free', 'crustacean-free', 'dairy-free', 'DASH',
    'egg-free', 'fish-free', 'fodmap-free', 'gluten-free', 'immuno-supportive', 'keto-friendly',
    'kidney-friendly', 'kosher', 'low-fat-abs', 'low-potassium', 'low-sugar', 'lupine-free',
    'Mediterranean', 'mollusk-free', 'mustard-free', 'no-oil-added', 'paleo', 'peanut-free',
    'pescatarian', 'pork-free', 'red-meat-free', 'sesame-free', 'shellfish-free', 'soy-free',
    'sugar-conscious', 'sulfite-free', 'tree-nut-free', 'vegan', 'vegetarian', 'wheat-free'
]);
const handleDietaryPreferenceSelect = (preference) => {
  setRecipe({ ...recipe, healthLabels: [...recipe.healthLabels, preference] });
  setDietaryPreferencesList(dietaryPreferencesList.filter(item => item !== preference));
};

const handleRemoveDietaryPreference = (preference) => {
  setRecipe({ ...recipe, healthLabels: recipe.healthLabels.filter(item => item !== preference) });
  setDietaryPreferencesList([...dietaryPreferencesList, preference]);
};

const handleDietaryPreferenceChange = (e) => {
  setDietarySearchQuery(e.target.value);
};

const filteredDietaryPreferences = dietaryPreferencesList.filter(preference =>
  preference.toLowerCase().includes(dietarySearchQuery.toLowerCase())
);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Recipe Details:');
    console.log(recipe);
    const headers = {
      Authorization: `${localStorage.getItem('token')}`,
    };
    axios
      .post('http://localhost:5000/api/createRecipe', recipe, { headers })
      .then((response) => {
        console.log(response.data);
        window.location.href = '/';
        
      })
      .catch((error) => {
        console.log(error);
      });

      
  };
  const handleAddIngredient = () => {
    if (newIngredient.trim() !== '') {
      setRecipe({
        ...recipe,
        ingredientLines: [...recipe.ingredientLines, newIngredient.trim()],
      });
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredientLines = [...recipe.ingredientLines];
    updatedIngredientLines.splice(index, 1);
    setRecipe({ ...recipe, ingredientLines: updatedIngredientLines });
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Create a New Recipe</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="label">
              Recipe Label
            </label>
            <input
              id="label"
              className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Enter Recipe Label"
              value={recipe.label}
              onChange={(e) => setRecipe({ ...recipe, label: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Image URL
            </label>
            <input
              id="image"
              className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Enter Image URL"
              value={recipe.image}
              onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
            />
          </div>
          <div className="mb-4 flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 px-2 mb-4 sm:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="totalTime">
                Total Time (minutes)
              </label>
              <input
                id="totalTime"
                className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                type="number"
                placeholder="Enter Total Time"
                value={recipe.totalTime}
                onChange={(e) => setRecipe({ ...recipe, totalTime: e.target.value })}
              />
            </div>
            <div className="w-full sm:w-1/2 px-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="calories">
                Calories
              </label>
              <input
                id="calories"
                className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                type="number"
                placeholder="Enter Calories"
                value={recipe.calories}
                onChange={(e) => setRecipe({ ...recipe, calories: e.target.value })}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredient">
              Ingredient Lines
            </label>
            <input
              id="ingredient"
              className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
              type="text"
              placeholder="Enter Ingredient Line"
              value={newIngredient}
              onChange={(e) => setNewIngredient(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddIngredient();
                }
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recipe.ingredientLines.map((ingredient, index) => (
              <div key={index} className="bg-gray-200 rounded-md p-2 flex justify-between items-center">
                <div>{ingredient}</div>
                <button
                  type="button"
                  className="text-red-500"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ingredient">
              Dietery Preferences
            </label>
                            <div className="flex flex-wrap gap-2">
                                <input
                                    type="text"
                                    placeholder="Search dietary preferences..."
                                    value={dietarySearchQuery}
                                    onChange={handleDietaryPreferenceChange}
                                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <div className="relative w-full">
                                    {dietarySearchQuery && (
                                        <ul className="absolute z-10 bg-gray-200 border border-gray-300 rounded-lg mt-2 w-full">
                                            {filteredDietaryPreferences.slice(0, 6).map((preference, index) => (
                                                <li
                                                    key={index}
                                                    onClick={() => handleDietaryPreferenceSelect(preference)}
                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                                                >
                                                    {preference}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                        {recipe.healthLabels.length > 0 && (
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold mb-3">Selected Dietary Preferences</h2>
                                <div className="flex flex-wrap gap-2">
                                    {recipe.healthLabels.map((preference, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleRemoveDietaryPreference(preference)}
                                            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                                        >
                                            {preference}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}


          <div className="mb-4 flex flex-wrap -mx-2">
          <div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fatQuantity">
                Fat Quantity
              </label>
              <input
                id="fatQuantity"
                className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                type="number"
                placeholder="Enter Fat Quantity"
                value={recipe.totalNutrients.FAT.quantity}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    totalNutrients: { ...recipe.totalNutrients, FAT: { ...recipe.totalNutrients.FAT, quantity: e.target.value } },
                  })
                }
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="CarbsQuantity">
                Carbs Quantity
              </label>
              <input
                id="CarbsQuantity"
                className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                type="number"
                placeholder="Enter Carbs Quantity"
                value={recipe.totalNutrients.CHOCDF.quantity}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    totalNutrients: { ...recipe.totalNutrients, CHOCDF: { ...recipe.totalNutrients.CHOCDF, quantity: e.target.value } },
                  })
                }
              />
            </div>
            <div className="w-full sm:w-1/3 px-2 mb-4 sm:mb-0">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="ProteinQuantity">
              Protein Quantity
              </label>
              <input
                id="ProteinQuantity"
                className="w-full border-b-2 border-gray-300 py-2 px-3 focus:outline-none focus:border-blue-500"
                type="number"
                placeholder="Enter Protein Quantity"
                value={recipe.totalNutrients.PROCNT.quantity}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    totalNutrients: { ...recipe.totalNutrients, PROCNT: { ...recipe.totalNutrients.PROCNT, quantity: e.target.value } },
                  })
                }
              />
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Submit Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRecipe;
