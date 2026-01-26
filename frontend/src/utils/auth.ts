// Authentication utility functions

/**
 * Checks if the user is authenticated and token is not expired.
 * @returns {boolean}
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  // Optional: Check for token expiry if stored
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      const parsed = JSON.parse(userData);
      if (parsed.exp && Date.now() >= parsed.exp * 1000) {
        // Token expired
        logout();
        return false;
      }
    } catch (e) {
      // Invalid JSON, treat as not authenticated
      return false;
    }
  }
  return true;
};

/**
 * Gets the user data object from localStorage.
 * @returns {object|null}
 */
export const getUserData = (): any => {
  const userData = localStorage.getItem('userData');
  if (!userData) return null;
  try {
    return JSON.parse(userData);
  } catch (e) {
    return null;
  }
};

/**
 * Gets the JWT token from localStorage.
 * @returns {string|null}
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Logs out the user and redirects to login page.
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  window.location.href = '/';
};

/**
 * Gets the user's role from userData.
 * @returns {string|null}
 */
export const getUserRole = (): string | null => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

/**
 * Checks if the user is an admin.
 * @returns {boolean}
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'ADMIN';
};

/**
 * Checks if the user is an owner.
 * @returns {boolean}
 */
export const isOwner = (): boolean => {
  return getUserRole() === 'OWNER';
};

/**
 * Checks if the user is a renter.
 * @returns {boolean}
 */
export const isRenter = (): boolean => {
  return getUserRole() === 'RENTER';
};

/**
 * Updates the user's profile picture URL in localStorage.
 * @param {string} newUrl
 */
export const updateUserProfilePictureUrl = (newUrl: string): void => {
  const userData = getUserData();
  if (!userData) return;
  const updatedUser = { ...userData, profilePictureUrl: newUrl };
  localStorage.setItem("userData", JSON.stringify(updatedUser));
};
