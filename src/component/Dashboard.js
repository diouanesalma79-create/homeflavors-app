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
      reader.onload = async (event) => {
        const imageData = event.target.result;
        
        // Update user profile with new avatar
        try {
          const updatedUser = await UserService.updateUserData(user.id, { profilePhoto: imageData });
          // Update the current user session
          const currentUser = UserService.getCurrentUser();
          if (currentUser) {
            currentUser.profilePhoto = imageData;
            localStorage.setItem(UserService.CURRENT_USER_KEY, JSON.stringify(currentUser));
          }
          // Update local state
          setUser({...user, profilePhoto: imageData});
        } catch (error) {
          console.error('Error updating user profile photo:', error);
          alert('Error saving profile photo');
        }
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
  const removeAvatar = async () => {
    try {
      const updatedUser = await UserService.updateUserData(user.id, { profilePhoto: null });
      // Update the current user session
      const currentUser = UserService.getCurrentUser();
      if (currentUser) {
        currentUser.profilePhoto = null;
        localStorage.setItem(UserService.CURRENT_USER_KEY, JSON.stringify(currentUser));
      }
      // Update local state
      setUser({...user, profilePhoto: null});
    } catch (error) {
      console.error('Error removing profile photo:', error);
      alert('Error removing profile photo');
    }
  };

  const handleLogout = () => {
    UserService.logout();
    navigate('/login');
  };

  const handleProfileSettings = () => {
    // Navigate to profile settings page
    navigate('/profile-settings');
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
        <ChefDashboard user={user} onLogout={handleLogout} onProfileSettings={handleProfileSettings} navigate={navigate} />
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
                      <span>{user.name?.charAt(0) || 'U'}</span>
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
            <VisitorDashboardContent user={user} navigate={navigate} />
          </div>
        </>
      )}
    </div>
  );
};

// Chef Dashboard Component with Sidebar and Enhanced Layout
const ChefDashboard = ({ user, onLogout, onProfileSettings, navigate }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [avatarImage, setAvatarImage] = useState(user.profilePhoto || null);

  // Update avatar image when user data changes
  useEffect(() => {
    setAvatarImage(user.profilePhoto || null);
  }, [user]);

  // Calculate real data for stats from user profile and conversations
  const calculateStatsData = () => {
    // Get fresh user data to ensure we have latest conversations
    const currentUser = UserService.getCurrentUser();
    
    // Calculate unread messages from conversations
    let unreadMessages = 0;
    if (currentUser && currentUser.conversations) {
      unreadMessages = currentUser.conversations.filter(conv => conv.unread).length;
    }
    
    return {
      totalRecipes: currentUser?.recipes ? currentUser.recipes.length : 0,
      weeklyOrders: currentUser?.weeklyOrders || 0,
      unreadMessages: unreadMessages,
      averageRating: currentUser?.rating || 0
    };
  };
  
  const [statsData, setStatsData] = useState(calculateStatsData());
  
  // Update stats when user data changes
  useEffect(() => {
    setStatsData(calculateStatsData());
  }, [user]);
  
  // Mock activity feed data
  const activityFeed = [
    { id: 1, type: 'recipe', title: 'Added new Paella recipe', time: '2 hours ago' },
    { id: 2, type: 'order', title: 'Received new order from Maria', time: '5 hours ago' },
    { id: 3, type: 'message', title: 'New message from John', time: '1 day ago' },
    { id: 4, type: 'recipe', title: 'Updated ingredients for Risotto', time: '2 days ago' }
  ];

  const handleAddRecipe = () => {
    // Navigate to add recipe page
    navigate('/dashboard/chef/recettes/nouvelle');
  };

  // Handle avatar image change
  const handleAvatarImageChange = async (e) => {
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
      reader.onload = async (event) => {
        const imageData = event.target.result;
        setAvatarImage(imageData);
        
        // Update user profile with new avatar
        try {
          const updatedUser = await UserService.updateUserData(user.id, { profilePhoto: imageData });
          // Update the parent component's user state
          // In a real app, you would update the user context or parent state
        } catch (error) {
          console.error('Error updating user profile photo:', error);
          alert('Error saving profile photo');
        }
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
  const removeAvatarImage = async () => {
    setAvatarImage(null);
    
    try {
      const updatedUser = await UserService.updateUserData(user.id, { profilePhoto: null });
      // Update the parent component's user state
      // In a real app, you would update the user context or parent state
    } catch (error) {
      console.error('Error removing profile photo:', error);
      alert('Error removing profile photo');
    }
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
            {avatarImage ? (
              <img src={avatarImage} alt={user.name} style={{width: '100%', height: '100%', borderRadius: '50%'}} />
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
          onClick={(e) => { e.preventDefault(); navigate('/chef/profile'); }}
        >
          <UserIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span>Profile</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/chef/recipes'); }}
        >
          <CookingPotIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span>Recipes</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/chef/orders'); }}
        >
          <span className="icon">📋</span>
          <span>Orders</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/chef/messages'); }}
        >
          <MessageCircleIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span>Messages</span>
        </a>
        <a 
          href="#" 
          className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); navigate('/chef/settings'); }}
        >
          <span className="icon" style={{fontSize: '1.2rem'}}>⚙️</span>
          <span>Settings</span>
        </a>
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-logout-btn" onClick={onLogout}>
          <LogOutIcon className="icon" style={{width: '20px', height: '20px'}} />
          <span className="sidebar-logout-text">Logout</span>
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
                <span>{user.name?.charAt(0) || 'U'}</span>
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
              <span className="profile-verified-badge">Verified Chef</span>
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
        <p className="stat-label">Total Recipes</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon orders">
          <span>📋</span>
        </div>
        <h3 className="stat-value">{statsData.weeklyOrders}</h3>
        <p className="stat-label">Orders This Week</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon messages">
          <MessageCircleIcon style={{width: '24px', height: '24px'}} />
        </div>
        <h3 className="stat-value">{statsData.unreadMessages}</h3>
        <p className="stat-label">Unread Messages</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon rating">
          <span>⭐</span>
        </div>
        <h3 className="stat-value">{statsData.averageRating}</h3>
        <p className="stat-label">Average Rating</p>
      </div>
    </div>
  );

  const renderCTASection = () => (
    <div className="cta-section">
      <h3 className="cta-title">Want to share a new recipe?</h3>
      <button className="add-recipe-btn" onClick={handleAddRecipe}>
        <span>+</span> Add a Recipe
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
          
          {renderCTASection()}
        </div>
      </main>
    </div>
  );
};

// Visitor Dashboard Content Component (updated to include saved recipes functionality)
const VisitorDashboardContent = ({ user, navigate }) => {
  const [activeTab, setActiveTab] = useState('saved'); // Default to saved recipes
  const [savedRecipes, setSavedRecipes] = useState(user?.savedRecipes || []);

  // Update saved recipes when user changes
  useEffect(() => {
    if (user) {
      setSavedRecipes(user.savedRecipes || []);
    }
  }, [user]);

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

  // Saved Recipe Card Component
  const SavedRecipeCard = ({ recipe, onRemove }) => {
    return (
      <div className="saved-recipe-card">
        <img src={recipe.image} alt={recipe.title} className="saved-recipe-image" />
        <div className="saved-recipe-info">
          <h3 className="saved-recipe-title">{recipe.title}</h3>
          <p className="saved-recipe-meta">
            By {recipe.chefName} • {recipe.cuisine} • {recipe.prepTime} mins
          </p>
        </div>
        <div className="saved-recipe-actions">
          <button 
            className="view-recipe-btn"
            onClick={() => {
              // Navigate to the recipe detail page using the recipe ID
              navigate(`/recipe/${recipe.id}`);
            }}
          >
            View Recipe
          </button>
          <button 
            className="remove-recipe-btn"
            onClick={() => onRemove(recipe.id)}
          >
           Remove
          </button>
        </div>
      </div>
    );
  };

  // Handler for removing a saved recipe
  const handleRemoveSavedRecipe = (recipeId) => {
    if (user) {
      UserService.removeSavedRecipeForUser(user.id, recipeId);
      // Update local state
      const updatedUser = UserService.getCurrentUser();
      setSavedRecipes(updatedUser?.savedRecipes || []);
    }
  };

  // State for notifications
  const [notifications, setNotifications] = useState([]);
  
  // Poll for new messages
  useEffect(() => {
    let pollInterval;
    
    if (user && user.role === 'visitor') {
      const pollForNewMessages = () => {
        const currentUser = UserService.getCurrentUser();
        if (currentUser && currentUser.conversations) {
          // Check for unread messages
          const unreadConversations = currentUser.conversations.filter(conv => conv.unread);
          
          if (unreadConversations.length > 0) {
            // Create notifications for unread messages
            const newNotifications = unreadConversations
              .filter(conv => conv && conv.participant) // Filter out invalid conversations and those without participant data
              .map(conv => ({
                id: Date.now() + Math.random(),
                type: 'new_message',
                message: `📩 Nouveau message reçu de ${(conv.participant && conv.participant.name) || 'Deleted User'}`,
                timestamp: new Date().toLocaleTimeString(),
                conversationId: conv.id
              }));
            
            if (newNotifications.length > 0) {
              setNotifications(prev => [...newNotifications, ...prev.slice(0, 4)]); // Keep only last 5 notifications
            }
          }
        }
      };
      
      // Poll every 5 seconds
      pollInterval = setInterval(pollForNewMessages, 5000);
    }
    
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [user]);

  // Render saved recipes view
  const renderSavedRecipes = () => {
    if (savedRecipes.length === 0) {
      return (
        <div className="no-saved-recipes">
          <p>No saved recipes at the moment.</p>
        </div>
      );
    }

    return (
      <div className="saved-recipes-container">
        <div className="saved-recipes-grid">
          {savedRecipes.map(recipe => (
            <SavedRecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              onRemove={handleRemoveSavedRecipe} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="role-content visitor-dashboard">
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="notifications-panel">
          {notifications.map(notification => (
            <div key={notification.id} className="notification-item">
              <span className="notification-message">{notification.message}</span>
              <span className="notification-time">{notification.timestamp}</span>
              <button 
                className="notification-action"
                onClick={() => navigate('/messages')}
              >
               View
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Tab navigation for saved recipes view */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Saved Recipes
        </button>
        <button 
          className={`tab-button ${activeTab === 'other' ? 'active' : ''}`}
          onClick={() => setActiveTab('other')}
        >
         Others
        </button>
      </div>

      {activeTab === 'saved' ? (
        renderSavedRecipes()
      ) : (
        <div className="dashboard-grid">
          {user.conversations && user.conversations.length > 0 && (
            <DashboardCard 
              title="Messages" 
              icon="💬"
              description="Connect with chefs and other food lovers"
              actionText="View Messages"
              onAction={() => navigate('/messages')}
            />
          )}
          {(!user.conversations || user.conversations.length === 0) && (
            <div className="no-messages-placeholder">
              <p>No messages yet. Start a conversation!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;