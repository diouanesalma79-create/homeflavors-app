import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Chefs.css';

const Chefs = () => {
  // Sample chef data
  const chefs = [
    {
      id: 1,
      name: "Maria Rodriguez",
      country: "Spain",
      description: "Traditional Spanish tapas from my grandmother's kitchen",
      recipesCount: 12,
      image: "https://via.placeholder.com/200x200/8a5a44/FFFFFF?text=MR"
    },
    {
      id: 2,
      name: "Ahmed Hassan",
      country: "Egypt",
      description: "Authentic Middle Eastern dishes with family secrets",
      recipesCount: 8,
      image: "https://via.placeholder.com/200x200/8a5a44/FFFFFF?text=AH"
    },
    {
      id: 3,
      name: "Linh Nguyen",
      country: "Vietnam",
      description: "Street food recipes passed down from my mother",
      recipesCount: 15,
      image: "https://via.placeholder.com/200x200/8a5a44/FFFFFF?text=LN"
    },
    {
      id: 4,
      name: "Giuseppe Romano",
      country: "Italy",
      description: "Nonna's pasta recipes perfected over decades",
      recipesCount: 10,
      image: "https://via.placeholder.com/200x200/8a5a44/FFFFFF?text=GR"
    },
    {
      id: 5,
      name: "Fatima Al-Zahra",
      country: "Morocco",
      description: "Spice blends and tagines from my family traditions",
      recipesCount: 9,
      image: "https://via.placeholder.com/200x200/8a5a44/FFFFFF?text=FA"
    },
    {
      id: 6,
      name: "Sakura Tanaka",
      country: "Japan",
      description: "Delicate Japanese dishes with seasonal ingredients",
      recipesCount: 7,
      image: "https://via.placeholder.com/200x200/8a5a44/FFFFFF?text=ST"
    }
  ];

  return (
    <div className="chefs-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Meet Our Home Chefs</h1>
          <p className="hero-subtitle">Real people sharing authentic family recipes from their homes</p>
        </div>
      </section>

      {/* Why Our Chefs Section */}
      <section className="why-chefs-section">
        <div className="section-container">
          <h2 className="section-title">Why Our Chefs?</h2>
          <div className="reasons-grid">
            <div className="reason-card">
              <div className="reason-icon">👨‍👩‍👧‍👦</div>
              <h3>Family Cooks</h3>
              <p>These are home cooks, not commercial chefs. Just passionate people sharing their family traditions.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🌿</div>
              <h3>Authentic Recipes</h3>
              <p>Traditional and family-made recipes passed down through generations with love.</p>
            </div>
            <div className="reason-card">
              <div className="reason-icon">🌍</div>
              <h3>Cultural Flavors</h3>
              <p>Discover authentic flavors from different cultures and family kitchens around the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Chef Cards Section */}
      <section className="chefs-cards-section">
        <div className="section-container">
          <h2 className="section-title">Our Home Chefs</h2>
          <div className="chefs-grid">
            {chefs.map(chef => (
              <div key={chef.id} className="chef-card">
                <div className="chef-image-container">
                  <img src={chef.image} alt={`${chef.name}`} className="chef-image" />
                </div>
                <div className="chef-info">
                  <h3 className="chef-name">{chef.name}</h3>
                  <p className="chef-country">{chef.country}</p>
                  <p className="chef-description">{chef.description}</p>
                  <div className="chef-stats">
                    <span className="recipes-count">{chef.recipesCount} recipes</span>
                  </div>
                  <Link to={`/chef/${chef.id}`} className="view-recipes-btn">
                    View Recipes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2 className="cta-title">Do you love cooking family recipes?</h2>
            <p className="cta-subtitle">Join our community and share your flavors.</p>
            <Link to="/become-chef" className="become-chef-btn">
              Become a Home Chef
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chefs;