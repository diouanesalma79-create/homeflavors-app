import React from 'react';
import { NavLink } from 'react-router-dom';
import logoImage from '../../assets/logo/homeflavors-logo.png';
import '../../style/Logo.css';

const Logo = () => {
  return (
    <NavLink to="/" className="logo-link" aria-label="HomeFlavors - Retour à l'accueil">
      <img src={logoImage} alt="HomeFlavors" className="logo-icon" />
      <h1 className="logo-text">HomeFlavors</h1>
    </NavLink>
  );
};

export default Logo;
