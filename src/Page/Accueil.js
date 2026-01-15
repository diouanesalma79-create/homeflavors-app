import React from "react";
import "../style/Accueil.css";
import foodBg from "../assets/logo/Food-Wallpaper.jpg";

const Accueil = () => {
  const featuredRecipes = [
    { 
      id: 1, 
      title: "Pad Thai", 
      image: "/images/Pad Thai.jpg",
      hasVideo: true,
      description:"Pad Thai is a popular Thai dish made with rice noodles, eggs, peanuts, and a variety of vegetables and proteins. It's typically stir-fried with a sweet and sour sauce and served with lime wedges and chili flakes. Pad Thai is a delicious and flavorful dish that is sure to please both vegetarians and meat-eaters.",
      
    },
    { 
      id: 2, 
      title: "Moussaka", 
      image: "/images/Moussaka.jpg",
      hasVideo: false,
      description:"Moussaka is a classic Mediterranean casserole made of layers of eggplant, minced meat (often lamb or beef), and a rich tomato sauce, all topped with creamy béchamel and baked until golden. It’s hearty, aromatic, and widely enjoyed across Greece, the Balkans, and the Middle East as a comforting family dish.",
    },
    { 
      id: 3, 
      title: "Jollof Rice", 
      image: "/images/Jollof Rice.jpg",
      hasVideo: false,
      description:"Jollof Rice is a popular West African dish made with rice, tomatoes, onions, peppers, and a variety of spices. It's typically cooked in a pressure cooker and served with chicken, meat, or vegetables. Jollof Rice is a delicious and flavorful dish that is sure to please both vegetarians and meat-eaters.",
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
                  <p className="recipe-description">{recipe.description}</p>
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
