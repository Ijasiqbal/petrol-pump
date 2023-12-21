import axios from 'axios';
//const baseURL = 'http://127.0.0.1:8000';
const baseURL = 'https://fuel-station-backend-production.up.railway.app/';


let authToken = JSON.parse(localStorage.getItem('auth_token'));
const axiosInstance = axios.create({
  baseURL,
  headers: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('auth_token'))?.access}`,
  },
});

axiosInstance.interceptors.response.use(
  async (response) => {
    // If the request was successful, no need to refresh token
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is not due to token expiration, reject with the error
    if (error.response.status !== 401) {
      return Promise.reject(error);
    }

    // Try to refresh the token
    try {
        authToken = JSON.parse(localStorage.getItem('auth_token'));
      const response = await axios.post(`${baseURL}api-auth/login/refresh/`, {
        refresh: authToken.refresh,
      });

      // Update the access token and retry the original request
      const updatedAuthToken = {
        access: response.data.access,
        refresh: authToken.refresh,
      };

      localStorage.setItem('auth_token', JSON.stringify(updatedAuthToken));
      authToken = updatedAuthToken;
      originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

      return axios(originalRequest);
    } catch (refreshError) {
      // Handle refresh error (e.g., redirect to login page)
      window.location.replace('/login');


      console.error('Failed to refresh token:', refreshError);
      // You might want to redirect to the login page or handle the error in another way
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
