import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/ChefLoginForm.css';

const ChefLoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Authenticate user
      const user = UserService.authenticateUser(formData.email, formData.password, 'chef');
      
      console.log('Chef login successful:', user);
      setErrors({}); // Clear any previous errors
      navigate('/dashboard/chef');
    } catch (error) {
      const errorMessage = error.message;
      // If the error is about needing to register first, redirect to become chef page
      if (errorMessage.includes('register first')) {
        setErrors({ general: 'Chef must register first via Become a Home Chef form. Redirecting...' });
        setTimeout(() => {
          navigate('/become-chef');
        }, 2000); // Delay for 2 seconds before redirect
      } else {
        setErrors({ general: errorMessage });
      }
    }
  };

  return (
    <div className="chef-login-page">
      <div className="chef-login-container">
        <h1>Chef Login</h1>
        <p className="subtitle">Welcome back to HomeFlavors</p>
        
        <form className="chef-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.general && <div className="error-message general-error" style={{color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>{errors.general}</div>}

          <button type="submit" className="submit-button">Log in as Chef</button>
        </form>

        <div className="back-link">
          <p>Don't have an account? <span onClick={() => navigate('/become-chef')} style={{color: '#8a5a44', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer'}}>Sign up here</span></p>
        </div>
      </div>
    </div>
  );
};

export default ChefLoginForm;