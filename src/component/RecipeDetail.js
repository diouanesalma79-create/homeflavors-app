import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import recipesData from '../data/recipes.json';
import { canOrderRecipe } from '../utils/locationUtils';
import UserService from '../services/UserService';
import '../style/RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [userLocation, setUserLocation] = useState(''); // This would typically come from user settings/location detection

  useEffect(() => {
    // Find recipe by ID
    const foundRecipe = recipesData.find(r => r.id === parseInt(id));
    if (foundRecipe) {
      setRecipe(foundRecipe);
    }
    setLoading(false);
    
    // Simulate getting user location (in a real app, this would be from geolocation API or user settings)
    // For demo purposes, we'll set a default location
    setUserLocation('Spain'); // Change this to simulate different locations
    
    // Check if recipe is already saved
    const currentUser = UserService.getCurrentUser();
    if (currentUser && currentUser.savedRecipes) {
      const saved = currentUser.savedRecipes.some(r => r.id == id);
      setIsSaved(saved);
    }
  }, [id]);

  // Function to handle saving recipe
  const handleSaveRecipe = () => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      alert('Please log in to save recipes');
      return;
    }

    if (recipe) {
      // Save the recipe
      UserService.saveRecipeForUser(currentUser.id, recipe);
      
      // Update local state
      setIsSaved(true);
      setSaveMessage('✅ Recette enregistrée');
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  };

  const handleOrderClick = (recipe) => {
    if (canOrderRecipe(userLocation, recipe.country)) {
      alert(`Order placed for ${recipe.title}!`);
    } else {
      alert(`Sorry, this recipe is only available in ${recipe.country}.`);
    }
  };

  if (loading) {
    return <div className="recipe-detail-loading">Loading...</div>;
  }

  if (!recipe) {
    return (
      <div className="recipe-detail-error">
        <h2>Recipe not found</h2>
        <Link to="/recipes" className="back-to-recipes-link">Back to Recipes</Link>
      </div>
    );
  }

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-container">
        <Link to="/recipes" className="back-to-recipes-link">← Back to Recipes</Link>
        
        <div className="recipe-content-wrapper">
          <div className="recipe-image-section">
            <img src={recipe.image} alt={recipe.title} className="recipe-main-image" />
          </div>
          
          <div className="recipe-info-section">
            <h1 className="recipe-title">{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>
            
            <div className="recipe-details">
              <div className="ingredients-section">
                <h3>Ingredients</h3>
                <ul className="ingredients-list">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                      {ingredient}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="actions-section">
                {recipe.chefId && (
                  <div className="chef-info">
                    <p>By <Link to={`/chef/${recipe.chefId}`}>{recipe.chefName}</Link></p>
                    <p className="recipe-region">Region: {recipe.country}</p>
                  </div>
                )}
                <button className="watch-video-btn">Watch Video Tutorial</button>
                <button 
                  className={`save-recipe-btn ${isSaved ? 'saved' : ''}`}
                  onClick={handleSaveRecipe}
                  disabled={isSaved}
                >
                  {isSaved ? 'Recipe Saved' : 'Save Recipe'}
                </button>
                {saveMessage && <div className="save-message">{saveMessage}</div>}
                {recipe.chefId && (
                  <button 
                    className={`order-btn ${canOrderRecipe(recipe.country) ? 'active' : 'disabled'}`}
                    onClick={() => handleOrderClick(recipe)}
                    disabled={!canOrderRecipe(recipe.country)}
                    title={canOrderRecipe(recipe.country) ? '' : `This recipe is only available in ${recipe.country}`}
                  >
                    Order Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;