import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import recipesData from '../data/recipes.json';
import backgroundImage from '../assets/logo/background2.png';
import '../style/RecipeExploration.css';

const RECIPES_PER_PAGE = 6;

const RecipeExploration = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState('all');
  const [currentPage, setCurrentPage] = useState(0);

  // Pagination indexes
  const startIndex = currentPage * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const visibleRecipes = filteredRecipes.slice(startIndex, endIndex);

  // Reset page when filter/search changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, selectedContinent]);

  // Continents
  const continents = [
    { id: 'all', name: 'All recipes' },
    { id: 'Africa', name: 'Africa' },
    { id: 'Asia', name: 'Asia' },
    { id: 'Europe', name: 'Europe' },
    { id: 'NorthAmerica', name: 'North America' },
    { id: 'SouthAmerica', name: 'South America' }
  ];

  // Load recipes
  useEffect(() => {
    setRecipes(recipesData);
    setFilteredRecipes(recipesData);
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = [...recipes];

    // Filter by continent
    if (selectedContinent !== 'all') {
      results = results.filter(
        recipe => recipe.continent === selectedContinent
      );
    }

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      results = results.filter(recipe =>
        recipe.title.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        recipe.ingredients.some(ingredient =>
          ingredient.toLowerCase().includes(term)
        )
      );
    }

    setFilteredRecipes(results);
  }, [searchTerm, selectedContinent, recipes]);

  return (
    <div
      className="recipe-exploration"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="exploration-header">
        <h1 className="exploration-title">
          Explore the Recipe Catalog
        </h1>

        <form className="search-container">
          <input
            type="text"
            placeholder="Search by ingredient or recipe name..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="button" className="search-button">
            Search
          </button>
        </form>
      </div>

      {/* Continent Filters */}
      <div className="categories-section">
        <div className="category-buttons">
          {continents.map(continent => (
            <button
              key={continent.id}
              className={`category-btn ${
                selectedContinent === continent.id ? 'active' : ''
              }`}
              onClick={() => setSelectedContinent(continent.id)}
            >
              {continent.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="recipes-grid">
        {visibleRecipes.map(recipe => (
          <div className="recipe-card" key={recipe.id}>
            <div className="recipe-image-container">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipe-image"
              />
            </div>

            <div className="recipe-content">
              <h3 className="recipe-title">{recipe.title}</h3>
              <p className="recipe-description">
                {recipe.description}
              </p>

              <div className="card-buttons">
                <Link
                  to={`/recipe/${recipe.id}`}
                  className="show-more-btn"
                >
                  <button>Show More</button>
                </Link>
              </div>
            </div>
          </div>
        ))}

              {/* PREVIOUS CARD */}
        {currentPage > 0 && (
          <div
            className="recipe-card voir-plus-card previous-card"
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            <div className="voir-plus-content">
              <span className="arrow">←</span>
              <h3>Previous</h3>
              <p>Go back</p>
            </div>
          </div>
        )}

        {/* NEXT CARD */}
        {endIndex < filteredRecipes.length && (
          <div
            className="recipe-card voir-plus-card next-card"
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            <div className="voir-plus-content">
              <span className="arrow">→</span>
              <h3>View more </h3>
              <p>Discover more recipes</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default RecipeExploration;
