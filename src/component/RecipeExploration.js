import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipesData from '../data/recipes.json';
import backgroundImage from '../assets/logo/background2.png';
import '../style/RecipeExploration.css';

const RecipeExploration = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  

  

  
  // Categories with proper names
  const categories = [
    { id: 'all', name: 'All Recipes' },
    { id: 'morocco', name: 'Morocco' },
    { id: 'asia', name: 'Asia' },
    { id: 'italy', name: 'Italy' },
    { id: 'west', name: 'West' },
    { id: 'mexico', name: 'Mexico' },
    { id: 'india', name: 'India' },
    { id: 'france', name: 'France' },
    { id: 'china', name: 'China' },
  ];
  
  useEffect(() => {
    // Simulate loading recipes from JSON file
    setRecipes(recipesData);
    setFilteredRecipes(recipesData);
  }, []);
  
  // Filter recipes based on search term and category
  useEffect(() => {
    let results = recipes;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(recipe => recipe.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(recipe => 
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(term))
      );
    }
    
    setFilteredRecipes(results);
  }, [searchTerm, selectedCategory, recipes]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled by useEffect
  };
  
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Search is handled by useEffect
    }
  };
  

  


  return (
    <div className="recipe-exploration" style={{ backgroundColor: 'transparent', backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundAttachment: 'fixed' }}>
      <div className="exploration-header">
        <h1 className="exploration-title">Explore the Recipe Catalog</h1>
        
        <form className="search-container" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search by ingredient or cuisine..." 
            className="search-bar"
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyPress={handleKeyPress}
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>

      <div className="categories-section">
        <div className="category-buttons">
          {categories.map(category => (
            <button 
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''} ${category.id}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map(recipe => (
          <Link to={`/recipe/${recipe.id}`} className="recipe-card-link" key={recipe.id}>
            <div className="recipe-card">
              <div className="recipe-image-container">
                <img src={recipe.image} alt={recipe.title} className="recipe-image" />
              </div>
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>

                <div className="card-buttons">
                  <Link to={`/recipe/${recipe.id}`} className="show-more-btn">Show More</Link>
                  <button className="watch-video-btn">Watch Video Tutorial</button>
                </div>
              </div>
            </div>
          </Link>
        ))}
        
        {filteredRecipes.length === 0 && (
          <div className="no-results">
            <h3>No recipes found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeExploration;