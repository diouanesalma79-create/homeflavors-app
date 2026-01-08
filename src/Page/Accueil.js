import React, { useState, useEffect } from "react";
import "../style/Accueil.css";

const Accueil = () => {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  const sampleRecipes = [
    { id: 1, title: "Pad Thai", category: "asiatique" },
    { id: 2, title: "Moussaka", category: "mediterraneen" },
    { id: 3, title: "Tacos", category: "mexicain" },
  ];

  const categories = [
    { id: "all", name: "Toutes", icon: "🌍" },
    { id: "asiatique", name: "Asiatique", icon: "🥢" },
    { id: "mediterraneen", name: "Méditerranéen", icon: "🍅" },
    { id: "mexicain", name: "Mexicain", icon: "🌮" },
  ];

  useEffect(() => {
    setRecipes(sampleRecipes);
  }, []);

  const filteredRecipes =
    activeTab === "all"
      ? recipes
      : recipes.filter((r) => r.category === activeTab);

  return (
    <div className="accueil">
      {/* HERO */}
      <section className="hero-section">
        <h1>HomeFlavors</h1>
        <p>Découvrez des recettes authentiques du monde entier</p>
      </section>

      {/* CATEGORIES */}
      <section className="categories-section">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveTab(cat.id)}
            className={activeTab === cat.id ? "active" : ""}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </section>

      {/* RECIPES (TEMPORAIRE SANS RecipeCard) */}
      <section className="recipes-section">
        {filteredRecipes.map((recipe) => (
          <div key={recipe.id} className="recipe-placeholder">
            🍽️ {recipe.title}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Accueil;
