// utils/tokenRefresh.js
import { auth } from '../firebase';

export const getValidToken = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    
    // Check if token exists and is not expired
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const tokenExpiry = userData.tokenExpiry || 0;
    
    // If token expires in less than 5 minutes, refresh it
    if (Date.now() >= tokenExpiry - 5 * 60 * 1000) {
      const newToken = await user.getIdToken(true);
      const updatedUserData = {
        ...userData,
        token: newToken,
        tokenExpiry: Date.now() + 55 * 60 * 1000
      };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      return newToken;
    }
    
    return userData.token;
  } catch (error) {
    console.error('Error getting valid token:', error);
    throw error;
  }
};

// Axios interceptor to automatically refresh token
export const setupTokenInterceptor = (axiosInstance) => {
  axiosInstance.interceptors.request.use(async (config) => {
    try {
      const token = await getValidToken();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Redirect to login if token refresh fails
      window.location.href = '/login';
      return Promise.reject(error);
    }
  });
};