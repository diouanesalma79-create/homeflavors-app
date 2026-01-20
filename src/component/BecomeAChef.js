import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/BecomeAChef.css';

const BecomeAChef = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    nationality: '',
    addRecipe: '',
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
    
    // Comprehensive validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.nationality) newErrors.nationality = 'Nationality is required';
    if (!formData.addRecipe) newErrors.addRecipe = 'Recipe description is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password && formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // eslint-disable-line no-useless-escape
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
        nationality: formData.nationality,
        addRecipe: formData.addRecipe,
        password: formData.password,
        role: 'chef',
        isChefRegistered: true,
        profilePhoto: previewImage
      };

      // Register user
      const newUser = UserService.registerUser(userData);
      
      console.log('Chef registration successful:', newUser);
      
      // Automatically log in the chef
      UserService.authenticateUser(formData.email, formData.password, 'chef');
      
      // Clear any previous errors
      setErrors({});
      
      alert(`Welcome ${formData.fullName}! Your registration as a Home Chef is complete.`);
      navigate('/dashboard/chef');
    } catch (error) {
      setErrors({ general: error.message });
      console.error('Registration error:', error);
    }
  };

  const nationalities = [
    'Algerian', 'American', 'Argentine', 'Australian', 'Austrian',
    'Bangladeshi', 'Belgian', 'Brazilian', 'British', 'Canadian',
    'Chilean', 'Chinese', 'Colombian', 'Cuban', 'Danish',
    'Dutch', 'Egyptian', 'Ethiopian', 'Filipino', 'Finnish',
    'French', 'German', 'Ghanaian', 'Greek', 'Indian',
    'Indonesian', 'Iranian', 'Irish', 'Israeli', 'Italian',
    'Japanese', 'Kenyan', 'Korean', 'Lebanese', 'Malaysian',
    'Mexican', 'Moroccan', 'Nigerian', 'Norwegian', 'Pakistani',
    'Peruvian', 'Polish', 'Portuguese', 'Russian', 'Saudi',
    'Singaporean', 'South African', 'Spanish', 'Swedish', 'Swiss',
    'Thai', 'Turkish', 'Ukrainian', 'Uruguayan', 'Venezuelan',
    'Vietnamese'
  ];

  return (
    <div className="become-chef-page">
      <div className="become-chef-container">
        <h1>Become a Home Chef</h1>
        <p className="subtitle">Join our community of passionate home cooks</p>
        
        <form className="become-chef-form" onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label htmlFor="nationality">Nationality *</label>
            <select
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={errors.nationality ? 'error' : ''}
            >
              <option value="">Select your nationality</option>
              {nationalities.map(nation => (
                <option key={nation} value={nation}>{nation}</option>
              ))}
            </select>
            {errors.nationality && <span className="error-message">{errors.nationality}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="addRecipe">Add Recipe *</label>
            <textarea
              id="addRecipe"
              name="addRecipe"
              value={formData.addRecipe}
              onChange={handleChange}
              className={errors.addRecipe ? 'error' : ''}
              placeholder="Tell us about your signature recipe (required)"
              rows="4"
            />
            {errors.addRecipe && <span className="error-message">{errors.addRecipe}</span>}
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

          {errors.general && <div className="error-message general-error" style={{color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px'}}>{errors.general}</div>}

          <button type="submit" className="submit-button">Register as Chef</button>
        </form>

        <div className="login-link">
          <p>Already have an account? <Link to="/login/chef">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default BecomeAChef;