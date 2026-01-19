import React, { useState } from 'react';
import '../style/Order.css';

const Order = ({ dish }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    quantity: 1,
    note: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!formData.address) newErrors.address = 'Address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const orderData = {
      dishId: dish?.id,
      dishName: dish?.title,
      price: dish?.price,
      ...formData
    };

    console.log('Order submitted:', orderData);

    alert('Your order has been placed successfully!');
  };

 return (
  <div className="order-form-container">
    <div className="order-form">

      <h2>Order This Dish</h2>
      <p className="subtitle">
        Fresh homemade flavors, delivered to you
      </p>

      {dish && (
        <div className="selected-dish">
          <p><strong>Dish:</strong> {dish.title}</p>
          <p><strong>Price:</strong> ${dish.price}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={errors.fullName ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
        </div>

        <div className="form-group">
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Delivery Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Note (optional)</label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="2"
          />
        </div>

        <button type="submit" className="submit-button">
          Confirm Order
        </button>
      </form>

    </div>
  </div>
);
};

export default Order;
