import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

const Authenticated = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken) {
        // Verify the access token
        try {
          const response = await fetch(`${API_BASE_URL}/authentication/verify`, {
            method: 'GET',
            headers: { 'x-access-token': accessToken },
          });

          if (response.ok) {
            return;
          }

        //   // If access token is not valid, try refreshing
        //   if (refreshToken) {
        //     const refreshResponse = await fetch(`${API_BASE_URL}/authentication/refresh`, {
        //       method: 'GET',
        //       headers: { 'x-refresh-token': refreshToken },
        //     });

        //     if (refreshResponse.ok) {
        //       const data = await refreshResponse.json();
        //       localStorage.setItem('accessToken', data.accessToken);
        //       return;
        //     }
        //   }
        } catch (error) {
          console.error('Session check failed:', error);
        }
      }

      navigate('/'); // Redirect to the login screen if session is not valid
    };

    checkSession();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/'); // Redirect to the login screen
  };

  const handleRefresh = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      setMessage('No refresh token found');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/authentication/refresh`, {
        method: 'GET',
        headers: { 'x-refresh-token': refreshToken },
      });

      if (!response.ok) {
        const errorData = await response.text();
        const errorMessage = errorData ? JSON.parse(errorData).message : 'An error occurred';
        setMessage(errorMessage);
        return;
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      setMessage('Access token refreshed successfully');
    } catch (error) {
      console.error('Refresh failed:', error);
      setMessage('An error occurred while refreshing the token. Please try again.');
    }
  };

  const handleVerify = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      setMessage('No access token found');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/authentication/verify`, {
        method: 'GET',
        headers: { 'x-access-token': accessToken },
      });

      if (!response.ok) {
        const errorData = await response.text();
        const errorMessage = errorData ? JSON.parse(errorData).message : 'An error occurred';
        setMessage(errorMessage);
        return;
      }

      const data = await response.json();
      setMessage(`Token verified. User ID: ${data.id}`);
    } catch (error) {
      console.error('Verification failed:', error);
      setMessage('An error occurred while verifying the token. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Authenticated Screen</h1>
      <p>You are successfully logged in.</p>
      <button onClick={handleLogout} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Logout
      </button>
      <button onClick={handleRefresh} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Refresh Token
      </button>
      <button onClick={handleVerify} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Verify Token
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Authenticated;
