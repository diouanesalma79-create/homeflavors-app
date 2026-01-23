import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
      
      // Check if user is admin (you can modify this logic based on your auth system)
      const isAdmin = (user.role === 'admin' || user.email === 'admin@homeflavors.com') && isAuthenticated;
      
      if (!isAdmin) {
        // Show access denied message instead of redirecting
        setError('Access Denied: Admin privileges required');
        setLoading(false);
        return;
      }
      
      fetchPendingUsers();
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPendingUsers = [
        {
          id: 1,
          fullName: 'Marie Dubois',
          email: 'marie.dubois@email.com',
          role: 'chef',
          registrationDate: '2024-01-15',
          profileImage: null,
          status: 'pending'
        },
        {
          id: 2,
          fullName: 'Jean Martin',
          email: 'jean.martin@email.com',
          role: 'visitor',
          registrationDate: '2024-01-16',
          profileImage: null,
          status: 'pending'
        },
        {
          id: 3,
          fullName: 'Sophie Laurent',
          email: 'sophie.laurent@email.com',
          role: 'chef',
          registrationDate: '2024-01-14',
          profileImage: null,
          status: 'approved'
        }
      ];

      const pending = mockPendingUsers.filter(user => user.status === 'pending');
      const approved = mockPendingUsers.filter(user => user.status === 'approved');
      const rejected = mockPendingUsers.filter(user => user.status === 'rejected');

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
      // Mock API call - replace with actual implementation
      console.log(`Approving user ${userId}`);
      
      // Update local state
      const userToApprove = pendingUsers.find(user => user.id === userId);
      if (userToApprove) {
        setApprovedUsers([...approvedUsers, { ...userToApprove, status: 'approved' }]);
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      }
    } catch (err) {
      setError('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId) => {
    try {
      // Mock API call - replace with actual implementation
      console.log(`Rejecting user ${userId}`);
      
      // Update local state
      const userToReject = pendingUsers.find(user => user.id === userId);
      if (userToReject) {
        setRejectedUsers([...rejectedUsers, { ...userToReject, status: 'rejected' }]);
        setPendingUsers(pendingUsers.filter(user => user.id !== userId));
      }
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
          {user.profileImage ? (
            <img 
              src={user.profileImage} 
              alt={user.fullName} 
              className="user-avatar"
            />
          ) : (
            <div className="user-avatar-placeholder">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="user-info">
            <h3 className="user-name">{user.fullName}</h3>
            <p className="user-email">{user.email}</p>
            <p className="user-role">{user.role === 'chef' ? 'HomeAspiring Chef' : 'HomeAspiring Visitor'}</p>
            <p className="registration-date">Registered: {formatDate(user.registrationDate)}</p>
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

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  // Show access denied message
  if (error === 'Access Denied: Admin privileges required') {
    return (
      <div className="admin-dashboard">
        <div className="access-denied">
          <h2>Access Denied</h2>
          <p>You don't have permission to access the admin dashboard.</p>
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

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