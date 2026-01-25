import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/ChefOrders.css';

const ChefOrders = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser || currentUser.role !== 'chef') {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    
    // In a real app, this would fetch orders assigned to this chef from the backend
    // For now, we'll simulate getting orders from user data
    const userOrders = currentUser.orders || [];
    setOrders(userOrders);
    setLoading(false);
  }, [navigate]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="chef-orders-container">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="chef-orders-container">
        <div className="error">User not found</div>
      </div>
    );
  }

  return (
    <div className="chef-orders-container">
      <div className="orders-header">
        <h2>My Orders</h2>
        <div className="order-filters">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button 
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-btn ${filter === 'in_progress' ? 'active' : ''}`}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button 
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`filter-btn ${filter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <p>No orders yet.</p>
          <p>When customers place orders for your recipes, they will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-id">Order #{order.id}</div>
                <div className="order-status">
                  <span className={`status-badge ${order.status}`}>
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="order-details">
                <div className="customer-info">
                  <h4>{order.customerName}</h4>
                  <p>{order.customerEmail}</p>
                  <p>📍 {order.deliveryAddress}</p>
                </div>
                
                <div className="order-items">
                  <h5>Items:</h5>
                  <ul>
                    {order.items.map(item => (
                      <li key={item.id} className="order-item">
                        <span>{item.name}</span>
                        <span className="item-price">€{item.price}</span>
                        <span className="item-quantity">Qty: {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="order-summary">
                  <div className="order-date">
                    <strong>Date:</strong> {new Date(order.date).toLocaleDateString()}
                  </div>
                  <div className="order-total">
                    <strong>Total:</strong> €{order.totalAmount}
                  </div>
                </div>
              </div>
              
              <div className="order-actions">
                {order.status === 'pending' && (
                  <>
                    <button 
                      className="accept-btn"
                      onClick={() => {
                        // In a real app, this would update the order status to 'in_progress'
                        // For now, we'll just show an alert
                        alert(`Accepting order #${order.id}`);
                      }}
                    >
                      Accept Order
                    </button>
                    <button 
                      className="decline-btn"
                      onClick={() => {
                        // In a real app, this would update the order status to 'cancelled'
                        alert(`Declining order #${order.id}`);
                      }}
                    >
                      Decline
                    </button>
                  </>
                )}
                
                {(order.status === 'pending' || order.status === 'in_progress') && (
                  <button 
                    className="complete-btn"
                    onClick={() => {
                      // In a real app, this would update the order status to 'completed'
                      alert(`Marking order #${order.id} as completed`);
                    }}
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefOrders;