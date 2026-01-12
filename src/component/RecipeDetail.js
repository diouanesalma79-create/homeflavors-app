import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import recipesData from '../data/recipes.json';
import './RecipeDetail.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find recipe by ID
    const foundRecipe = recipesData.find(r => r.id === parseInt(id));
    if (foundRecipe) {
      setRecipe(foundRecipe);
    }
    setLoading(false);
  }, [id]);

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
                <button className="watch-video-btn">Watch Video Tutorial</button>
                <button className="save-recipe-btn">Save Recipe</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;