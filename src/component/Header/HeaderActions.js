import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/HeaderActions.css';

const HeaderActions = () => {
  const navigate = useNavigate();

  const handleChatboxClick = () => {
    // Handle chatbox functionality
    console.log('Chatbox clicked');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="header-actions">
      <button
        type="button"
        className="header-btn header-btn--chatbox"
        onClick={handleChatboxClick}
      >
        ChatboxAI
      </button>

      <button
        type="button"
        className="header-btn header-btn--login"
        onClick={handleLoginClick}
      >
        Login
      </button>
    </div>
  );
};

export default HeaderActions;
