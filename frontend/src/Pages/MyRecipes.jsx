import React, { useState, useEffect } from 'react';
import RecipeCard from '../Components/RecipeCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MyRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const headers = {
            Authorization: `${localStorage.getItem('token')}`
        };

        axios.get('http://localhost:5000/api/getRecipesByUserId', { headers })
            .then((response) => {
                setRecipes(response.data);
                console.log(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const handleAddRecipe = () => {
        navigate('/create');
    };

    const handleEditRecipe = (recipeId) => {
        navigate(`/edit/${recipeId}`);
    };


    const handleDeleteRecipe = (recipeId) => {
        // Prompt the user for confirmation before deleting
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?');
        
        // If the user confirms, proceed with deletion
        if (confirmDelete) {
            const headers = {
                Authorization: `${localStorage.getItem('token')}`
            };
    
            axios.delete('http://localhost:5000/api/deleteRecipe/' + recipeId, { headers })
                .then((response) => {
                    console.log(response.data);
                    navigate('/myrecipes');
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error);
                });


        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4" style={
                { padding: '2%' }
            
            }>
                <h1 className="text-2xl font-bold">My Recipes</h1>
                <button onClick={handleAddRecipe} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Recipe
                </button>
            </div>
            {recipes.length === 0 && !isLoading && <p className="text-center">No recipes found. Add a new recipe to get started.</p>}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-8">
                {recipes.map((recipe, index) => (
                    <div key={index}>
                        <RecipeCard
                            id={recipe.uri? recipe.uri : recipe._id}
                            title={recipe.label}
                            rating={recipe.rating ? recipe.rating : 0}
                            imageUrl={recipe.images ? recipe.images.REGULAR.url : recipe.image}
                        />
                        <div className="flex justify-between mt-2">
                            <button onClick={() => handleEditRecipe(recipe._id)} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded">Edit</button>
                            <button onClick={() => handleDeleteRecipe(recipe._id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyRecipes;
