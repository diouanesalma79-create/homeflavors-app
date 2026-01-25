import React, { useState, useRef, useEffect } from "react";
import "../style/Accueil.css";
import foodBg from "../assets/logo/Food-Wallpaper.jpg";
import recipesData from "../data/recipes.json";
import enhancedRecipesData from "../data/enhancedRecipes.json";

const Accueil = () => {
  // Mood-based filter options
   const [selectedFilter, setSelectedFilter] = useState("quick");

  // Définition des filtres
  const moodFilters = [
    { id: "quick", name: "Quick & Easy" },
    { id: "healthy", name: "Healthy" },
    { id: "top", name: "Top Commanded" },
  ];
 
  const featuredRecipes = recipesData.slice(0, 6);
  
  // Sample recipe data with labels - using actual data from project
  const recipeData = enhancedRecipesData.slice(0, 8).map((recipe) => ({
    ...recipe,
    label: `${recipe.country}, ${recipe.ingredients.length} ingredients`,
  }));
  
  // Filter recipes based on selected mood
   const filteredRecipes = recipeData.filter((recipe) => {
    if (selectedFilter === "quick") {
      return recipe.ingredients.length <= 6;
    }
    if (selectedFilter === "healthy") {
      const vegKeywords = [
        "tomatoes",
        "lettuce",
        "zucchini",
        "eggplant",
        "bean sprouts",
        "onions",
        "peppers",
        "cabbage",
        "cilantro",
      ];
      return recipe.ingredients.some((ing) =>
        vegKeywords.includes(ing.toLowerCase())
      );
    }
    if (selectedFilter === "top") {
      const topIds = [1, 2, 4, 5]; // ids des recettes les plus commandées
      return topIds.includes(recipe.id);
    }
    return true;
  }); // Limit to 6 recipes
  
  // Auto-scroll functionality for popular recipes section
  const popularRecipesRef = useRef(null);
  const scrollInterval = useRef(null);
  const isHovered = useRef(false);

  // Function to handle mouse enter event
  const handlePopularRecipesMouseEnter = () => {
    isHovered.current = true;
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
      scrollInterval.current = null;
    }
  };

  // Function to handle mouse leave event
  const handlePopularRecipesMouseLeave = () => {
    isHovered.current = false;
    startAutoScroll();
  };

  // Function to start auto-scroll
  const startAutoScroll = () => {
    // Clear any existing interval
    if (scrollInterval.current) {
      clearInterval(scrollInterval.current);
    }

    // Set a timeout before starting the scroll (2 second delay as requested)
    setTimeout(() => {
      if (!isHovered.current) { // Only start if not hovered
        scrollInterval.current = setInterval(() => {
          const container = popularRecipesRef.current;
          if (container && !isHovered.current) {
            // Scroll by a small amount for smooth animation
            const scrollAmount = 1; // Adjust this value to control scroll speed
            
            // Check if we've reached the halfway point of the duplicated content
            // This creates a seamless infinite scroll effect
            if (container.scrollLeft >= container.scrollWidth / 2) {
              // Reset to beginning for infinite loop
              // Using scrollTop to avoid triggering scroll events that might interfere
              container.scrollLeft = 0;
            } else {
              // Continue scrolling
              container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
              });
            }
          }
        }, 20); // Adjust this value for scroll frequency (lower = faster)
      }
    }, 2000); // 2 second delay before starting scroll
    
  };

  // Initialize auto-scroll when component mounts
  useEffect(() => {
    // Wait for the component to render before starting auto-scroll
    const initTimer = setTimeout(() => {
      startAutoScroll();
    }, 100);

    // Cleanup on unmount
    return () => {
      clearTimeout(initTimer);
      if (scrollInterval.current) {
        clearInterval(scrollInterval.current);
      }
    };
  }, []);

  return (
    <div className="accueil">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${foodBg})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">HomeFlavors</h1><br></br>
            <h1 className="hero-title">From the heart of taste  Share with grace.</h1>
          </div>
        </div>
      </div>

 {/* Popular Recipes Section */}
<section className="popular-recipes-section">

 {/* Titre centré */}
 <div className="container">
   <h2 className="section-title">Popular Recipes</h2>
 </div>

      {/* Cards en full width */}
      <div 
        ref={popularRecipesRef}
        className="popular-recipes-scroll recipes-scroll full-width-scroll"
        onMouseEnter={handlePopularRecipesMouseEnter}
        onMouseLeave={handlePopularRecipesMouseLeave}
      >
        <div className="recipes-grid-horizontal">
          {featuredRecipes.map((recipe) => (
            <div key={recipe.id} className="recipe-card">
              <div className="recipe-image-container">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="recipe-image"
                />
              </div>
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
              </div>
            </div>
          ))}
          {/* Duplicate recipes to create seamless infinite scroll effect */}
          {featuredRecipes.map((recipe) => (
            <div key={`duplicate-${recipe.id}`} className="recipe-card duplicate-card" aria-hidden="true">
              <div className="recipe-image-container">
                <img
                  src={recipe.image}
                  alt={`${recipe.title} duplicate`}  // Using aria-hidden so screen readers don't read duplicate content
                  className="recipe-image"
                />
              </div>
              <div className="recipe-info">
                <h3 className="recipe-title">{recipe.title}</h3>
                <p className="recipe-description">{recipe.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </section>
              {/* Recommendations based on your mood */}
      <section className="mood-recommendations-section">

        {/* Titre + filtres centrés */}
        <div className="container">
          <h2 className="section-title">Recommendations based on your mood</h2>

          <div className="filter-chips-container">
            {moodFilters.map((filter) => (
              <button
                key={filter.id}
                className={`filter-chip ${selectedFilter === filter.id ? 'active' : ''}`}
                onClick={() => setSelectedFilter(filter.id)}
                aria-pressed={selectedFilter === filter.id}
              >
                {filter.name}
              </button>
            ))}
          </div>
        </div>

        {/* Cards en full width */}
        <div className="recommendations-scroll full-width-scroll">
          <div className="recommendations-grid-horizontal">
            {filteredRecipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className="mood-recipe-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="recipe-image-container">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="recipe-image"
                    loading="lazy"
                  />
                </div>
                <div className="recipe-info">
                  <h3 className="recipe-title">{recipe.title}</h3>
                  {/* You can remove recipe.label if you don't have it */}
                  {recipe.label && <p className="recipe-label">{recipe.label}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>


    </div>
  );
};

export default Accueil;