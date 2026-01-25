import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import '../style/Messages.css';

const Messages = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const messagesEndRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    const currentUser = UserService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setUser(currentUser);
    loadConversations(currentUser);
  }, [navigate]);

  // Load conversations when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  // Mark conversation as read when it's selected
  useEffect(() => {
    if (selectedConversation && user) {
      // Mark as read after a brief delay to allow UI to update
      setTimeout(() => {
        UserService.markConversationAsRead(user.id, selectedConversation.id);
        // Update local state to reflect the change
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { ...conv, unread: false }
              : conv
          )
        );
      }, 500);
    }
  }, [selectedConversation, user]);

  // Search users function
  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      // Use dedicated search method from UserService
      const filteredUsers = UserService.searchUsers(query, user.id);
      
      // Debug logging
      console.log('Search query:', query);
      console.log('Current user ID:', user.id);
      console.log('Filtered users found:', filteredUsers.length);
      console.log('Filtered users:', filteredUsers.map(u => ({
        id: u.id,
        name: u.name,
        fullName: u.fullName,
        email: u.email,
        role: u.role
      })));
      
      setSearchResults(filteredUsers);
      setShowSearchResults(true);
    } catch (error) {
      setError('Failed to search users');
      console.error('Search error:', error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear previous timeout
    clearTimeout(searchTimeoutRef.current);
    
    // Show search results panel immediately when user starts typing
    if (query.trim()) {
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
    
    // Debounce search to avoid excessive calls
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        searchUsers(query);
      }
    }, 300);
  };

  // Ref for search timeout
  const searchTimeoutRef = useRef(null);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadConversations = async (currentUser) => {
    try {
      setLoading(true);
      
      // Load conversations from user data
      // In a real app, this would connect to a backend database
      const userConversations = currentUser.conversations || [];
      
      // Transform conversations to the expected format with proper cross-role support
      // Include all conversations, even those with no replies
      const transformedConversations = userConversations
        .filter(conv => conv && conv.id && conv.participantId) // Filter out undefined or invalid conversations
        .map(conv => {
          // Get participant info from UserService
          const participant = UserService.getUserById(conv.participantId);
          
          // Ensure proper participant data structure with fallbacks
          const participantData = participant ? {
            name: participant.name || participant.fullName || 'Deleted User',
            role: participant.role || 'User',
            profilePhoto: participant.profilePhoto || null,
            id: conv.participantId
          } : {
            name: conv.participant?.name || 'Deleted User',
            role: conv.participant?.role || 'User',
            profilePhoto: conv.participant?.profilePhoto || null,
            id: conv.participantId
          };
          
          return {
            id: conv.id,
            participant: participantData,
            lastMessage: conv.lastMessage || 'No messages yet',
            timestamp: conv.timestamp ? new Date(conv.timestamp) : new Date(),
            unread: conv.unread || false,
            messages: conv.messages || []
          };
        })
        // Sort by timestamp to show most recent conversations first
        .sort((a, b) => b.timestamp - a.timestamp);
      
      setConversations(transformedConversations);
      setLoading(false);
    } catch (error) {
      setError('Failed to load conversations');
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      // Load messages for the selected conversation
      // In a real app, this would connect to a backend database
      const conversation = conversations.find(conv => conv.id === conversationId);
      const conversationMessages = conversation ? conversation.messages || [] : [];
        
      setMessages(conversationMessages);
    } catch (error) {
      setError('Failed to load messages');
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    try {
      setError('');
      
      // Get receiver ID from selected conversation
      const receiverId = selectedConversation.participant.id;
      
      // Create message data
      const messageData = {
        content: newMessage.trim(),
        timestamp: new Date().toISOString()
      };
      
      // Add message to conversation in the backend
      const result = UserService.addMessageToConversation(user.id, receiverId, messageData);
      
      if (result) {
        // Create new message object for UI
        const newMsg = {
          id: Date.now(),
          senderId: user.id,
          content: newMessage.trim(),
          timestamp: new Date(),
          isOwn: true
        };
        
        // Add to messages in UI
        setMessages(prev => [...prev, newMsg]);
        
        // Update conversations list to show the new message
        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              lastMessage: newMessage.trim(),
              timestamp: new Date()
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        
        // Clear input
        setNewMessage('');
      } else {
        setError('Failed to send message');
      }
    } catch (error) {
      setError('Failed to send message');
    }
  };

  // Start a new conversation with a user
  const startConversation = (targetUser) => {
    // Create a conversation ID based on both user IDs
    const conversationId = `${Math.min(user.id, targetUser.id)}-${Math.max(user.id, targetUser.id)}`;
    
    // Check if a conversation already exists with this user
    const existingConversation = conversations.find(
      conv => conv.participant.id === targetUser.id || conv.id === conversationId
    );
    
    if (existingConversation) {
      // If conversation exists, select it
      setSelectedConversation(existingConversation);
      loadMessages(existingConversation.id);
      setShowSearchResults(false);
      setSearchQuery('');
      setSearchResults([]);
    } else {
      // Create a new conversation object with proper structure
      const newConversation = {
        id: conversationId,
        participantId: targetUser.id,
        participant: {
          name: targetUser.name || targetUser.fullName || 'Deleted User',
          role: targetUser.role || 'User',
          profilePhoto: targetUser.profilePhoto || null,
          id: targetUser.id
        },
        lastMessage: 'Start a conversation...',
        timestamp: new Date(),
        unread: false,
        messages: []
      };
      
      // Add to conversations at the beginning
      setConversations(prev => [newConversation, ...prev]);
      
      // Select the new conversation
      setSelectedConversation(newConversation);
      setMessages([]);
      
      // Hide search results and clear search
      setShowSearchResults(false);
      setSearchQuery('');
      setSearchResults([]);
      
      // Also create the conversation in the backend for persistence
      UserService.createEmptyConversation(user.id, targetUser.id);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const msgDate = new Date(date);
    
    if (msgDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (msgDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return msgDate.toLocaleDateString();
    }
  };

  if (!user) {
    return (
      <div className="messages-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="messages-container">
      <div className="messages-layout">
        {/* Conversations sidebar */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h2>Messages</h2>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search users to message"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
            </div>
          </div>
            
          {showSearchResults ? (
            <div className="search-results">
              {searchResults.length > 0 ? (
                searchResults.map(resultUser => {
                  // Get display name with fallback
                  const displayName = resultUser.name || resultUser.fullName || 'Unknown User';
                  const displayRole = resultUser.role || 'User';
                  
                  // Check if there's an existing conversation with this user
                  const existingConversation = conversations.find(
                    conv => conv.participant.id === resultUser.id
                  );
                  
                  return (
                    <div key={resultUser.id} className="search-result-item">
                      <div className="conversation-avatar">
                        {resultUser.profilePhoto ? (
                          <img src={resultUser.profilePhoto} alt={displayName} />
                        ) : (
                          <div className="avatar-placeholder">
                            {displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                        
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <span className="participant-name">{displayName}</span>
                          {existingConversation && (
                            <span className="existing-conversation-badge">💬</span>
                          )}
                        </div>
                        
                        <div className="search-user-email">
                          {resultUser.email && (
                            <span className="user-email">{resultUser.email}</span>
                          )}
                        </div>
                          
                        <div className="participant-role">{displayRole}</div>
                      </div>
                        
                      <button 
                        className="start-conversation-btn"
                        onClick={() => startConversation(resultUser)}
                      >
                        {existingConversation ? 'Continue Chat' : 'Start Conversation'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="no-search-results">
                  <p>No users found.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {loading ? (
                <div className="loading-conversations">
                  <div className="loading-spinner"></div>
                  <p>Loading conversations...</p>
                </div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : (
                <div className="conversations-list">
                  {conversations.map(conversation => (
                    <div 
                      key={conversation.id}
                      className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                      onClick={() => handleConversationSelect(conversation)}
                    >
                      <div className="conversation-avatar">
                        {conversation.participant.profilePhoto ? (
                          <img src={conversation.participant.profilePhoto} alt={conversation.participant.name} />
                        ) : (
                          <div className="avatar-placeholder">
                            {conversation.participant.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                        
                      <div className="conversation-info">
                        <div className="conversation-header">
                          <span className="participant-name">{conversation.participant.name}</span>
                          <span className="message-time">{formatTime(conversation.timestamp)}</span>
                        </div>
                          
                        <div className="conversation-preview">
                          <span className="last-message">{conversation.lastMessage}</span>
                          {conversation.unread && (
                            <span className="unread-badge">•</span>
                          )}
                        </div>
                          
                        <div className="participant-role">{conversation.participant.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
          
        {/* Chat area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>  
              {/* Chat header */}
              <div className="chat-header">
                <div className="chat-participant">
                  <div className="participant-avatar">
                    {selectedConversation.participant.profilePhoto ? (
                      <img src={selectedConversation.participant.profilePhoto} alt={selectedConversation.participant.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {selectedConversation.participant.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="participant-info">
                    <h3>{selectedConversation.participant.name}</h3>
                    <p>{selectedConversation.participant.role}</p>
                  </div>
                </div>
              </div>
                
              {/* Messages container */}
              <div className="messages-container-inner">
                {messages.length > 0 ? (
                  messages.map(message => {
                    // Get sender info with enhanced cross-role support
                    const isOwn = user && message.senderId === user.id;
                    const sender = isOwn ? user : (message.senderId ? UserService.getUserById(message.senderId) : null);
                    const senderName = sender ? (sender.name || sender.fullName || 'Deleted User') : 'Deleted User';
                    const senderRole = sender ? (sender.role || 'User') : 'User';
                    
                    return (
                      <div 
                        key={message.id} 
                        className={`message-bubble ${isOwn ? 'own-message' : 'other-message'}`}
                      >
                        {!isOwn && (
                          <div className="message-sender-info">
                            <span className="sender-name">{senderName}</span>
                            <span className="sender-role">{senderRole}</span>
                          </div>
                        )}
                        <div className="message-content">
                          <p>{message.content}</p>
                          <span className="message-time">{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    );
                  })
                ) : selectedConversation ? (
                  // Show conversation starter message when no messages exist
                  <div className="conversation-starter">
                    <div className="starter-message">
                      <p>You started a conversation with {selectedConversation.participant.name}</p>
                      <p className="starter-subtext">Send the first message to get the conversation going!</p>
                    </div>
                  </div>
                ) : (
                  <div className="no-messages">
                    <p>No messages yet. Start a conversation!</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
                
              {/* Message input */}
              <form className="message-input-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="message-input"
                />
                <button type="submit" className="send-button">
                  Send
                </button>
              </form>
                
              {error && <div className="error-message">{error}</div>}
            </>
          ) : (
            <div className="empty-chat-state">
              <h3>Select a conversation to start messaging</h3>
              <p>Choose a conversation from the list to view and send messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;