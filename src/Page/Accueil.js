import React from "react";
import "../style/Accueil.css";

const Accueil = () => {
  const featuredRecipes = [
    { 
      id: 1, 
      title: "Pad Thai", 
      image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600",
      hasVideo: true
    },
    { 
      id: 2, 
      title: "Moussaka", 
      image: "https://images.unsplash.com/photo-1621159891001-db7ffba39ccc?w=600",
      hasVideo: false
    },
    { 
      id: 3, 
      title: "Jollof Rice", 
      image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=600",
      hasVideo: false
    },
  ];

  return (
    <div className="accueil">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1 className="hero-title">Partagez et découvrez des</h1>
            <h2 className="hero-subtitle">saveurs authentiques.</h2>
            <p className="hero-tagline">Votre pont culturel gustatif.</p>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="popular-recipes-section">
        <div className="container">
          <h2 className="section-title">Recettes populaires du monde</h2>
          
          <div className="recipes-grid">
            {featuredRecipes.map((recipe) => (
              <div key={recipe.id} className="recipe-card">
                <div className="recipe-image-container">
                  {recipe.hasVideo && (
                    <div className="video-badge">Recette Vidéo</div>
                  )}
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="recipe-image"
                  />
                  {recipe.hasVideo && (
                    <div className="play-button-overlay">
                      <div className="play-button-circle">
                        <span className="play-icon">▶</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="recipe-info">
                  <h3 className="recipe-title">{recipe.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-container">
            <button className="view-all-btn">Voir toutes les recettes</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Accueil;
