import SearchPage from '../Pages/SearchPage';
import RecipeCard from '../Components/RecipeCard';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const MainPage = () => {
    const [recipes , setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [recipiesLoading , setRecipiesLoading] = useState(false);
    useEffect(() => {
        axios.get('http://localhost:5000/api/getRandomRecipes')
        .then((response) => {
            setRecipes(response.data);
            setIsLoading(false);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    , []);  

    const handleSearch = (searchQuery, selectedIngredients, selectedDietaryPreference) => {
        console.log(searchQuery , selectedIngredients , selectedDietaryPreference);
        setRecipiesLoading(true);
        axios.post('http://localhost:5000/api/advancedSearchRecipes', {
            mainsearch: searchQuery,
            ingredients: selectedIngredients,
            dieterylabels: selectedDietaryPreference
        })
        .then((response) => {
            setRecipes(response.data);
            setRecipiesLoading(false);
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
        
    }

    
    return (
        isLoading ? <div>Loading...</div> :

        <div>
            <SearchPage onSearch={handleSearch}/>
            {recipiesLoading ?
                <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
                </div> :  
            <div className="grid grid-cols-1 md:grid-cols-4 gap-1 p-8">

                {recipes.map((recipe, index) => {
                     
                    return(
                    <RecipeCard
                        key={index}
                        id={recipe.uri? recipe.uri : recipe._id}
                        title={recipe.label}
                        rating={recipe.rating ? recipe.rating : 0}
                        imageUrl={recipe.images? recipe.images.REGULAR.url : recipe.image}
                    />
                    );}
                )
                }
                </div>}

            
        </div>
    );
};

export default MainPage;