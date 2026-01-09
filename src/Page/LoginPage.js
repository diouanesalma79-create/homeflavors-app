
import React from 'react';
import '../style/LoginPage.css'; 

export const LoginPage = () => {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2  className="fw-bold text-center mb-4">HomeFlavors</h2>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
      </div>
    </div>
  );
};

