import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/ChefRecipes.css';

const MyRecipes = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'chef') {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    // Get user's recipes from their data
    setRecipes(currentUser.recipes || []);
    setLoading(false);
  }, [navigate]);

  const handleAddRecipe = () => {
    navigate('/dashboard/chef/recettes/nouvelle');
  };

  const handleEditRecipe = (recipeId) => {
    navigate(`/dashboard/chef/recettes/edit/${recipeId}`);
  };

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      // Remove recipe from user's recipe list
      const updatedUser = UserService.updateUserData(user.id, {
        recipes: user.recipes.filter(recipe => recipe.id !== recipeId)
      });
      
      // Update local state
      setUser(updatedUser);
      setRecipes(updatedUser.recipes || []);
    }
  };

  if (loading) {
    return (
      <div className="chef-recipes-container">
        <div className="loading">Loading recipes...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="chef-recipes-container">
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <div className="chef-recipes-container">
      <div className="recipes-header">
        <h2>My Recipes</h2>
        <button className="add-recipe-btn" onClick={handleAddRecipe}>
          + Add Recipe
        </button>
      </div>

      {recipes.length === 0 ? (
        <div className="empty-state">
          <p>You haven't published any recipes yet.</p>
          <button className="add-first-recipe-btn" onClick={handleAddRecipe}>
            Add Your First Recipe
          </button>
        </div>
      ) : (
        <div className="recipes-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <img src={recipe.image || '/placeholder-recipe.jpg'} alt={recipe.title} className="recipe-image" />
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
                <div className="recipe-meta">
                  <span className="prep-time">⏱️ {recipe.prepTime} mins</span>
                  <span className="difficulty">🎯 {recipe.difficulty}</span>
                  <span className="servings">👥 Serves {recipe.servings}</span>
                </div>
                <div className="recipe-stats">
                  <span className="likes">❤️ {recipe.likes || 0}</span>
                  <span className="views">👁️ {recipe.views || 0}</span>
                </div>
              </div>
              <div className="recipe-actions">
                <button 
                  className="edit-btn" 
                  onClick={() => handleEditRecipe(recipe.id)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn" 
                  onClick={() => handleDeleteRecipe(recipe.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRecipes;