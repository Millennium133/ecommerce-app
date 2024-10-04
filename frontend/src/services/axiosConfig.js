import axios from 'axios';

// Set default Axios configuration
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`, // Replace with your API base URL
});
// Set the Authorization header dynamically using localStorage token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosInstance;
