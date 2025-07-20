import axios from "axios";
import { getToken, logout } from "./utils/auth";

const API_BASE_URL = "http://localhost:7777/api";

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      logout();
    }
    return Promise.reject(error);
  }
);

/**
 * Login API call
 * @param {string} username
 * @param {string} password
 * @returns {Promise}
 */
export const loginUser = (username, password) =>
  apiClient.post(`/auth/login`, { username, password });

/**
 * Register API call
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @param {string} phoneNumber
 * @param {string} role
 * @returns {Promise}
 */
export const registerUser = (username, email, password, fullName, phoneNumber, role) =>
  apiClient.post(`/auth/register`, { username, email, password, fullName, phoneNumber, role });

/**
 * Create a new user (admin)
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} fullName
 * @param {string} phoneNumber
 * @param {string} role
 * @returns {Promise}
 */
export const createUser = (username, email, password, fullName, phoneNumber, role) =>
  apiClient.post(`/users`, { username, email, password, fullName, phoneNumber, role });

/**
 * Update user details
 * @param {string} id
 * @param {string} username
 * @param {string} fullName
 * @param {string} phoneNumber
 * @param {string} role
 * @returns {Promise}
 */
export const updateUser = (id, username, fullName, phoneNumber, role) =>
  apiClient.put(`/users`, { id, username, fullName, phoneNumber, role });

/**
 * Get all users
 * @returns {Promise}
 */
export const getAllUsers = () => apiClient.get(`/users`);

/**
 * Get user by ID
 * @param {string} id
 * @returns {Promise}
 */
export const getUserById = (id) => apiClient.get(`/users/${id}`);

/**
 * Delete user by ID
 * @param {string} userId
 * @returns {Promise}
 */
export const deleteUserById = (userId) => apiClient.delete(`/users/${userId}`);

/**
 * Upload user profile picture
 * @param {string} userId
 * @param {File} file
 * @returns {Promise}
 */
export const uploadProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/users/${userId}/profile-picture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
      // Authorization header is set by interceptor
    },
  });
};

// Property APIs
/**
 * Get all properties for the owner
 * @returns {Promise}
 */
export const getOwnerProperties = () => apiClient.get('/property/get-all-owner-properties');

/**
 * Create a new property with images (multipart/form-data)
 * @param {object} data - property fields
 * @param {File[]} images - array of image files
 * @returns {Promise}
 */
export const createProperty = (data, images = []) => {
  const formData = new FormData();
  // Map frontend field names to backend expected names
  if (data.title || data.roomTitle) formData.append('title', data.title || data.roomTitle);
  if (data.description) formData.append('description', data.description);
  if (data.propertyType) formData.append('propertyType', data.propertyType);
  if (data.address) formData.append('address', data.address);
  if (data.roomCount) formData.append('roomCount', data.roomCount);
  if (data.rentPrice) formData.append('rentPrice', data.rentPrice);
  if (data.isAvailable !== undefined) formData.append('isAvailable', data.isAvailable);
  if (data.ownerId) formData.append('ownerId', data.ownerId);
  if (data.amenities && Array.isArray(data.amenities)) {
    data.amenities.forEach((a) => formData.append('amenities', a));
  }
  // Only append non-empty files
  images.filter(f => f && f.size > 0).forEach((file) => formData.append('images', file));
  // Debug log: show all form data entries
  for (let pair of formData.entries()) {
    console.log('FormData:', pair[0], pair[1]);
  }
  return apiClient.post('/property', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });
};

/**
 * Update a property
 * @param {object} data
 * @returns {Promise}
 */
export const updateProperty = (data) => apiClient.put('/property', data);

/**
 * Delete a property by ID
 * @param {string} id
 * @returns {Promise}
 */
export const deleteProperty = (id) => apiClient.delete(`/property/${id}`);

/**
 * Get property by ID
 * @param {string} propertyId
 * @returns {Promise}
 */
export const getPropertyById = (propertyId) => apiClient.get(`/property/${propertyId}`);