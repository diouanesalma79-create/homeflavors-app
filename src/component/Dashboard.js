import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/Dashboard.css';

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
    <div className="dashboard-container">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <div className="user-profile">
            {user.profilePhoto ? (
              <img 
                src={user.profilePhoto} 
                alt={user.name} 
                className="profile-photo"
              />
            ) : (
              <div className="profile-initials">
                {user.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
            )}
            <div className="user-info">
              <h1>Welcome back, {user.name}!</h1>
              <p className="user-role">Role: {user.role === 'chef' ? 'Professional Chef' : 'Food Enthusiast'}</p>
            </div>
          </div>
        </div>
        
        <div className="dashboard-actions">
          <button 
            className="profile-btn"
            onClick={handleProfileSettings}
          >
            Profile Settings
          </button>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Role-specific Content */}
      <div className="dashboard-content">
        {user.role === 'chef' ? (
          <ChefDashboardContent />
        ) : (
          <VisitorDashboardContent />
        )}
      </div>
    </div>
  );
};

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

// Chef Dashboard Content Component
const ChefDashboardContent = () => {
  return (
    <div className="role-content chef-dashboard">
      <div className="dashboard-grid">
        <DashboardCard 
          title="My Recipes" 
          icon="🍽️"
          description="Manage and update your recipe collection"
          actionText="View Recipes"
          onAction={() => console.log('Navigate to My Recipes')}
        />
        
        <DashboardCard 
          title="Orders" 
          icon="📋"
          description="Track and manage customer orders"
          actionText="View Orders"
          onAction={() => console.log('Navigate to Orders')}
        />
        
        <DashboardCard 
          title="Messages" 
          icon="💬"
          description="Communicate with customers and collaborators"
          actionText="View Messages"
          onAction={() => console.log('Navigate to Messages')}
        />
      </div>
    </div>
  );
};

// Visitor Dashboard Content Component
const VisitorDashboardContent = () => {
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