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
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      logout();
    }
    return Promise.reject(error);
  }
);

// Login API call
export const loginUser = async (username, password) => {
    return apiClient.post(`/auth/login`, {username, password});
};

// Register API call
export const registerUser = async (username, email, password, fullName, phoneNumber, role) => {
    return apiClient.post(`/auth/register`, {username, email, password, fullName, phoneNumber, role});
};

// creation for users
export const createUser = async (username, email, password, fullName, phoneNumber, role) => {
    return apiClient.post(`/users`, {username, email, password, fullName, phoneNumber, role});
}

// update users
export const updateUser = async(id, username, fullName, phoneNumber, role) => {
    return apiClient.put(`/users`,{id, username, fullName, phoneNumber, role})
}

// get all users
export const getAllUsers = async() => {
    return apiClient.get(`/users`)
}

// get users by id
export const getUserById = async(id) => {
    return apiClient.get(`/users/${id}`)
}

// delete user by id
export const deleteUserById = async(userId) => {
    return apiClient.delete(`/users/${userId}`)
}

export const uploadProfilePicture = (userId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  return apiClient.post(`/users/${userId}/profile-picture`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
};