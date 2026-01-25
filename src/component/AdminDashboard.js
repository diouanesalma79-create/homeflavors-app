import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is admin
  useEffect(() => {
    const checkAdminAccess = () => {
      const currentUser = UserService.getCurrentUser();
      
      // Check if user is authenticated
      if (!currentUser) {
        navigate('/login');
        return;
      }
      
      // Check if user is admin
      if (currentUser.role !== 'admin') {
        // Redirect based on user role
        switch (currentUser.role) {
          case 'chef':
            navigate('/dashboard/chef');
            break;
          case 'visitor':
            navigate('/dashboard/visitor');
            break;
          default:
            navigate('/login');
        }
        return;
      }
      
      fetchPendingUsers();
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      
      // Attempt to fetch from API, but gracefully handle failure
      try {
        const response = await fetch('/api/admin/pending-users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch pending users from API');
        }
        
        const pendingUsersData = await response.json();
      } catch (apiError) {
        // API call failed (expected in dev without backend), continue with local data
        console.log('API call failed, using local data:', apiError.message);
      }
      
      // Get all users from UserService
      const allUsers = UserService.getAllUsers();
      
      // Filter users by status - excluding admin users
      const nonAdminUsers = allUsers.filter(user => user.role !== 'admin');
      
      const pending = nonAdminUsers.filter(user => {
        // If user has no explicit status or is marked as pending
        return !user.status || user.status === 'pending';
      });
      
      const approved = nonAdminUsers.filter(user => user.status === 'approved');
      const rejected = nonAdminUsers.filter(user => user.status === 'rejected');
      
      setPendingUsers(pending);
      setApprovedUsers(approved);
      setRejectedUsers(rejected);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      // Attempt API call, but handle failure gracefully
      try {
        const response = await fetch('/api/admin/approve-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to approve user via API');
        }
        
        await response.json();
      } catch (apiError) {
        // API call failed (expected in dev without backend), continue with local update
        console.log('Approve API call failed, updating locally:', apiError.message);
      }
      
      // Update user status in the service
      UserService.updateUserData(userId, { status: 'approved' });
      
      // Refresh the user lists
      const allUsers = UserService.getAllUsers();
      
      const nonAdminUsers = allUsers.filter(user => user.role !== 'admin');
      
      const pending = nonAdminUsers.filter(user => {
        return !user.status || user.status === 'pending';
      });
      
      const approved = nonAdminUsers.filter(user => user.status === 'approved');
      const rejected = nonAdminUsers.filter(user => user.status === 'rejected');
      
      setPendingUsers(pending);
      setApprovedUsers(approved);
      setRejectedUsers(rejected);
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      // Attempt API call, but handle failure gracefully
      try {
        const response = await fetch('/api/admin/reject-user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to reject user via API');
        }
        
        await response.json();
      } catch (apiError) {
        // API call failed (expected in dev without backend), continue with local update
        console.log('Reject API call failed, updating locally:', apiError.message);
      }
      
      // Update user status in the service
      UserService.updateUserData(userId, { status: 'rejected' });
      
      // Refresh the user lists
      const allUsers = UserService.getAllUsers();
      
      const nonAdminUsers = allUsers.filter(user => user.role !== 'admin');
      
      const pending = nonAdminUsers.filter(user => {
        return !user.status || user.status === 'pending';
      });
      
      const approved = nonAdminUsers.filter(user => user.status === 'approved');
      const rejected = nonAdminUsers.filter(user => user.status === 'rejected');
      
      setPendingUsers(pending);
      setApprovedUsers(approved);
      setRejectedUsers(rejected);
    } catch (err) {
      setError('Failed to reject user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderUserCards = (users) => {
    if (users.length === 0) {
      return <p className="no-users">No users found</p>;
    }

    return users.map(user => (
      <div key={user.id} className="user-card">
        <div className="user-card-header">
          {user.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt={user.fullName} 
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {user.fullName?.charAt(0).toUpperCase() || 'U'}
            </div>
          )}
          <div className="user-info">
            <h3 className="user-name">{user.fullName || user.name}</h3>
            <p className="user-email">{user.email}</p>
            <p className="user-role">{user.role === 'chef' ? 'Home Chef' : 'Visitor'}</p>
            <p className="registration-date">Registered: {formatDate(user.createdAt || user.registrationDate)}</p>
            <span className={'status-badge ' + (user.status === 'approved' ? 'status-approved' : user.status === 'rejected' ? 'status-rejected' : 'status-pending')}>
              {user.status === 'approved' ? 'Approved' : user.status === 'rejected' ? 'Rejected' : 'Pending'}
            </span>
          </div>
        </div>
        
        {activeTab === 'pending' && (
          <div className="approval-buttons">
            <button 
              className="approve-btn"
              onClick={() => handleApproveUser(user.id)}
            >
              ✅ Accept
            </button>
            <button 
              className="reject-btn"
              onClick={() => handleRejectUser(user.id)}
            >
              ❌ Reject
            </button>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage and approve new user accounts</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingUsers.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved ({approvedUsers.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected ({rejectedUsers.length})
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === 'pending' && (
          <div className="users-section">
            <h2>Pending Accounts</h2>
            <div className="users-grid">
              {renderUserCards(pendingUsers)}
            </div>
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="users-section">
            <h2>Approved Accounts</h2>
            <div className="users-grid">
              {renderUserCards(approvedUsers)}
            </div>
          </div>
        )}

        {activeTab === 'rejected' && (
          <div className="users-section">
            <h2>Rejected Accounts</h2>
            <div className="users-grid">
              {renderUserCards(rejectedUsers)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;