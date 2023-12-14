import { useState, useEffect } from 'react';
import axios from 'axios';
import { UseReadingcontext } from '../Readingcontext';

// Custom hook for making authenticated GET requests with Axios
function useAxiosGet(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { api } = UseReadingcontext();

  function isAccessTokenExpired(accessToken) {
    try {
      // Parse the access token (assuming it's in JWT format)
      const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));

      // Get the expiration time from the payload (in seconds)
      const expirationTime = tokenPayload.exp;

      // Check if the token is expired by comparing the expiration time with the current time (in seconds)
      return expirationTime < Date.now() / 1000;
    } catch (error) {
      // Handle parsing errors or invalid tokens
      console.log('Error: ' + error.message);
      console.log('Access token is expired');
      return true; // Token is considered expired in case of errors
    }
  }

  async function refreshAccessToken(refreshToken) {
    try {
      const response = await axios.post(api + 'api-auth/login/refresh', {
        refresh: refreshToken,
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to refresh access token');
      }
  
      const newAccessToken = response.data.access;
      const newRefreshToken = response.data.refresh;
      localStorage.setItem('access', newAccessToken);
      localStorage.setItem('refresh', newRefreshToken);
      return newAccessToken;
    } catch (error) {
      alert('Failed to refresh access token: ' + error.message);
      throw error; // Rethrow the error for the calling function to handle if needed
    }
  }

  async function fetchData() {
    let token = localStorage.getItem('access');

    // Check if the access token is present
    if (!token) {
      // Handle the case where the token is not available by navigating to /login
      window.location.href = '/login';
      alert('Authentication token is missing');
      return;
    }

    // Check if the access token is expired (you'll need to implement this logic)
    const isTokenExpired = isAccessTokenExpired(token);

    if (isTokenExpired) {
      // If the access token is expired, use the refresh token to obtain a new access token
      const refreshToken = localStorage.getItem('refresh');
      if (!refreshToken) {
        // Handle the case where the refresh token is missing by navigating to /login
        window.location.href = '/login';
        alert('Refresh token is missing');
        return;
      }

      try {
        // Use the refresh token to obtain a new access token (implement this logic)
        const newAccessToken = await refreshAccessToken(refreshToken);

        // Update the access token
        token = newAccessToken;
      } catch (refreshError) {
        // Handle the case where the refresh token is invalid or expired
        // You can navigate to /login or perform other actions
        window.location.href = '/login';
        alert('Refresh token is invalid or expired');
        return;
      }
    }

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status !== 200) {
        alert('Network response was not ok');
        return;
      }

      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
      alert(error.message); 
    }
  }

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useAxiosGet;
