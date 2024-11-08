import React, { useState, useEffect } from 'react';
import style from './App.module.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:3000';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [formType, setFormType] = useState<'login' | 'register'>('login');
  const navigate = useNavigate();

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
            navigate('/authenticated'); 
            return;
          }

          // // If access token is not valid, try refreshing
          // if (refreshToken) {
          //   const refreshResponse = await fetch(`${API_BASE_URL}/authentication/refresh`, {
          //     method: 'GET',
          //     headers: { 'x-refresh-token': refreshToken },
          //   });

          //   if (refreshResponse.ok) {
          //     const data = await refreshResponse.json();
          //     localStorage.setItem('accessToken', data.accessToken);
          //     navigate('/authenticated'); 
          //     return;
          //   }
          // }
        } catch (error) {
          console.error('Session check failed:', error);
        }
      }
    };

    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/authentication/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        navigate('/authenticated');
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('An error occurred during login');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage('Email and password are required');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/authentication/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        const errorMessage = errorData ? JSON.parse(errorData).message : 'An error occurred';
        setMessage(errorMessage);
        return;
      }

      setMessage('Registration successful! You can now log in.');
      setFormType('login'); // Switch to login form after registration
    } catch (error) {
      console.error('Registration failed:', error);
      setMessage('An error occurred while registering. Please try again.');
    }
  };

  return (
    <div className={style.container}>
      {formType === 'login' ? (
        <form className={style.loginContainer} onSubmit={handleLogin}>
          <input
            className={style.loginInput}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={style.loginInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={style.loginButton}>Login</button>
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={() => setFormType('register')}>
              Register
            </button>
          </p>
        </form>
      ) : (
        <form className={style.loginContainer} onSubmit={handleRegister}>
          <input
            className={style.loginInput}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={style.loginInput}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className={style.loginButton}>Register</button>
          <p>
            Already have an account?{' '}
            <button type="button" onClick={() => setFormType('login')}>
              Login
            </button>
          </p>
        </form>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
