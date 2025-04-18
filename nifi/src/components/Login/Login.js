import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { UseReadingcontext } from '../../Readingcontext';
import { useDispatch } from 'react-redux';
import { setAuthToken } from '../../Redux/AuthSlice';

const Login = () => {

  const [username,setUsername] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState()

  const dispatch = useDispatch();
  const {api} = UseReadingcontext()

  const navigate = useNavigate();

  const handleLogin = () => {
    axios.post(api+'/api-auth/login/', { username, password })
        .then(response => {
            console.log('response.data',response.data);
            // Store token in localStorage
            localStorage.setItem('auth_token', JSON.stringify(response.data));
            // Update Redux state
            dispatch(setAuthToken(response.data));
            // Navigate to home
            navigate('/home');
        })
        .catch(err => {
            setError(err.response.data.error);
        });
  }
  

  return (
    <div className="baseContainer">
          <div className="login-container"> 
            <h2>Login</h2>
            <div className='inputs'>
                <input
                  type="text"
                  placeholder="Enter Username"
                  id="username"
                  name="username"
                  value={username}
                  onChange={(e)=>{setUsername(e.target.value)}}
                />
                <input
                  type="password"
                  placeholder="Password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                />
            </div>
            <div className="login-btns">
              <button onClick={handleLogin}>Login</button>
              <Link to="/register">
                <button className="register-button">Register</button>
              </Link>
            </div>
          </div>
    </div>
  );
};

export default Login;
