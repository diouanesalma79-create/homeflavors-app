class UserService {
  static USERS_KEY = 'registeredUsers';
  static CURRENT_USER_KEY = 'currentUser';

  // Get all registered users
  static getAllUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Save users to localStorage
  static saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Register a new user
  static registerUser(userData) {
    const users = this.getAllUsers();
    
    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Add new user
    const newUser = {
      id: Date.now(), // Simple ID generation
      ...userData,
      createdAt: new Date().toISOString(),
      profilePhoto: userData.profilePhoto || null,
      recipes: userData.recipes || [],
      savedRecipes: userData.savedRecipes || [], // Add saved recipes array
      conversations: userData.conversations || [], // Add conversations array
      // Ensure chef registration flag is set
      isChefRegistered: userData.role === 'chef' ? true : userData.isChefRegistered || false
    };

    users.push(newUser);
    this.saveUsers(users);
    
    console.log('User registered successfully:', newUser);
    return newUser;
  }

  // Authenticate user
  static authenticateUser(email, password, role) {
    const users = this.getAllUsers();
    
    const user = users.find(u => 
      u.email === email && 
      u.password === password && 
      u.role === role
    );

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // For chefs, check if they're registered via BecomeAChef form
    if (role === 'chef' && !user.isChefRegistered) {
      throw new Error('Chef must register first via Become a Home Chef form');
    }

    // Save current user session with complete user data
    const sessionData = {
      id: user.id,
      name: user.fullName || user.name,
      email: user.email,
      role: user.role,
      profilePhoto: user.profilePhoto,
      nationality: user.nationality,
      recipes: user.recipes || [],
      savedRecipes: user.savedRecipes || [], // Include saved recipes
      conversations: user.conversations || [], // Include conversations
      createdAt: user.createdAt
    };
    
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(sessionData));
    
    console.log('User authenticated successfully:', sessionData);
    return user;
  }

  // Get current user
  static getCurrentUser() {
    const currentUser = localStorage.getItem(this.CURRENT_USER_KEY);
    return currentUser ? JSON.parse(currentUser) : null;
  }

  // Logout user
  static logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Check if user is registered as chef
  static isChefRegistered(email) {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.role === 'chef');
    return user && user.isChefRegistered;
  }

  // Mark chef as registered through BecomeAChef form
  static markChefAsRegistered(email) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.email === email && u.role === 'chef');
    
    if (userIndex !== -1) {
      users[userIndex].isChefRegistered = true;
      this.saveUsers(users);
    }
  }

  // Update user data
  static updateUserData(userId, updates) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      this.saveUsers(users);
      
      // Update current session if this is the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedSession = { ...currentUser, ...updates };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
      }
      
      return users[userIndex];
    }
    return null;
  }

  // Add message to conversation for both users
  static addMessageToConversation(senderUserId, receiverUserId, messageData) {
    const users = this.getAllUsers();
    const senderIndex = users.findIndex(u => u.id === senderUserId);
    const receiverIndex = users.findIndex(u => u.id === receiverUserId);
    
    if (senderIndex !== -1 && receiverIndex !== -1) {
      const conversationId = `${Math.min(senderUserId, receiverUserId)}-${Math.max(senderUserId, receiverUserId)}`;
      
      // Create message object with proper cross-role support
      const message = {
        id: Date.now(),
        senderId: senderUserId,
        receiverId: receiverUserId,
        content: messageData.content,
        timestamp: messageData.timestamp || new Date().toISOString(),
        read: false
      };
      
      // Update sender's conversation with proper cross-role data
      let senderConversations = users[senderIndex].conversations || [];
      let senderConv = senderConversations.find(c => c.id === conversationId);
      if (!senderConv) {
        // Get receiver info for proper display
        const receiver = users[receiverIndex];
        senderConv = {
          id: conversationId,
          participantId: receiverUserId,
          participant: {
            name: receiver.name || receiver.fullName || 'Deleted User',
            role: receiver.role || 'User',
            profilePhoto: receiver.profilePhoto || null,
            id: receiverUserId
          },
          lastMessage: message.content,
          timestamp: message.timestamp,
          unread: false,
          messages: []
        };
        senderConversations.unshift(senderConv);
      } else {
        senderConv.lastMessage = message.content;
        senderConv.timestamp = message.timestamp;
        // Ensure conversation stays at the top
        const convIndex = senderConversations.findIndex(c => c.id === conversationId);
        if (convIndex > 0) {
          const [removed] = senderConversations.splice(convIndex, 1);
          senderConversations.unshift(removed);
        }
      }
      
      // Update receiver's conversation with proper cross-role data
      let receiverConversations = users[receiverIndex].conversations || [];
      let receiverConv = receiverConversations.find(c => c.id === conversationId);
      if (!receiverConv) {
        // Get sender info for proper display
        const sender = users[senderIndex];
        receiverConv = {
          id: conversationId,
          participantId: senderUserId,
          participant: {
            name: sender.name || sender.fullName || 'Deleted User',
            role: sender.role || 'User',
            profilePhoto: sender.profilePhoto || null,
            id: senderUserId
          },
          lastMessage: message.content,
          timestamp: message.timestamp,
          unread: true,
          messages: []
        };
        receiverConversations.unshift(receiverConv);
      } else {
        receiverConv.lastMessage = message.content;
        receiverConv.timestamp = message.timestamp;
        receiverConv.unread = true;
        // Ensure conversation stays at the top
        const convIndex = receiverConversations.findIndex(c => c.id === conversationId);
        if (convIndex > 0) {
          const [removed] = receiverConversations.splice(convIndex, 1);
          receiverConversations.unshift(removed);
        }
      }
      
      // Update messages in both users' conversations with proper cross-role support
      const updateMessages = (convList, targetParticipantId, newMessage) => {
        let targetConv = convList.find(c => c.participantId === targetParticipantId);
        if (targetConv) {
          if (!targetConv.messages) targetConv.messages = [];
          // Store complete message data including sender/receiver info
          targetConv.messages.push({
            ...newMessage,
            senderInfo: {
              name: users[senderIndex].name || users[senderIndex].fullName || 'Deleted User',
              role: users[senderIndex].role || 'User',
              profilePhoto: users[senderIndex].profilePhoto || null
            },
            receiverInfo: {
              name: users[receiverIndex].name || users[receiverIndex].fullName || 'Deleted User',
              role: users[receiverIndex].role || 'User',
              profilePhoto: users[receiverIndex].profilePhoto || null
            }
          });
        }
      };
      
      updateMessages(senderConversations, receiverUserId, message);
      updateMessages(receiverConversations, senderUserId, message);
      
      // Update both users
      users[senderIndex].conversations = senderConversations;
      users[receiverIndex].conversations = receiverConversations;
      
      this.saveUsers(users);
      
      // Update current session if either user is the current user
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        if (currentUser.id === senderUserId) {
          const updatedSession = { ...currentUser, conversations: senderConversations };
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
        } else if (currentUser.id === receiverUserId) {
          const updatedSession = { ...currentUser, conversations: receiverConversations };
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
        }
      }
      
      return { sender: users[senderIndex], receiver: users[receiverIndex] };
    }
    return null;
  }

  // Get participant info by ID
  static getUserById(userId) {
    const users = this.getAllUsers();
    return users.find(u => u.id === userId);
  }

  // Search users by name, email, or username (case-insensitive)
  static searchUsers(searchTerm, excludeUserId = null) {
    const users = this.getAllUsers();
    
    if (!searchTerm || searchTerm.trim().length === 0) {
      return [];
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return users.filter(user => {
      // Exclude specific user if provided
      if (excludeUserId && user.id === excludeUserId) {
        return false;
      }
      
      // Check if user has required identification fields
      if (!user.name && !user.fullName && !user.email && !user.username) {
        return false;
      }
      
      // Search in name fields
      const nameMatch = (user.name && user.name.toLowerCase().includes(term)) || 
                       (user.fullName && user.fullName.toLowerCase().includes(term));
      
      // Search in email
      const emailMatch = user.email && user.email.toLowerCase().includes(term);
      
      // Search in username
      const usernameMatch = user.username && user.username.toLowerCase().includes(term);
      
      // Search in role
      const roleMatch = user.role && user.role.toLowerCase().includes(term);
      
      return nameMatch || emailMatch || usernameMatch || roleMatch;
    });
  }

  // Add recipe to chef's collection
  static addRecipeToChef(chefId, recipe) {
    const users = this.getAllUsers();
    const chefIndex = users.findIndex(u => u.id === chefId && u.role === 'chef');
    
    if (chefIndex !== -1) {
      if (!users[chefIndex].recipes) {
        users[chefIndex].recipes = [];
      }
      users[chefIndex].recipes.push({
        id: Date.now(),
        ...recipe,
        createdAt: new Date().toISOString()
      });
      this.saveUsers(users);
      return users[chefIndex];
    }
    return null;
  }

  // Save recipe for visitor
  static saveRecipeForUser(userId, recipe) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      // Initialize saved recipes array if it doesn't exist
      if (!users[userIndex].savedRecipes) {
        users[userIndex].savedRecipes = [];
      }
      
      // Check if recipe is already saved
      const existingIndex = users[userIndex].savedRecipes.findIndex(r => r.id === recipe.id);
      if (existingIndex !== -1) {
        return users[userIndex]; // Recipe already saved
      }
      
      // Add recipe to saved recipes
      users[userIndex].savedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        chefName: recipe.chefName,
        cuisine: recipe.cuisine,
        prepTime: recipe.prepTime,
        savedAt: new Date().toISOString()
      });
      
      this.saveUsers(users);
      
      // Update current session if this is the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedSession = { 
          ...currentUser, 
          savedRecipes: [...users[userIndex].savedRecipes] 
        };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
      }
      
      return users[userIndex];
    }
    return null;
  }

  // Remove saved recipe for user
  static removeSavedRecipeForUser(userId, recipeId) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1 && users[userIndex].savedRecipes) {
      users[userIndex].savedRecipes = users[userIndex].savedRecipes.filter(r => r.id !== recipeId);
      this.saveUsers(users);
      
      // Update current session if this is the current user
      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        const updatedSession = { 
          ...currentUser, 
          savedRecipes: [...users[userIndex].savedRecipes] 
        };
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
      }
      
      return users[userIndex];
    }
    return null;
  }

  // Get user's saved recipes
  static getUserSavedRecipes(userId) {
    const users = this.getAllUsers();
    const user = users.find(u => u.id === userId);
    return user ? (user.savedRecipes || []) : [];
  }

  // Create empty conversation for both users
  static createEmptyConversation(user1Id, user2Id) {
    const users = this.getAllUsers();
    const user1Index = users.findIndex(u => u.id === user1Id);
    const user2Index = users.findIndex(u => u.id === user2Id);
    
    if (user1Index !== -1 && user2Index !== -1) {
      const conversationId = `${Math.min(user1Id, user2Id)}-${Math.max(user1Id, user2Id)}`;
      
      // Get user info
      const user1 = users[user1Index];
      const user2 = users[user2Index];
      
      // Create conversation for user1
      let user1Conversations = users[user1Index].conversations || [];
      if (!user1Conversations.find(c => c.id === conversationId)) {
        const newConv1 = {
          id: conversationId,
          participantId: user2Id,
          participant: {
            name: user2.name || user2.fullName || 'Deleted User',
            role: user2.role || 'User',
            profilePhoto: user2.profilePhoto || null,
            id: user2Id
          },
          lastMessage: 'Start a conversation...',
          timestamp: new Date().toISOString(),
          unread: false,
          messages: []
        };
        user1Conversations.unshift(newConv1);
        users[user1Index].conversations = user1Conversations;
      }
      
      // Create conversation for user2
      let user2Conversations = users[user2Index].conversations || [];
      if (!user2Conversations.find(c => c.id === conversationId)) {
        const newConv2 = {
          id: conversationId,
          participantId: user1Id,
          participant: {
            name: user1.name || user1.fullName || 'Deleted User',
            role: user1.role || 'User',
            profilePhoto: user1.profilePhoto || null,
            id: user1Id
          },
          lastMessage: 'Start a conversation...',
          timestamp: new Date().toISOString(),
          unread: false,
          messages: []
        };
        user2Conversations.unshift(newConv2);
        users[user2Index].conversations = user2Conversations;
      }
      
      this.saveUsers(users);
      
      // Update current session if either user is the current user
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        if (currentUser.id === user1Id) {
          const updatedSession = { ...currentUser, conversations: user1Conversations };
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
        } else if (currentUser.id === user2Id) {
          const updatedSession = { ...currentUser, conversations: user2Conversations };
          localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
        }
      }
      
      return true;
    }
    return false;
  }
  
  // Mark conversation as read
  static markConversationAsRead(userId, conversationId) {
    const users = this.getAllUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      const user = users[userIndex];
      if (user.conversations) {
        const conversation = user.conversations.find(c => c.id === conversationId);
        if (conversation) {
          conversation.unread = false;
          this.saveUsers(users);
          
          // Update current session if this is the current user
          const currentUser = this.getCurrentUser();
          if (currentUser && currentUser.id === userId) {
            const updatedSession = { ...currentUser, conversations: [...user.conversations] };
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(updatedSession));
          }
          
          return conversation;
        }
      }
    }
    return null;
  }
}

export default UserService;