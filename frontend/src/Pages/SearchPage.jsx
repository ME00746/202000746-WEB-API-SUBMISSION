import React, { useState, useEffect } from 'react';

const SearchPage = ({ onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [ingredientSearchQuery, setIngredientSearchQuery] = useState('');
    const [dietarySearchQuery, setDietarySearchQuery] = useState('');
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedDietaryPreference, setSelectedDietaryPreference] = useState([]);
    const [dietaryPreferencesList, setDietaryPreferencesList] = useState([
        'alcohol-cocktail', 'alcohol-free', 'celery-free', 'crustacean-free', 'dairy-free', 'DASH',
        'egg-free', 'fish-free', 'fodmap-free', 'gluten-free', 'immuno-supportive', 'keto-friendly',
        'kidney-friendly', 'kosher', 'low-fat-abs', 'low-potassium', 'low-sugar', 'lupine-free',
        'Mediterranean', 'mollusk-free', 'mustard-free', 'no-oil-added', 'paleo', 'peanut-free',
        'pescatarian', 'pork-free', 'red-meat-free', 'sesame-free', 'shellfish-free', 'soy-free',
        'sugar-conscious', 'sulfite-free', 'tree-nut-free', 'vegan', 'vegetarian', 'wheat-free'
    ]);
    
    const [availableIngredients, setAvailableIngredients] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        try {
            const response = await fetch('https://www.themealdb.com/api/json/v1/1/list.php?i=list');
            const data = await response.json();
            const ingredients = data.meals.map(ingredient => ingredient.strIngredient);
            setAvailableIngredients(ingredients);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const handleIngredientSelect = (ingredient) => {
        setSelectedIngredients([...selectedIngredients, ingredient]);
        setIngredientSearchQuery('');
        setAvailableIngredients(availableIngredients.filter(item => item !== ingredient));
    };

    const handleRemoveIngredient = (ingredient) => {
        setSelectedIngredients(selectedIngredients.filter(item => item !== ingredient));
        setAvailableIngredients([...availableIngredients, ingredient]);
    };

    const handleDietaryPreferenceSelect = (preference) => {
        setSelectedDietaryPreference([...selectedDietaryPreference, preference]);
        setDietarySearchQuery('');
        setDietaryPreferencesList(dietaryPreferencesList.filter(item => item !== preference));
    };

    const handleRemoveDietaryPreference = (preference) => {
        setSelectedDietaryPreference(selectedDietaryPreference.filter(item => item !== preference));
        setDietaryPreferencesList([...dietaryPreferencesList, preference]);
    };

    const removeAllIngredients = () => {
        setAvailableIngredients([...availableIngredients, ...selectedIngredients]);
        setSelectedIngredients([]);
    };

    const removeAllDietaryPreferences = () => {
        setDietaryPreferencesList([...dietaryPreferencesList, ...selectedDietaryPreference]);
        setSelectedDietaryPreference([]);
    };


    const toggleExpand = () => {
        removeAllDietaryPreferences();
        removeAllIngredients();
        setSearchQuery('');
        setIngredientSearchQuery('');
        setDietarySearchQuery('');

        
        setIsExpanded(!isExpanded);
    };

    const handleSearch = () => {
        onSearch(searchQuery, selectedIngredients, selectedDietaryPreference);

    };

    const handleIngredientChange = (e) => {
        setIngredientSearchQuery(e.target.value);
    };

    const handleDietaryPreferenceChange = (e) => {
        setDietarySearchQuery(e.target.value);
    };

    const filteredIngredients = availableIngredients.filter(ingredient =>
        ingredient.toLowerCase().includes(ingredientSearchQuery.toLowerCase())
    );

    const filteredDietaryPreferences = dietaryPreferencesList.filter(preference =>
        preference.toLowerCase().includes(dietarySearchQuery.toLowerCase())
    );

    return (
        <div className="bg-white shadow-lg rounded-lg w-full">
            <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Advanced Recipe Search</h1>
            <div className="p-8 grid gap-8 grid-cols-1 md:grid-cols-2">
                <div>

                    <div>
                        <input
                            type="text"
                            placeholder="Search for cuisine, dish, or recipe"
                            value={searchQuery}
                            disabled={isExpanded}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full p-4 ${isExpanded ? 'bg-gray-200' : ''} text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4`}
                        />
                    </div>
                {isExpanded ?                 
                <button
                        onClick={toggleExpand}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full"
                    >
                        {isExpanded ? 'Search with cuisine' : 'Search with Ingredients & Dietary Preferences'}
                </button> : 
                <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white text-lg py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none transition duration-300 mt-6"
                >
                    Search
                </button>
                }
                
                </div>
                <div>
                    {!isExpanded && (
                        
                        <button
                        onClick={toggleExpand}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 w-full"
                    >
                        {isExpanded ? 'Search with cuisine' : 'Search with Ingredients & Dietary Preferences'}
                </button>
                    )
                    }

                {isExpanded && (
                    <div>
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Select Ingredients</h2>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search ingredients..."
                                    value={ingredientSearchQuery}
                                    onChange={handleIngredientChange}
                                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                                />
                            </div>
                            <div>
                                {ingredientSearchQuery && (
                                    <ul className="bg-gray-200 border border-gray-300 rounded-lg">
                                        {filteredIngredients.slice(0, 6).map((ingredient, index) => (
                                            <li
                                                key={index}
                                                onClick={() => handleIngredientSelect(ingredient)}
                                                className="px-4 py-2 cursor-pointer hover:bg-gray-300"
                                            >
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {selectedIngredients.length > 0 && (
                                <div>
                                    <h2 className="text-md mb-3">Selected Ingredients</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedIngredients.map((ingredient, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleRemoveIngredient(ingredient)}
                                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
                                            >
                                                {ingredient}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold mb-3">Dietary Preferences</h2>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Search dietary preferences..."
                                    value={dietarySearchQuery}
                                    onChange={handleDietaryPreferenceChange}
                                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                                />
                            </div>
                            <div>
                                {dietarySearchQuery && (
                                    <ul className="bg-gray-200 border border-gray-300 rounded-lg">
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
                                {selectedDietaryPreference.length > 0 && (
                                    <div>
                                        <h2 className="text-md mb-3">Selected Dietary Preferences</h2>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDietaryPreference.map((preference, index) => (
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
                            </div>
                        </div>
                        <button
                    onClick={handleSearch}
                    className="w-full bg-blue-600 text-white text-lg py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 focus:outline-none transition duration-300 mt-6"
                >
                    Search
                </button>
                    </div>
                    
                )}
            </div>
            </div>
        </div>
    );
};

export default SearchPage;
