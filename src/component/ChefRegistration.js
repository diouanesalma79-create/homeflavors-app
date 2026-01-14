import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/ChefRegistration.css';

const ChefRegistration = () => {
  const [userType, setUserType] = useState('');
  const [nationality, setNationality] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  const nationalities = [
    'Algerian', 'American', 'Argentine', 'Australian', 'Austrian',
    'Bangladeshi', 'Belgian', 'Brazilian', 'British', 'Canadian',
    'Chilean', 'Chinese', 'Colombian', 'Cuban', 'Danish',
    'Dutch', 'Egyptian', 'Ethiopian', 'Filipino', 'Finnish',
    'French', 'German', 'Ghanaian', 'Greek', 'Indian',
    'Indonesian', 'Iranian', 'Irish', 'Israeli', 'Italian',
    'Japanese', 'Kenyan', 'Korean', 'Lebanese', 'Malaysian',
    'Mexican', 'Moroccan', 'Nigerian', 'Norwegian', 'Pakistani',
    'Peruvian', 'Polish', 'Portuguese', 'Russian', 'Saudi',
    'Singaporean', 'South African', 'Spanish', 'Swedish', 'Swiss',
    'Thai', 'Turkish', 'Ukrainian', 'Uruguayan', 'Venezuelan',
    'Vietnamese'
  ];

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setShowDetails(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (userType === 'visitor') {
      // Redirect visitor to browse recipes
      navigate('/recipes');
    } else if (userType === 'chef') {
      // Redirect chef to registration/login
      navigate('/login');
    }
  };

  return (
    <div className="chef-registration-page">
      <div className="registration-container">
        <div className="registration-header">
          <h1>Become Part of Our Community</h1>
          <p className="subtitle">Join thousands of home cooks sharing authentic family recipes</p>
        </div>

        {!showDetails ? (
          <div className="user-type-selection">
            <h2>What brings you to HomeFlavors?</h2>
            <div className="options-grid">
              <button 
                className="option-card visitor-option"
                onClick={() => handleUserTypeSelect('visitor')}
              >
                <div className="option-icon">👥</div>
                <h3>I'm a Visitor</h3>
                <p>Browse recipes, discover new flavors, and enjoy cooking inspiration</p>
              </button>
              
              <button 
                className="option-card chef-option"
                onClick={() => handleUserTypeSelect('chef')}
              >
                <div className="option-icon">👨‍🍳</div>
                <h3>I'm a Home Chef</h3>
                <p>Share your family recipes and connect with fellow cooking enthusiasts</p>
              </button>
            </div>
          </div>
        ) : (
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <h2>{userType === 'visitor' ? 'Welcome, Food Explorer!' : 'Welcome, Future Chef!'}</h2>
              
              {userType === 'chef' && (
                <div className="chef-info">
                  <div className="info-box">
                    <h3>As a Home Chef, you can:</h3>
                    <ul>
                      <li>📚 Publish and manage your own family recipes</li>
                      <li>🌟 Share your culinary heritage with the world</li>
                      <li>💬 Connect with other home cooks and food lovers</li>
                      <li>💰 Optionally sell your premium recipes (your choice!)</li>
                      <li>📈 Build your personal recipe collection</li>
                    </ul>
                    <div className="selling-note">
                      <strong>Note:</strong> Selling recipes is completely optional. You can choose to share your recipes freely or offer them for sale - the choice is yours!
                    </div>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="nationality">Your Nationality/Cultural Background *</label>
                <select
                  id="nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                >
                  <option value="">Select your nationality</option>
                  {nationalities.map(nation => (
                    <option key={nation} value={nation}>{nation}</option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => setShowDetails(false)}>
                  ← Back
                </button>
                <button type="submit" className="continue-button">
                  {userType === 'visitor' ? 'Start Exploring Recipes' : 'Continue to Registration'}
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="login-link">
          <p>Already have an account? <Link to="/login">Sign in here</Link></p>
        </div>
        
        <div className="global-community">
          <h3 className="community-title">A Global Community United by Food</h3>
          <div className="cuisine-icons">
            <div className="cuisine-item">
              <div className="cuisine-icon">🍝</div>
              <div className="cuisine-name">Italian</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🌮</div>
              <div className="cuisine-name">Mexican</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🍱</div>
              <div className="cuisine-name">Japanese</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🥘</div>
              <div className="cuisine-name">Moroccan</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🍛</div>
              <div className="cuisine-name">Indian</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🍜</div>
              <div className="cuisine-name">Chinese</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🧆</div>
              <div className="cuisine-name">Middle Eastern</div>
            </div>
            <div className="cuisine-item">
              <div className="cuisine-icon">🍲</div>
              <div className="cuisine-name">French</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChefRegistration;