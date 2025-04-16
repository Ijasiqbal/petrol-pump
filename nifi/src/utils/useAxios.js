import { setAuthToken, clearAuthToken } from "../Redux/AuthSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";


//const baseURL = 'https://fuel-station-backend-production.up.railway.app';
const baseURL = 'https://fuel-station-backend.vercel.app'
//const baseURL = 'http://127.0.0.1:8000';

const useAxios = () => {
    const authTokenState = useSelector((state) => state.auth.authTokenState);
    const dispatch = useDispatch();

    const axiosInstance = axios.create({
        baseURL,
        headers: {
          Authorization: authTokenState?.access ? `Bearer ${authTokenState.access}` : undefined,
        },
    });

    axiosInstance.interceptors.response.use(
        async (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;
            
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                
                try {
                    const response = await axios.post(`${baseURL}/api-auth/login/refresh/`, {
                        refresh: authTokenState?.refresh,
                    });

                    const updatedAuthToken = {
                        access: response.data.access,
                        refresh: authTokenState.refresh,
                    };

                    dispatch(setAuthToken(updatedAuthToken));
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
                    
                    return axios(originalRequest);
                } catch (refreshError) {
                    dispatch(clearAuthToken());
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
            
            return Promise.reject(error);
        }
    );

    return axiosInstance;
}

export default useAxios;