import React from 'react';
import { useNavigate } from 'react-router-dom';

const RecipeCard = ({ id, title, description, rating, ingredients, imageUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log(id);
    if (!id) return;
    if (!id.startsWith('http://www.edamam.com/ontologies/edamam.owl#')){
      navigate(`/view/${id}`);
      return;
    }
    let newId = id.replace('http://www.edamam.com/ontologies/edamam.owl#', '');
    navigate(`/view/${newId}`);
  };

  return (
    <div
      className="w-300 bg-white shadow-xl rounded-lg overflow-hidden mx-auto cursor-pointer"
      onClick={handleCardClick}
      onMouseOver={(e) => e.currentTarget.classList.add('shadow-2xl')}
      onMouseOut={(e) => e.currentTarget.classList.remove('shadow-2xl')}
      style={{ transition: 'box-shadow 0.3s' }}
    >
      <div className="h-64 overflow-hidden">
        <img src={imageUrl} alt="Recipe" className="w-300 h-150 object-cover object-center" />
      </div>
      <div className="p-6 flex flex-col justify-between">
        <div className="max-w-[250px] text-center">
          <h3 className="font-semibold text-gray-800 max-w-full overflow-hidden overflow-ellipsis">
              {title.charAt(0).toUpperCase() + title.slice(1)}
          </h3>
        </div>
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-2xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                &#9733;
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
