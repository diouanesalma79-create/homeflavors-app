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
}

export default UserService;