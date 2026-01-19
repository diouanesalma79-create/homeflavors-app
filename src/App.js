import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './component/Header';
import Footer from './component/Footer';
import Accueil from './Page/Accueil';
import RecipeExploration from './component/RecipeExploration';
import RecipeDetail from './component/RecipeDetail';
import ChatboxA from './component/ChatboxA';
import Chefs from './component/Chefs';
import ChefRecipes from './component/ChefRecipes';
import BecomeAChef from './component/BecomeAChef';
import UserTypeSelection from './component/UserTypeSelection';
import VisitorLogin from './component/VisitorLogin';
// import ChefLogin from './component/ChefLogin';
import VisitorLoginForm from './component/VisitorLoginForm';
import ChefLoginForm from './component/ChefLoginForm';
import ErrorPage from './component/ErrorPage';
import Order from './component/Order';
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
          <Route path="/chef/:chefId" element={<ChefRecipes />} />
          <Route path="/order/:recipeId" element={<Order />} />
          <Route path="/become-chef" element={<BecomeAChef />} />
          <Route path="/login" element={<UserTypeSelection />} />
          <Route path="/login/visitor_Form" element={<VisitorLoginForm />} />
          <Route path="/login/visitor" element={<VisitorLogin />} />
          <Route path="/login/chef" element={<ChefLoginForm />} />
          <Route path="/chatbox" element={<ChatboxA />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <Footer />
      </Router>
    </div>
  );
}

export default App;