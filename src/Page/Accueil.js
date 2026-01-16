import React from "react";
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
   const featuredRecipes = [
  { 
    id: 1, 
    title: "Pad Thai", 
    image: "/images/Pad Thai.jpg",
    hasVideo: true,
    description: "Pad Thai is a popular Thai dish made with rice noodles, eggs, peanuts, and a variety of vegetables and proteins. It's typically stir-fried with a sweet and sour sauce and served with lime wedges and chili flakes."
  },
  { 
    id: 2, 
    title: "Moussaka", 
    image: "/images/Moussaka.jpg",
    hasVideo: false,
    description: "Moussaka is a classic Mediterranean casserole made of layers of eggplant, minced meat, tomato sauce, and creamy béchamel, baked until golden."
  },
  { 
    id: 3, 
    title: "Jollof Rice", 
    image: "/images/Jollof Rice.jpg",
    hasVideo: false,
    description: "Jollof Rice is a popular West African dish made with rice, tomatoes, onions, peppers, and spices, often served with meat or vegetables."
  },
  { 
    id: 4, 
    title: "Crème Catalana", 
    image: CremeCatalana,
    hasVideo: false,
    description: "Crème Catalana is a traditional Spanish dessert made with custard flavored with cinnamon and lemon, topped with caramelized sugar."
  },
  { 
    id: 5, 
    title: "Empanados", 
    image: Empanadas,
    hasVideo: false,
    description: "Empanados are savory pastries filled with meat, vegetables, or cheese, baked or fried until golden."
  },
  { 
    id: 6, 
    title: "French Mille-Feuille", 
    image: FrenchMilleFeuille,
    hasVideo: false,
    description: "French mille-feuille is a classic pastry made with layers of puff pastry and vanilla cream."
  },
  { 
    id: 7, 
    title: "Guacamole", 
    image: Guacamole,
    hasVideo: false,
    description: "Guacamole is a traditional Mexican dip made from mashed avocados, lime juice, onions, and tomatoes."
  },
  { 
    id: 8, 
    title: "Hummus with Zaatar", 
    image: HummusZaatar,
    hasVideo: false,
    description: "Hummus with zaatar is a creamy chickpea spread blended with tahini, lemon, and aromatic spices."
  },
  { 
    id: 9, 
    title: "Paella", 
    image: Paella,
    hasVideo: false,
    description: "Paella is a famous Spanish rice dish cooked with saffron, seafood, meat, or vegetables."
  },
  { 
    id: 10, 
    title: "Chicken Pastilla", 
    image: ChickenPastilla,
    hasVideo: false,
    description: "Chicken pastilla is a Moroccan sweet-and-savory pie made with spiced chicken, almonds, and crispy pastry."
  },
  { 
    id: 11, 
    title: "Rfissa", 
    image: Rfissa,
    hasVideo: false,
    description: "Rfissa is a traditional Moroccan dish made with flatbread, chicken, lentils, and fragrant spices."
  },
  { 
    id: 12, 
    title: "Tajine Eggs and Tomato", 
    image: tajineEggTomato,
    hasVideo: false,
    description: "Ajine with eggs and tomato is a comforting North African dish with eggs cooked in spiced tomato sauce."
  },
  { 
    id: 13, 
    title: "Taktouka", 
    image: Taktouka,
    hasVideo: false,
    description: "Taktouka is a Moroccan warm salad made from tomatoes and green peppers."
  },
  { 
    id: 14, 
    title: "Warak Enab", 
    image: WarakEnab,
    hasVideo: false,
    description: "Warak enab are grape leaves stuffed with rice and herbs, popular across the Middle East and Mediterranean."
  }
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
