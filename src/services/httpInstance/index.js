import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
const baseUrl = import.meta.env.VITE_BASE_URL;
const baseUrl2 = import.meta.env.VITE_BASE_URL2;
const baseUrl3 = import.meta.env.VITE_BASE_URL2;
const BASE_URL = baseUrl;
const BASE_URL_MS = baseUrl2;
const BASE_URL_MERISEHAT = baseUrl3;

let isToastShown = false; // Prevent multiple toasts
// Function to handle 401 & 403 errors globally
const handleAuthError = () => {
  if (!isToastShown) {
    isToastShown = true;
    toast.error('Login expired, redirecting...');
    const Authorization = Cookies.get('Authorization');
    if (Authorization) {
      Cookies.remove('Authorization');
    }
    setTimeout(() => {
      isToastShown = false; // Reset flag after redirect
      window.location.href = '/login';
    }, 500);
  }
};
// Function to handle network errors
const handleNetworkError = (response) => {
  if (response?.message === 'Network Error') {
    toast.error(response?.data?.message || 'Network Error');
  }
};
// Create API instances
export const API = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
});
export const API_MS = axios.create({
  baseURL: BASE_URL_MS,
  timeout: 60000,
});
export const API_MERISEHAT = axios.create({
  baseURL: BASE_URL_MERISEHAT,
  timeout: 60000,
});
// Function to apply interceptors
const applyInterceptors = (apiInstance) => {
  apiInstance.interceptors.request.use(
    (config) => {
      const token = Cookies.get('Authorization');
      if (token) {
        config.headers['Authorization'] = token;
        config.headers['Platform'] = 'Web';
        config.headers['server-token'] = 'green@123';
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  apiInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { response } = error;
      if (response?.status === 403 || response?.status === 401) {
        handleAuthError();
      }
      handleNetworkError(response);
      return response ? response : Promise.reject(error);
    }
  );
};
// Apply interceptors to all API instances
applyInterceptors(API);
applyInterceptors(API_MS);
applyInterceptors(API_MERISEHAT);
export default API;