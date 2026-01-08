import React from "react";
import "../style/Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">

        {/* À propos */}
        <div className="footer-section">
          <h3 className="footer-title">HomeFlavors</h3>
          <p className="footer-text">
            HomeFlavors est une plateforme dédiée au partage de recettes
            authentiques et à la découverte des saveurs du monde.
          </p>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-list">
            <li>📧 contact@homeflavors.com</li>
            <li>📞 +212 6 12 34 56 78</li>
            <li>📍 Maroc</li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div className="footer-section">
          <h3 className="footer-title">Suivez-nous</h3>
          <div className="social-links">
            <a href="#" aria-label="Facebook">📘</a>
            <a href="#" aria-label="Instagram">📸</a>
            <a href="#" aria-label="TikTok">🎵</a>
            <a href="#" aria-label="YouTube">▶️</a>
          </div>
        </div>

      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <p>© {year} HomeFlavors. Tous droits réservés.</p>
      </div>
    </footer>
  );
};

export default Footer;