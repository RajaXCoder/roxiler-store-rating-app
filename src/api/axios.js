import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'https://rajaxroxiler-store-server.onrender.com/api', // 'https://roxiler-store-rating-app-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// Request interceptor to dynamically attach the token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token'); // Get token from cookies

    if (token) {
      config.headers['x-access-token'] = token; // Attach token to headers
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Optional: Response interceptor to handle token expiration
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       Cookies.remove('token');
//       Cookies.remove('user-role'); // Clear invalid token
//       window.location.href = '/signin'; // Redirect to login (adjust as needed)
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
