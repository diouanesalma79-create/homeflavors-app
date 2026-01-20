import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/VisitorLogin.css';

const VisitorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto') {
      const file = files[0];
      if (file) {
        setFormData(prev => ({ ...prev, profilePhoto: file }));
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Prepare user data
      const userData = {
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        role: 'visitor',
        profilePhoto: previewImage
      };

      // Register user
      const newUser = UserService.registerUser(userData);
      
      console.log('Visitor registration successful:', newUser);
      alert(`Welcome ${formData.fullName}! Your registration is complete.`);
      navigate('/login/visitor_Form');
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="visitor-login-page">
      <div className="visitor-login-container">
        <h1>Visitor Registration</h1>
        <p className="subtitle">Join our community to receive recipe notifications</p>
        
        <form className="visitor-form" onSubmit={handleSubmit}>
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
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Enter your full name"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
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
              placeholder="Create a password"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="profilePhoto">Profile Photo (Optional)</label>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              accept="image/*"
              onChange={handleChange}
              className={errors.profilePhoto ? 'error' : ''}
            />
            {previewImage && (
              <div className="photo-preview">
                <img src={previewImage} alt="Profile preview" />
              </div>
            )}
            {errors.profilePhoto && <span className="error-message">{errors.profilePhoto}</span>}
          </div>

          <button type="submit" className="submit-button">Register as Visitor</button>
        </form>

         <div className="back-link">
          <p>Have an account? <span onClick={() => navigate('/login/visitor_Form')} style={{color: '#8a5a44', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer'}}>Sign in here</span></p>
        </div>
      </div>
    </div>
  );
};

export default VisitorLogin;