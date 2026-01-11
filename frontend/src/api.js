import axios from "axios";
import {getToken, logout} from "./utils/auth";

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
        // Only handle 401 errors for authenticated requests (not login attempts)
        if (error.response?.status === 401 && error.config.url !== '/auth/login') {
            // Token expired or invalid for authenticated requests
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
    apiClient.post(`/auth/login`, {username, password});

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
    apiClient.post(`/auth/register`, {username, email, password, fullName, phoneNumber, role});

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
    apiClient.post(`/users`, {username, email, password, fullName, phoneNumber, role});

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
    apiClient.put(`/users`, {id, username, fullName, phoneNumber, role});

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
 * Get all properties for owner
 * @returns {Promise}
 */
export const getOwnerProperties = () => apiClient.get('/property/get-all-owner-properties');

/**
 * Create a new property
 * @param {object} data
 * @returns {Promise}
 */
export const createProperty = (data) => {
    return apiClient.post('/property', data);
};

/**
 * Upload property images
 * @param {string} propertyId
 * @param {File[]} images
 * @returns {Promise}
 */
export const uploadPropertyImages = (propertyId, images = []) => {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    return apiClient.post(`/property/${propertyId}/images`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const createPropertyWithImages = (propertyData, images = []) => {
    const formData = new FormData();

    formData.append(
        "property",
        new Blob([JSON.stringify(propertyData)], { type: "application/json" })
    );

    (images || []).forEach((img) => formData.append("images", img));

    return apiClient.post('/property/with-images', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Update a property
 * @param {object} data
 * @returns {Promise}
 */
export const updateProperty = (data) => apiClient.put('/property', data);

/**
 * Delete a property
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
 * Get all properties
 * @returns {Promise}
 */
export const getAllProperties = () => apiClient.get('/property');

/**
 * Search properties with filters
 * @param {object} filterRequest
 * @returns {Promise}
 */
export const searchProperties = (filterRequest) => apiClient.post('/property/search-property', filterRequest);

// Booking APIs
/**
 * Get all bookings for a renter
 * @param {string} renterId
 * @returns {Promise}
 */
export const getBookingsByRenterId = (renterId) => apiClient.get(`/booking/renter/${renterId}`);

/**
 * Get all bookings for an owner
 * @param {string} ownerId
 * @returns {Promise}
 */
export const getBookingsByOwnerId = (ownerId) => apiClient.get(`/booking/owner/${ownerId}`);

/**
 * Get all bookings (admin only)
 * @returns {Promise}
 */
export const getAllBookings = () => apiClient.get('/booking');

/**
 * Get booking by ID
 * @param {string} bookingId
 * @returns {Promise}
 */
export const getBookingById = (bookingId) => apiClient.get(`/booking/${bookingId}`);

/**
 * Create a new booking
 * @param {object} bookingData - booking fields
 * @returns {Promise}
 */
export const createBooking = (bookingData) => apiClient.post('/booking', bookingData);

/**
 * Update a booking
 * @param {object} bookingData
 * @returns {Promise}
 */
export const updateBooking = (bookingData) => apiClient.put('/booking', bookingData);

/**
 * Delete a booking
 * @param {string} bookingId
 * @returns {Promise}
 */
export const deleteBooking = (bookingId) => apiClient.delete(`/booking/${bookingId}`);

/**
 * Cancel a booking
 * @param {string} bookingId
 * @returns {Promise}
 */
export const cancelBooking = (bookingId) => apiClient.put(`/booking/cancel/${bookingId}`);

/**
 * Approve a booking
 * @param {string} bookingId
 * @returns {Promise}
 */
export const approveBooking = (bookingId) => apiClient.put(`/booking/approve/${bookingId}`);

/**
 * reject a booking
 * @param {string} bookingId
 * @returns {Promise}
 */
export const rejectBooking = (bookingId) => apiClient.put(`/booking/reject/${bookingId}`);

/**
 * Delete a property image by imageId
 * @param {string|number} imageId
 * @returns {Promise}
 */
export const deletePropertyImage = (imageId) =>
    apiClient.delete(`/property/delete-image/${imageId}`);

// Fetch booking requests for owner
export const fetchBookingRequests = () => apiClient.get('/property/fetch-booking-request');

/**
 * Initiate eSewa payment
 * @param {object} params - { amount, referenceId, productId, successUrl, failureUrl }
 * @returns {Promise}
 */
export const initiateEsewaPayment = ({amount, referenceId, productId, successUrl, failureUrl}) =>
    apiClient.post(`/payment/initiate`, null, {
        params: {amount, referenceId, productId, successUrl, failureUrl}
    });

/**
 * Verify eSewa payment
 * @param {object} params - { amt, rid, pid }
 * @returns {Promise}
 */
export const verifyEsewaPayment = ({amt, rid, pid}) =>
    apiClient.post(`/payment/verify`, null, {
        params: {amt, rid, pid}
    });

/**
 * eSewa Token-based Inquiry
 * @param {string} requestId
 * @returns {Promise}
 */
export const esewaInquiry = (requestId) =>
    apiClient.get(`/payment/inquiry/${requestId}`);

/**
 * eSewa Token-based Payment
 * @param {object} params - { request_id, amount, transaction_code, package_id }
 * @returns {Promise}
 */
export const esewaTokenPayment = ({request_id, amount, transaction_code, package_id}) =>
    apiClient.post(`/payment/payment`, {request_id, amount, transaction_code, package_id});

/**
 * eSewa Token-based Status Check
 * @param {object} params - { request_id, amount, transaction_code }
 * @returns {Promise}
 */
export const esewaStatusCheck = ({request_id, amount, transaction_code}) =>
    apiClient.post(`/payment/status`, {request_id, amount, transaction_code});

// request otp for forget password
export const requestOpt = (emailOrUsername) => {
    return apiClient.post(`/auth/request-otp?emailOrUsername=${encodeURIComponent(emailOrUsername)}`);
};

// verify otp

export const verifyOtp = (emailOrUsername, otp) => {
    return apiClient.post(`/auth/verify-otp?emailOrUsername=${encodeURIComponent(emailOrUsername)}&otp=${encodeURIComponent(otp)}`);
};

// For forgot password / OTP flow
export const resetPassword = ({ emailOrUsername, newPassword, confirmPassword }) => {
    return apiClient.post('/auth/reset-password', {
        emailOrUsername,
        newPassword,
        confirmPassword
    });
};

// For logged-in users (change password)
export const changePassword = ({ emailOrUsername, currentPassword, newPassword, confirmPassword }) => {
    return apiClient.post('/user/change-password', {
        emailOrUsername,
        currentPassword,
        newPassword,
        confirmPassword
    });
};
