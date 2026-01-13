import React from "react";
import { Link } from 'react-router-dom';
import "../style/Accueil.css";
import foodBg from "../assets/logo/Food-Wallpaper.jpg";

const Accueil = () => {
  const featuredRecipes = [
    { 
      id: 1, 
      title: "Pad Thai", 
      image: "/images/Pad Thai.jpg",
      hasVideo: true
    },
    { 
      id: 2, 
      title: "Moussaka", 
      image: "/images/Moussaka.jpg",
      hasVideo: false
    },
    { 
      id: 3, 
      title: "Jollof Rice", 
      image: "/images/Jollof Rice.jpg",
      hasVideo: false
    },
  ];

  return (
    <div className="accueil">
      {/* Hero Section */}
      <div
  className="hero-section"
  style={{ backgroundImage: `url(${foodBg})` }}>
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
          
          <div className="recipes-grid">
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
                </div>
              </div>
            ))}
          </div>

                    <div className="view-all-container">
            <Link to="/recipes" className="view-all-btn">Voir toutes les recettes</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
