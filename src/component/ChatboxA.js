import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/ChatboxA.css';

const ChatboxA = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI recipe assistant. How can I help you today?", sender: 'ai' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user'
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: `I received your message: "${inputValue}". I can suggest recipes based on your ingredients.`,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="chatbox-container">
      <div className="chat-main">
        <header className="chat-header">
          <h1>AI Recipe Assistant</h1>
          <Link to="/" className="back-to-home">Back to Home</Link>
        </header>

        <div className="chat-area">
          <div className="messages-container">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`message-bubble ${message.sender}-message`}
              >
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="input-area">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your ingredients here..."
            className="message-input"
          />
          <button 
            onClick={handleSendMessage} 
            className="send-button"
          >
            Send
          </button>
        </div>
      </div>

      <div className="quick-access-sidebar">
        <h2>Quick Access</h2>
        <div className="sidebar-buttons">
          <button className="sidebar-btn">Saved Recipes</button>
          <button className="sidebar-btn">Community Features</button>
          <button className="sidebar-btn">Delivery Options</button>
        </div>
      </div>
    </div>
  );
};

export default ChatboxA;