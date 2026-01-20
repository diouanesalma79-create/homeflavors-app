import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../style/ChefRecipes.css';
import recipesData from '../data/enhancedRecipes.json';
import chefsData from '../data/chefsData';
import '../style/Order.css';

const ChefRecipes = () => {
  const { chefId } = useParams();
  const navigate = useNavigate();
  const [chefRecipes, setChefRecipes] = useState([]);
  const [currentChef, setCurrentChef] = useState(null);
  const [activeRecipe, setActiveRecipe] = useState(null); // For popup
  const [userLocation, setUserLocation] = useState('');

  // Simulate getting user location
  useEffect(() => {
    setUserLocation('United States'); 
  }, []);

  // Get chef and recipes
  useEffect(() => {
    const chefData = chefsData.find(chef => chef.id === parseInt(chefId));
    setCurrentChef(chefData);

    const filteredRecipes = recipesData.filter(recipe => recipe.chefId === parseInt(chefId));
    setChefRecipes(filteredRecipes);
  }, [chefId]);

  if (!currentChef) return <div>Loading...</div>;

  const openPopup = (recipe) => setActiveRecipe(recipe);
  const closePopup = () => setActiveRecipe(null);

  return (
    <div className="chef-recipes-page">
      {/* Chef Header */}
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
                      <button className="order-btn active" onClick={() => navigate(`/Order/${recipe.id}`)}>
                        Order
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
    </div>
  );
};

export default ChefRecipes;
