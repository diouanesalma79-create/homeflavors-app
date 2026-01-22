import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/Dashboard.css';
import '../style/ChefDashboard.css'; // Import the new CSS file

// Import SVG icons
import { GridIcon, CookingPotIcon, MessageCircleIcon, UserIcon, LogOutIcon } from '../assets/icons/Icons';

// Define a function to get flag emoji based on nationality
const getFlagEmoji = (nationality) => {
  const flags = {
    'Spanish': '🇪🇸',
    'Italian': '🇮🇹',
    'French': '🇫🇷',
    'Mexican': '🇲🇽',
    'Indian': '🇮🇳',
    'Chinese': '🇨🇳',
    'Japanese': '🇯🇵',
    'Thai': '🇹🇭',
    'Moroccan': '🇲🇦',
    'Greek': '🇬🇷',
    'Turkish': '🇹🇷',
    'Lebanese': '🇱🇧',
    'American': '🇺🇸',
    'British': '🇬🇧'
  };
  return flags[nationality] || '🌍'; // Default globe emoji if nationality not found
};

const Dashboard = () => {
  const { userType } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check user session on component mount
    const checkSession = () => {
      const currentUser = UserService.getCurrentUser();
      if (!currentUser) {
        navigate('/login');
        return;
      }

      // Validate user type and redirect if accessing wrong dashboard
      if (userType !== currentUser.role) {
        navigate(`/dashboard/${currentUser.role}`);
        return;
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkSession();
  }, [userType, navigate]);

  // Handle avatar image change
  const handleAvatarImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        // Update user profile with new avatar
        const updatedUser = {...user, profilePhoto: event.target.result};
        setUser(updatedUser);
        
        // In a real app, you would save this to the user profile
        // UserService.updateUserProfile(user.id, { profilePhoto: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger avatar image upload
  const triggerAvatarUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleAvatarImageChange;
    fileInput.click();
  };

  // Remove avatar image and revert to initial
  const removeAvatar = () => {
    // Update user profile to remove avatar
    const updatedUser = {...user, profilePhoto: null};
    setUser(updatedUser);
    
    // In a real app, you would remove the photo from user profile
    // UserService.updateUserProfile(user.id, { profilePhoto: null });
  };

  const handleLogout = () => {
    UserService.logout();
    navigate('/login');
  };

  const handleProfileSettings = () => {
    // Navigate to profile settings page (to be implemented)
    console.log('Navigate to profile settings');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={user.role === 'chef' ? 'chef-dashboard-wrapper' : 'visitor-dashboard-container'}>
      {user.role === 'chef' ? (
        <ChefDashboard user={user} onLogout={handleLogout} onProfileSettings={handleProfileSettings} />
      ) : (
        <>
          {/* Welcome Section for Visitor */}
          <div className="visitor-dashboard-header">
            <div className="visitor-cover-image"></div>
            <div className="visitor-profile-info">
              <div className="visitor-profile-info-content">
                <div className="visitor-avatar-container">
                  <div className={user.profilePhoto ? "visitor-avatar visitor-image-avatar" : "visitor-avatar visitor-fallback-avatar"}>
                    {user.profilePhoto ? (
                      <img src={user.profilePhoto} alt={user.name} style={{width: '100%', height: '100%', borderRadius: '50%'}} />
                    ) : (
                      <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <div className="visitor-profile-controls">
                    <button 
                      className="visitor-edit-btn" 
                      onClick={() => triggerAvatarUpload()}
                      title="Modifier la photo"
                    >
                      ✏️
                    </button>
                    {user.profilePhoto && (
                      <button 
                        className="visitor-remove-btn" 
                        onClick={() => removeAvatar()}
                        title="Supprimer la photo"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                  <div className="visitor-profile-badge">✓</div>
                </div>
                <div className="visitor-profile-details">
                  <h1 className="visitor-profile-name">
                    Welcome back, {user.name}!
                  </h1>
                  <p className="visitor-profile-role">
                    <span>Role: {user.role === 'chef' ? 'Professional Chef' : 'Food Enthusiast'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="visitor-dashboard-actions">
            <button 
              className="visitor-profile-btn"
              onClick={handleProfileSettings}
            >
              Profile Settings
            </button>
            <button 
              className="visitor-logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          {/* Visitor Dashboard Content */}
          <div className="dashboard-content">
            <VisitorDashboardContent />
          </div>
        </>
      )}
    </div>
  );
};

// Chef Dashboard Component with Sidebar and Enhanced Layout
const ChefDashboard = ({ user, onLogout, onProfileSettings }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarImage, setAvatarImage] = useState(user.profilePhoto || null);

  // Mock data for stats - in a real app, this would come from the backend
  const statsData = {
    totalRecipes: user.recipes ? user.recipes.length : 12,
    weeklyOrders: 8,
    unreadMessages: 3,
    averageRating: 4.8
  };
  
  // Mock activity feed data
  const activityFeed = [
    { id: 1, type: 'recipe', title: 'Added new Paella recipe', time: '2 hours ago' },
    { id: 2, type: 'order', title: 'Received new order from Maria', time: '5 hours ago' },
    { id: 3, type: 'message', title: 'New message from John', time: '1 day ago' },
    { id: 4, type: 'recipe', title: 'Updated ingredients for Risotto', time: '2 days ago' }
  ];

  const handleAddRecipe = () => {
    // Navigate to add recipe page (to be implemented)
    console.log('Navigate to add recipe page');
  };

  // Handle avatar image change
  const handleAvatarImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarImage(event.target.result);
        
        // In a real app, you would save this to the user profile
        // UserService.updateUserProfile(user.id, { profilePhoto: event.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger avatar image upload
  const triggerAvatarImageUpload = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = handleAvatarImageChange;
    fileInput.click();
  };

  // Remove avatar image and revert to initial
  const removeAvatarImage = () => {
    setAvatarImage(null);
    
    // In a real app, you would remove the photo from user profile
    // UserService.updateUserProfile(user.id, { profilePhoto: null });
  };

  const renderSidebar = () => (
    <div className="chef-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">HF</div>
          <span>HomeFlavors</span>
        </div>
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} style={{width: '100%', height: '100%', borderRadius: '50%'}} />
            ) : (
              <span>{user.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div className="sidebar-user-name">
            {user.name}
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('profile'); }}
        >
          <UserIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span>Profil</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('recipes'); }}
        >
          <CookingPotIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span>Recettes</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }}
        >
          <span className="icon">📋</span>
          <span>Commandes</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('messages'); }}
        >
          <MessageCircleIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span>Messages</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setActiveTab('settings'); }}
        >
          <span className="icon" style={{fontSize: '1.2rem'}}>⚙️</span>
          <span>Paramètres</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOutIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span className="sidebar-logout-text">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  const renderProfileHeader = () => (
    <div className="chef-profile-header">
      <div className="cover-image"></div>
      <div className="profile-info">
        <div className="profile-info-content">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {avatarImage ? (
                <img src={avatarImage} alt={user.name} style={{width: '100%', height: '100%', borderRadius: '50%'}} />
              ) : (
                <span>{user.name?.charAt(0)?.toUpperCase() || 'U'}</span>
              )}
            </div>
            <div className="profile-controls">
              <button 
                className="edit-photo-btn" 
                onClick={triggerAvatarImageUpload}
                title="Modifier la photo"
              >
                ✏️
              </button>
              {avatarImage && (
                <button 
                  className="remove-photo-btn" 
                  onClick={removeAvatarImage}
                  title="Supprimer la photo"
                >
                  🗑️
                </button>
              )}
            </div>
            <div className="profile-badge">✓</div>
          </div>
          <div className="profile-details">
            <h1 className="profile-name">
              {user.name} 
              <span className="profile-verified-badge">Chef vérifié</span>
            </h1>
            <p className="profile-role">
              <span>Professional Chef</span>
            </p>
            <p className="profile-nationality">
              <span>{getFlagEmoji(user.nationality || 'Spanish')} </span>
              <span>{user.nationality || 'Spain'}</span>
            </p>
            <div className="profile-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="rating-star">★</span>
              ))}
              <span style={{marginLeft: '0.5rem', fontSize: '0.9rem'}}>4.8</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStatsCards = () => (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon recipes">
          <CookingPotIcon style={{width: '24px', height: '24px'}} />
        </div>
        <h3 className="stat-value">{statsData.totalRecipes}</h3>
        <p className="stat-label">Total Recettes</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon orders">
          <span>📋</span>
        </div>
        <h3 className="stat-value">{statsData.weeklyOrders}</h3>
        <p className="stat-label">Commandes cette semaine</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon messages">
          <MessageCircleIcon style={{width: '24px', height: '24px'}} />
        </div>
        <h3 className="stat-value">{statsData.unreadMessages}</h3>
        <p className="stat-label">Messages non lus</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon rating">
          <span>⭐</span>
        </div>
        <h3 className="stat-value">{statsData.averageRating}</h3>
        <p className="stat-label">Note moyenne</p>
      </div>
    </div>
  );

  const renderActivityFeed = () => (
    <div className="activity-section">
      <h2 className="section-title">Activité récente</h2>
      <ul className="activity-list">
        {activityFeed.map(activity => (
          <li key={activity.id} className="activity-item">
            <div className={`activity-icon ${activity.type}`}>
              {activity.type === 'recipe' && <CookingPotIcon style={{width: '20px', height: '20px'}} />}
              {activity.type === 'order' && <span>📋</span>}
              {activity.type === 'message' && <MessageCircleIcon style={{width: '20px', height: '20px'}} />}
            </div>
            <div className="activity-content">
              <h4 className="activity-title">{activity.title}</h4>
              <p className="activity-time">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderCTASection = () => (
    <div className="cta-section">
      <h3 className="cta-title">Envie de partager une nouvelle recette ?</h3>
      <button className="add-recipe-btn" onClick={handleAddRecipe}>
        <span>+</span> Ajouter une recette
      </button>
    </div>
  );

  return (
    <div className="chef-dashboard-container">
      {renderSidebar()}
      
      <main className="chef-main-content">
        <div className="chef-dashboard-content">
          {renderProfileHeader()}
          
          {renderStatsCards()}
          
          {renderActivityFeed()}
          
          {renderCTASection()}
        </div>
      </main>
    </div>
  );
};

// Visitor Dashboard Content Component (kept as is)
const VisitorDashboardContent = () => {
  // Reusable Dashboard Card Component
  const DashboardCard = ({ title, icon, description, actionText, onAction }) => {
    return (
      <div className="dashboard-card">
        <div className="card-icon">
          <span className="icon">{icon}</span>
        </div>
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <button className="card-action-btn" onClick={onAction}>
            {actionText}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="role-content visitor-dashboard">
      <div className="dashboard-grid">
        <DashboardCard 
          title="Saved Recipes" 
          icon="❤️"
          description="Access your favorite saved recipes"
          actionText="View Saved"
          onAction={() => console.log('Navigate to Saved Recipes')}
        />
        
        <DashboardCard 
          title="Explore Chefs" 
          icon="👨‍🍳"
          description="Discover talented chefs and their specialties"
          actionText="Browse Chefs"
          onAction={() => console.log('Navigate to Explore Chefs')}
        />
        
        <DashboardCard 
          title="Messages" 
          icon="💬"
          description="Connect with chefs and other food lovers"
          actionText="View Messages"
          onAction={() => console.log('Navigate to Messages')}
        />
      </div>
    </div>
  );
};

export default Dashboard;