

import { auth } from './firebase';

let lastActiveTime = Date.now();

export const updateLastActiveTime = () => {
  lastActiveTime = Date.now();
};

export const checkSessionExpiration = () => {
  const inactiveThreshold = 2 * 60 * 60 * 1000; // 2 hours in milliseconds


  if (Date.now() - lastActiveTime >= inactiveThreshold) {
    // console.log('User inactive for 5 minutes. Logging out...');
    
    // Perform logout or implement re-authentication logic
    auth.signOut().then(() => {
      // console.log('User logged out.');
      // Additional logic after logout if needed
    }).catch((error) => {
      console.error('Error logging out:', error);
    });
  } else {
    // console.log('User is still active.');
  }
};

// Example: Update last active time when user interacts with the application
document.addEventListener('mousemove', updateLastActiveTime);
document.addEventListener('keypress', updateLastActiveTime);

