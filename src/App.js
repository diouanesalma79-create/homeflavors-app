import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer';
import './style/Header.css';
import Accueil from './Page/Accueil';   // attention: smitha "Accueil" b s7i7
import { LoginPage } from './Page/LoginPage'; // khassek timporti LoginPage mn file dyalha

function App() {
  // States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);

  // Handlers
  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => setIsLoggedIn(false);
  const handleChatboxOpen = () => setShowChatbox(true);

  return (
    <div className="App">
      <Router>
        <Header
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onChatboxOpen={handleChatboxOpen}
        />

        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          {/* Ajoutez vos autres routes ici */}
        </Routes>

        {showChatbox && (
          <div className="chatbox-modal">
            {/* Votre composant ChatboxAI ici */}
          </div>
        )}
      </Router>

      <Footer />
    </div>
  );
}

export default App;