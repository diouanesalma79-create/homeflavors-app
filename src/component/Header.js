import React from 'react';
import Logo from './Header/Logo';
import Navigation from './Header/Navigation';
import HeaderActions from './Header/HeaderActions';
import '../style/Header.css';

const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="header-container">
        <div className="header-left">
          <Logo />
        </div>

        <div className="header-center">
          <Navigation />
        </div>

        <div className="header-right">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
};

export default Header;