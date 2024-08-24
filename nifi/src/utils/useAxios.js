import { setAuthToken } from "../Redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";


//const baseURL = 'https://fuel-station-backend-production.up.railway.app';
//const baseURL = 'https://fuel-station-backend.vercel.app'
const baseURL = 'http://127.0.0.1:8000';

const useAxios = () => {
    const authTokenState = useSelector((state) => state.auth.authTokenState);
    const dispatch = useDispatch();

    const axiosInstance = axios.create({
        baseURL,
        headers: {
          Authorization: `Bearer ${authTokenState?.access}`,
        },
      });

      axiosInstance.interceptors.response.use(
        async (response) => {
            console.log('useAxios response executed without refreshing token')
          // If the request was successful, no need to refresh token
          return response;
        },
        async (error) => {
            console.log('useAxios error executed')
            console.log('authtokenState',authTokenState)
          const originalRequest = error.config;
      
          // If the error is not due to token expiration, reject with the error
          if (error.response.status !== 401) {
            return Promise.reject(error);
          }
      
          // Try to refresh the token
          try {
            const response = await axios.post(`${baseURL}/api-auth/login/refresh/`, {
              refresh: authTokenState.refresh,
            });
      
            // Update the access token and retry the original request
            const updatedAuthToken = {
              access: response.data.access,
              refresh: authTokenState.refresh,
            };
      
            localStorage.setItem('auth_token', JSON.stringify(updatedAuthToken));
            dispatch(setAuthToken(updatedAuthToken));
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

      return axiosInstance;

}

export default useAxios;