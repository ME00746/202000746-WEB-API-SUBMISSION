
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ViewRecipe = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [usersRated, setUsersRated] = useState([]);
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [newId, setNewId] = useState('');

  useEffect(() => {
    if (!id) return;
    if (!id.startsWith('recipe')) {
      setNewId(id);
    } else {
      setNewId('http://www.edamam.com/ontologies/edamam.owl#' + id);
    }
  }, [id]);

  useEffect(() => {
    if (!newId) return;

    const fetchData = async () => {
      try {
        const recipeResponse = await axios.post('http://localhost:5000/api/getRecipeByUri', { uri: newId });
        setRecipe(recipeResponse.data);
        setIsLoading(false);

        const reviewsResponse = await axios.post('http://localhost:5000/api/reviews/recipeId/', { recipeId: newId });
        setReviews(reviewsResponse.data.reviews);
        setLoadingReviews(false);

        const ratingResponse = await axios.post('http://localhost:5000/api/calculateRating/', { recipeId: newId });
        setRating(ratingResponse.data.rating);
        setUserRating(ratingResponse.data.users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [newId]);

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const review = e.target.review.value;

    const headers = {
      Authorization: localStorage.getItem('token')
    };

    axios.post('http://localhost:5000/api/review', { recipeId: newId, text: review }, { headers })
      .then((response) => {
        setReviews([...reviews, response.data]);
        window.location.reload();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleRatingSubmit = () => {
    const ratingsub = userRating;

    const headers = {
      Authorization: localStorage.getItem('token')
    };

    axios.post('http://localhost:5000/api/rating', { recipeId: newId, rating: ratingsub }, { headers })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const openReviewModal = () => {
    setShowReviewModal(true);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const openRatingModal = () => {
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
  };

  return (
    isLoading ? (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader"></div>
      </div>
    ) : (
      <div className="flex flex-col justify-center items-center min-h-screen p-8 w-full">
        <div className="text-center w-full">
        <div className="w-full flex flex-col md:flex-row">
                <div className="md:flex-shrink-0 w-full md:w-1/2">
                    <img src={recipe.image} alt="Recipe" className="w-full h-full rounded-xl border-4 border-500 shadow-xl" style={{ 
                        maxHeight: '450px',
                        objectFit: 'fill'
                    }} />
                    </div>
                <div className="p-4 md:p-6 w-full md:w-1/2">
                    <div style={{
                        paddingBottom: '2%',
                    }}>

                      <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-2 capitalize">{recipe.label}</h1>

                    <h2 className="text-md text-gray-900 mb-4">By {recipe.source}</h2>
                    <div>

                        <div className="flex items-center justify-center">
                            {[...Array(5)].map((_, i) => (
                            <svg
                                key={i}
                                className={`h-6 w-6 ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M12 2l2.241 6.511H22l-5.889 4.527L18.482 22 12 17.657 5.518 22l2.728-8.962L2 8.511h7.759L12 2z" />
                            </svg>
                            ))}
                            <span className="text-gray-600 ml-2">({rating})</span>
                        </div>
                        </div>
                    </div>

                    
                    <div className="flex items-center">
                        <hr className="flex-grow border-t-2 border-gray-300 mr-4" />
                        <h3 className=" font-semibold mb-4">Preparation Time</h3>
                        <hr className="flex-grow border-t-2 border-gray-300 ml-4" />
                        </div>
                    <p className="text-gray-600">{recipe.totalTime} minutes</p>

                    <div className="mt-4">
                    <div className="flex items-center">
                        <hr className="flex-grow border-t-2 border-gray-300 mr-4" />
                        <h3 className=" font-semibold mb-4">Health Benefits</h3>
                        <hr className="flex-grow border-t-2 border-gray-300 ml-4" />
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {recipe.healthLabels.map((label, index) => (
                        <div key={index} className="flex items-center mt-1">
                        <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-green-500">{index + 1}</span>
                        </span>
                        <span className="text-gray-600">{label}</span>
                        </div>
                    ))}
                    </div>
                    </div>
                </div>
                </div>



          <div className="ingredients-container mb-8"style={{
            paddingTop: '2%',
          }}>
            <div className="flex justify-center items-center gap-8" style={{
              paddingBottom: '2%',
            
            }}>
              <button onClick={openReviewModal} className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">Add Review</button>
              {usersRated.includes(localStorage.getItem('id')) ? 
              <p className="text-green-500">You have already rated this recipe</p> 
              :
              <button onClick={openRatingModal} className="bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 focus:outline-none transition duration-300">Add Rating</button>
            }
            </div>


            <div className="flex items-center">
                <hr className="flex-grow border-t-2 border-gray-300 mr-4" />
                <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                <hr className="flex-grow border-t-2 border-gray-300 ml-4" />
              </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              {recipe.ingredientLines.map((ingredient, index) => (
                <span key={index} className="text-lg p-2 bg-gray-100 rounded-lg shadow">{ingredient}</span>
              ))}
            </div>
          </div>
          <div className="nutrition-info grid grid-cols-4 gap-4 text-center max-w-4xl mx-auto p-4">
            <div className="info-block">
              <h2 className="text-2xl font-semibold">Calories</h2>
              <p className="text-xl">{Math.round(recipe.calories)}</p>
            </div>
            <div className="info-block">
              <h2 className="text-2xl font-semibold">Fat</h2>
              <p className="text-xl">{Math.round(recipe.totalNutrients.FAT.quantity)}g</p>
            </div>
            <div className="info-block">
              <h2 className="text-2xl font-semibold">Carbs</h2>
              <p className="text-xl">{Math.round(recipe.totalNutrients.CHOCDF.quantity)}g</p>
            </div>
            <div className="info-block">
              <h2 className="text-2xl font-semibold">Protein</h2>
              <p className="text-xl">{Math.round(recipe.totalNutrients.PROCNT.quantity)}g</p>
            </div>
          </div>
            <div className="reviews-container">
                <div className="flex items-center">
                <hr className="flex-grow border-t-2 border-gray-300 mr-4" />
                <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
                <hr className="flex-grow border-t-2 border-gray-300 ml-4" />
                </div>

                {loadingReviews ? 
                <p className="text-gray-600">Loading reviews...</p>:
                <>
                 {reviews.length === 0 && <p className="text-gray-600">No reviews yet</p>}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                {reviews.map((review, index) => (
                    <div key={index} className="review-card p-4 bg-gray-100 rounded-lg shadow">
                    <h3 className="text-xl font-semibold">{review.username}</h3>
                    <p className="text-gray-600">{review.text}</p>
                    </div>
                ))}
                </div>
                </>
                }

                
            </div>
        </div>
        {showReviewModal && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Add a Review</h2>
              <form onSubmit={handleReviewSubmit} className="flex flex-col gap-4">
                <textarea name="review" placeholder="Review" className="p-2 border-2 border-gray-300 rounded-lg"></textarea>
                <button type="submit" className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none">Submit</button>
                <button onClick={closeReviewModal} className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none">Cancel</button>
              </form>
            </div>
          </div>
        )}

        {showRatingModal && (
          <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Add a Rating</h2>
          <form onSubmit={handleRatingSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${star <= userRating ? 'text-yellow-500' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  onClick={() => setUserRating(star)}
                >
                  <path
                    fillRule="evenodd"
                    d="M10 1l2.76 5.65 6.22.9-4.51 4.395 1.065 6.185-5.55-2.92L5.25 18.13l1.065-6.185L1 7.55l6.22-.9L10 1z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 focus:outline-none">Submit</button>
            <button onClick={closeRatingModal} className="bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 focus:outline-none">Cancel</button>
          </form>
        </div>

          </div>
        )}

      </div>
    )
  );
 
  
};
export default ViewRecipe;
