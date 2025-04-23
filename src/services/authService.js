import { getApperClient, getApperUI } from './apperClient';

// Get the current logged-in user
export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    try {
      // Check if there's a user already stored in sessionStorage
      const userJson = sessionStorage.getItem('apperUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        resolve(user);
      } else {
        // No user found
        resolve(null);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      reject(error);
    }
  });
};

// Login user using ApperUI
export const loginUser = () => {
  return new Promise((resolve, reject) => {
    try {
      const apperClient = getApperClient();
      const ApperUI = getApperUI();
      
      if (!apperClient || !ApperUI) {
        reject(new Error('Apper SDK not initialized'));
        return;
      }
      
      // Create a container for the login UI
      const loginContainer = document.createElement('div');
      loginContainer.id = 'apper-auth-container';
      loginContainer.style.position = 'fixed';
      loginContainer.style.zIndex = '1000';
      loginContainer.style.top = '0';
      loginContainer.style.left = '0';
      loginContainer.style.width = '100%';
      loginContainer.style.height = '100%';
      loginContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      loginContainer.style.display = 'flex';
      loginContainer.style.justifyContent = 'center';
      loginContainer.style.alignItems = 'center';
      
      const authDiv = document.createElement('div');
      authDiv.id = 'authentication';
      authDiv.className = 'bg-white dark:bg-surface-800 rounded-lg shadow-lg p-4 w-full max-w-md';
      
      loginContainer.appendChild(authDiv);
      document.body.appendChild(loginContainer);
      
      // Setup the ApperUI login
      ApperUI.setup(apperClient, {
        target: '#authentication',
        clientId: apperClient.canvasId,
        view: 'both', // Show both login and signup options
        onSuccess: function(user) {
          // Store user in sessionStorage for later retrieval
          sessionStorage.setItem('apperUser', JSON.stringify(user));
          
          // Remove the login container
          document.body.removeChild(loginContainer);
          
          // Resolve the promise with the user
          resolve(user);
        },
        onError: function(error) {
          console.error('Authentication error:', error);
          
          // Remove the login container on error
          if (document.body.contains(loginContainer)) {
            document.body.removeChild(loginContainer);
          }
          
          reject(error);
        }
      });
      
      // Show the login UI
      ApperUI.showLogin('#authentication');
    } catch (error) {
      console.error('Error during login:', error);
      reject(error);
    }
  });
};

// Logout user
export const logoutUser = () => {
  return new Promise((resolve) => {
    // Remove user from sessionStorage
    sessionStorage.removeItem('apperUser');
    resolve();
  });
};