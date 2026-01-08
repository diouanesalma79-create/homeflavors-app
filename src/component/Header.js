import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ isLoggedIn, onLogout, onChatboxOpen }) => {
  const navigate = useNavigate();

  const handleChatboxClick = () => {
    if (onChatboxOpen) {
      onChatboxOpen();
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo-container">
          {/* Remplacez par votre logo */}
          <div className="logo">🍳</div>
          <h1 className="app-title">HomeFlavors</h1>
        </div>
      </div>

      <nav className="header-center">
        <ul className="nav-links">
          <li>
            <Link to="/" className="nav-link">Accueil</Link>
          </li>
          <li>
            <Link to="/recettes" className="nav-link">Recettes</Link>
          </li>
          <li>
            <Link to="/chef" className="nav-link">Chef</Link>
          </li>
        </ul>
      </nav>

      <div className="header-right">
        <button 
          className="chatbox-btn" 
          onClick={handleChatboxClick}
          aria-label="Ouvrir le chatbox AI"
        >
          <span className="chatbox-icon">🤖</span>
          <span className="chatbox-text">ChatboxAI</span>
        </button>

        {isLoggedIn ? (
          <button 
            className="logout-btn" 
            onClick={handleLogoutClick}
            aria-label="Se déconnecter"
          >
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Déconnexion</span>
          </button>
        ) : (
          <button 
            className="login-btn" 
            onClick={handleLoginClick}
            aria-label="Se connecter"
          >
            <span className="login-icon">👤</span>
            <span className="login-text">Login</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;