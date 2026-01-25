import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/ChefSettings.css';

const ChefSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    language: 'en',
    bio: '',
    specialty: '',
    nationality: ''
  });
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'chef') {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      newPassword: '',
      confirmPassword: '',
      language: currentUser.language || 'en',
      bio: currentUser.bio || '',
      specialty: currentUser.specialty || '',
      nationality: currentUser.nationality || ''
    });
    
    if (currentUser.profilePhoto) {
      setPreviewUrl(currentUser.profilePhoto);
    }
  }, [navigate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Format d\'image non supporté (JPG, PNG, WEBP uniquement)'
        }));
        return;
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'L\'image ne doit pas dépasser 2MB'
        }));
        return;
      }

      setAvatar(file);
      setPreviewUrl(URL.createObjectURL(file));
      setErrors(prev => ({
        ...prev,
        avatar: ''
      }));
    }
  };

  const removeAvatar = () => {
    setAvatar(null);
    setPreviewUrl('');
    setErrors(prev => ({
      ...prev,
      avatar: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.newPassword && formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setMessage('');

    try {
      // Prepare updates
      const updates = {
        name: formData.name,
        email: formData.email,
        language: formData.language,
        bio: formData.bio,
        specialty: formData.specialty,
        nationality: formData.nationality
      };

      // Update password if provided
      if (formData.newPassword) {
        updates.password = formData.newPassword;
      }

      // Update avatar if provided
      if (avatar) {
        updates.profilePhoto = avatar;
      }

      // Update user data in service
      const updatedUser = UserService.updateUserData(user.id, updates);

      // Update current session
      const currentUser = UserService.getCurrentUser();
      if (currentUser) {
        const updatedSession = {
          ...currentUser,
          name: formData.name,
          email: formData.email,
          language: formData.language,
          bio: formData.bio,
          specialty: formData.specialty,
          nationality: formData.nationality,
          profilePhoto: avatar ? URL.createObjectURL(avatar) : currentUser.profilePhoto
        };
        localStorage.setItem('currentUser', JSON.stringify(updatedSession));
      }

      setMessage('Profile updated successfully!');
      setTimeout(() => {
        navigate('/chef/profile');
      }, 1500);
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/chef/profile');
  };

  if (!user) {
    return (
      <div className="chef-settings-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="chef-settings-container">
      <div className="chef-settings-card">
        <h2>Profile Settings</h2>
        
        {message && (
          <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <form className="chef-settings-form" onSubmit={handleSubmit}>
          {/* Avatar Section */}
          <div className="avatar-section">
            <div className="avatar-preview">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Profile Preview" 
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
            </div>
            
            <div className="avatar-controls">
              <input
                type="file"
                id="avatar-upload"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleAvatarChange}
                className="avatar-input"
              />
              <label htmlFor="avatar-upload" className="upload-btn">
                Change Avatar
              </label>
              
              {previewUrl && (
                <button
                  type="button"
                  className="remove-btn"
                  onClick={removeAvatar}
                >
                  Remove
                </button>
              )}
            </div>
            
            {errors.avatar && <span className="error-message">{errors.avatar}</span>}
          </div>

          {/* Personal Information */}
          <div className="form-section">
            <h3>Personal Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={errors.name ? 'error' : ''}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself as a chef"
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="specialty">Specialty</label>
                <input
                  type="text"
                  id="specialty"
                  value={formData.specialty}
                  onChange={(e) => handleInputChange('specialty', e.target.value)}
                  placeholder="Your culinary specialty"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nationality">Nationality</label>
                <input
                  type="text"
                  id="nationality"
                  value={formData.nationality}
                  onChange={(e) => handleInputChange('nationality', e.target.value)}
                  placeholder="Your nationality"
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="form-section">
            <h3>Security</h3>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password (optional)</label>
              <input
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className={errors.newPassword ? 'error' : ''}
                placeholder="Leave blank to keep current password"
              />
              {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Re-enter new password"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Language Selection */}
          <div className="form-section">
            <h3>Preferences</h3>
            
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className="language-select"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-btn"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChefSettings;