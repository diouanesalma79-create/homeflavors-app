import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../style/Navigation.css';

const navigationItems = [
  { path: '/', label: 'Accueil', end: true },
  { path: '/recipes', label: 'Recettes', end: false },
  { path: '/chefs', label: 'Chefs', end: false },
];

const Navigation = () => {
  return (
    <nav className="main-navigation" role="navigation" aria-label="Main navigation">
      <ul className="nav-list">
        {navigationItems.map(({ path, label, end }) => (
          <li key={path} className="nav-item">
            <NavLink
              to={path}
              end={end}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
