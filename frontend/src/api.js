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
 * Create a new property (details only, no images)
 * @param {object} data - property fields
 * @returns {Promise} - resolves to propertyId
 */
export const createProperty = (data) => {
  return apiClient.post('/property', data)
    .then(res => res.data.data); // assuming propertyId is in data
};

/**
 * Upload images for a property
 * @param {string|number} propertyId
 * @param {File[]} images
 * @returns {Promise}
 */
export const uploadPropertyImages = (propertyId, images = []) => {
  const formData = new FormData();
  images.forEach((img) => formData.append('images', img));
  return apiClient.post(`/property/${propertyId}/images`, formData, {
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

/**
 * Delete a property image by imageId
 * @param {string|number} imageId
 * @returns {Promise}
 */
export const deletePropertyImage = (imageId) =>
  apiClient.delete(`/property/delete-image/${imageId}`);