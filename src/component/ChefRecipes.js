import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../style/ChefRecipes.css';
import recipesData from '../data/enhancedRecipes.json';
import chefsData from '../data/chefsData';
// import { getUserLocation, canOrderRecipe } from '../utils/locationUtils';
import ChefOrderModal from './ChefOrderModal';

const ChefRecipes = () => {
  const { chefId } = useParams();
  const [chefRecipes, setChefRecipes] = useState([]);
  const [currentChef, setCurrentChef] = useState(null);
  // const [userLocation, setUserLocation] = useState(''); // This would typically come from user settings/location detection
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Simulate getting user location (in a real app, this would be from geolocation API or user settings)
  // useEffect(() => {
  //   // For demo purposes, we'll set a default location
  //   // In a real app, you'd detect the user's location or get it from user preferences
  //   setUserLocation('United States'); // Set to a location that doesn't match any chef's country to show "Order (Local Only)" for all
  // }, []);

  const handleOrderClick = (recipe) => {
    setSelectedRecipe(recipe);
    setIsOrderModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalOpen(false);
    setSelectedRecipe(null);
  };

  // Get chef data
  useEffect(() => {
    const chefData = chefsData.find(chef => chef.id === parseInt(chefId));
    setCurrentChef(chefData);

      // Filter recipes based on the chef's ID
    const filteredRecipes = recipesData.filter(recipe => recipe.chefId === parseInt(chefId));
    
    // Set the chef recipes
    setChefRecipes(filteredRecipes);
  }, [chefId]);



  if (!currentChef) {
    return <div>Loading...</div>;
  }

  return (
    <div className="chef-recipes-page">
      {/* Chef Header Section */}
      <section className="chef-header">
        <div className="chef-profile">
          <img src={currentChef.image} alt={currentChef.name} className="chef-avatar" />
          <div className="chef-details">
            <h1>{currentChef.name}</h1>
            <p className="chef-country">From {currentChef.country}</p>
            <p className="chef-description">{currentChef.description}</p>
            <p className="chef-recipe-count">{currentChef.recipesCount} recipes</p>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="chef-recipes-section">
        <div className="section-container">
          <h2 className="section-title">Recipes by {currentChef.name.split(' ')[0]}</h2>
          {chefRecipes.length > 0 ? (
            <div className="recipes-grid">
              {chefRecipes.map(recipe => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-image-container">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                  </div>
                  <div className="recipe-info">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                    <div className="recipe-actions">
                      <button 
                        className="chef-order-btn"
                        onClick={() => handleOrderClick(recipe)}
                      >
                        Order (Local Only)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-recipes">No recipes available from this chef yet.</p>
          )}
        </div>
      </section>
      
      <ChefOrderModal 
        isOpen={isOrderModalOpen}
        onClose={handleCloseModal}
        dish={selectedRecipe}
      />
    </div>
  );
};

export default ChefRecipes;