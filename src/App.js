import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer';
import Accueil from './Page/Accueil';
import { LoginPage } from './Page/LoginPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Add your other routes here */}
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;