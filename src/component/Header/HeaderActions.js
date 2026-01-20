import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/HeaderActions.css';
const HeaderActions = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setIsAuthenticated(true);
        setUser(JSON.parse(storedUser));
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleChatboxClick = () => {
    navigate('/chatbox');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleDashboardClick = () => {
    if (user) {
      navigate(`/dashboard/${user.role}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  return (
    <>
  
      {/* Actions */}
      <div className="header-actions">
        <button
          type="button"
          className="header-btn header-btn--chatbox"
          onClick={handleChatboxClick}
        >
          ChatboxAI
        </button>

        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="header-btn header-btn--dashboard"
              onClick={handleDashboardClick}
            >
              Dashboard
            </button>
            <button
              type="button"
              className="header-btn header-btn--logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            type="button"
            className="header-btn header-btn--login"
            onClick={handleLoginClick}
          >
            Login
          </button>
        )}
      </div>
    </>
  );
};

export default HeaderActions;
