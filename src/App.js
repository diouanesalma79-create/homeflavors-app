import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer';
import Accueil from './Page/Accueil';
import { LoginPage } from './Page/LoginPage';
import RecipeExploration from './component/RecipeExploration';
import RecipeDetail from './component/RecipeDetail';
import ChatboxA from './component/ChatboxA';
import Chefs from './component/Chefs';
import ChefRegistration from './component/ChefRegistration';
import ErrorPage from './component/ErrorPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Header />

        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/recipes" element={<RecipeExploration />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/chefs" element={<Chefs />} />
          <Route path="/become-chef" element={<ChefRegistration />} />
          <Route path="/chatbox" element={<ChatboxA />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;