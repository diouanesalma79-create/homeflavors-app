import React, { useState } from "react";
import "../style/Accueil.css";
import foodBg from "../assets/logo/Food-Wallpaper.jpg";
import CremeCatalana from "../assets/food/Crema_Catalana_spain.jpg";
import Empanadas from "../assets/food/Empanadas.jpg";
import FrenchMilleFeuille from "../assets/food/French_Mille_Feuille.jpg";
import Guacamole from "../assets/food/Guacamole.jpg";
import HummusZaatar from "../assets/food/hummus_with_zaatar.jpg";
import Paella from "../assets/food/paella_dish.jpg";
import ChickenPastilla from "../assets/food/pastilla.jpg";
import Rfissa from "../assets/food/Rifissa marocain.jpg";
import tajineEggTomato from "../assets/food/tajine_egg_tomato.jpg";
import Taktouka from "../assets/food/taktouka.jpg";
import WarakEnab from "../assets/food/warak_ainab.jpg";

const Accueil = () => {
  // Mood-based filter options
  const moodFilters = [
    { id: 'quick', name: 'Quick & Easy' },
    { id: 'moroccan', name: 'Moroccan Comfort' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'impressive', name: 'Impressive Dishes' },
    { id: 'global', name: 'Global Flavors' },
  ];
  
  // State for selected filter
  const [selectedFilter, setSelectedFilter] = useState('quick');
  
  const featuredRecipes = [
    { id: 1, title: "Pad Thai", image: "/images/Pad Thai.jpg", description: "Pad Thai is a popular Thai dish..." },
    { id: 2, title: "Moussaka", image: "/images/Moussaka.jpg", description: "Moussaka is a classic Mediterranean casserole..." },
    { id: 3, title: "Jollof Rice", image: "/images/Jollof Rice.jpg", description: "Jollof Rice is a popular West African dish..." },
    { id: 4, title: "Crème Catalana", image: CremeCatalana, description: "Crème Catalana is a traditional Spanish dessert..." },
    { id: 5, title: "Empanadas", image: Empanadas, description: "Empanadas are savory pastries filled with meat..." },
    { id: 6, title: "French Mille-Feuille", image: FrenchMilleFeuille, description: "French Mille-Feuille is a classic pastry..." },
    { id: 7, title: "Guacamole", image: Guacamole, description: "Guacamole is a Mexican dip made from avocados..." },
    { id: 8, title: "Hummus with Zaatar", image: HummusZaatar, description: "Hummus with Zaatar is a creamy chickpea spread..." },
    { id: 9, title: "Paella", image: Paella, description: "Paella is a famous Spanish rice dish..." },
    { id: 10, title: "Chicken Pastilla", image: ChickenPastilla, description: "Chicken Pastilla is a Moroccan pie..." },
    { id: 11, title: "Rfissa", image: Rfissa, description: "Rfissa is a traditional Moroccan dish..." },
    { id: 12, title: "Tajine Eggs and Tomato", image: tajineEggTomato, description: "Tajine with eggs and tomato is a comforting dish..." },
    { id: 13, title: "Taktouka", image: Taktouka, description: "Taktouka is a Moroccan warm salad..." },
    { id: 14, title: "Warak Enab", image: WarakEnab, description: "Warak Enab are grape leaves stuffed with rice..." },
  ];
  
  // Sample recipe data with labels
  const recipeData = [
    { id: 1, title: "Tajine aux légumes", image: tajineEggTomato, label: "Vegetarian, 30 mins" },
    { id: 2, title: "Hummus with Zaatar", image: HummusZaatar, label: "Vegetarian, 15 mins" },
    { id: 3, title: "Crème Catalana", image: CremeCatalana, label: "Dessert, 45 mins" },
    { id: 4, title: "Paella", image: Paella, label: "Spanish, 60 mins" },
    { id: 5, title: "Guacamole", image: Guacamole, label: "Mexican, 10 mins" },
    { id: 6, title: "Empanadas", image: Empanadas, label: "Argentine, 40 mins" },
    { id: 7, title: "Rfissa", image: Rfissa, label: "Moroccan, 90 mins" },
    { id: 8, title: "Warak Enab", image: WarakEnab, label: "Levantine, 75 mins" },
  ];
  
  // Filter recipes based on selected mood
  const filteredRecipes = recipeData.filter(recipe => {
    if (selectedFilter === 'quick') return ['10 mins', '15 mins'].some(time => recipe.label.includes(time));
    if (selectedFilter === 'moroccan') return ['Moroccan', 'Tajine', 'Rfissa', 'Warak'].some(tag => recipe.title.includes(tag) || recipe.label.includes(tag));
    if (selectedFilter === 'vegetarian') return recipe.label.includes('Vegetarian');
    if (selectedFilter === 'impressive') return ['Dessert', '60 mins', '90 mins'].some(tag => recipe.label.includes(tag));
    if (selectedFilter === 'global') return true; // Show all for global
    return true;
  }).slice(0, 6); // Limit to 6 recipes

  return (
    <div className="accueil">
      {/* Hero Section */}
      <div className="hero-section" style={{ backgroundImage: `url(${foodBg})` }}>
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Partagez et découvrez des</h1>
            <h2 className="hero-subtitle">saveurs authentiques.</h2>
            <p className="hero-tagline">Votre pont culturel gustatif.</p>
          </div>
        </div>
      </div>

      {/* Popular Recipes Section */}
      <section className="popular-recipes-section">
        <div className="container">
          <h2 className="section-title">Recettes populaires du monde</h2>

          <div className="recipes-scroll">
            <div className="recipes-grid-horizontal">
              {featuredRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                  <div className="recipe-image-container">
                    <img src={recipe.image} alt={recipe.title} className="recipe-image" />
                  </div>
                  <div className="recipe-info">
                    <h3 className="recipe-title">{recipe.title}</h3>
                    <p className="recipe-description">{recipe.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recommendations based on your mood */}
      <section className="mood-recommendations-section">
        <div className="container">
          <h2 className="section-title">Recommendations based on your mood</h2>
          
          {/* Filter Chips */}
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
          
          {/* Recommendations Grid */}
          <div className="recommendations-grid">
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
                  <p className="recipe-label">{recipe.label}</p>
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