// Authentication utility functions

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUserData = () => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  window.location.href = '/login';
};

export const getUserRole = () => {
  const userData = getUserData();
  return userData ? userData.role : null;
};

export const isAdmin = () => {
  return getUserRole() === 'ADMIN';
};

export const isOwner = () => {
  return getUserRole() === 'OWNER';
};

export const isRenter = () => {
  return getUserRole() === 'RENTER';
};

export const updateUserProfilePictureUrl = (newUrl) => {
  const userData = getUserData();
  const updatedUser = { ...userData, profilePictureUrl: newUrl };
  localStorage.setItem("userData", JSON.stringify(updatedUser));
}; 