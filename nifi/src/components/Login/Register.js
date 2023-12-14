import axios from 'axios';
import { useState } from 'react';
import { UseReadingcontext } from '../../Readingcontext';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [error,setError] = useState()

    const navigate = useNavigate();

    const {api} = UseReadingcontext()

    const handleRegister = () => {
      axios.post(api+'api-auth/register/', { username, password })
          .then(response => {
              console.log(response.data);
              // Handle a successful registration, e.g., redirect the user.
              navigate('/login');
          })
          .catch(err => {
              setError(err.response.data.error);
          });
  };

    

    return ( 
        <div className="login-container"> 
          <h2>Login</h2>
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
          <button onClick={handleRegister}>Register</button>
        </div>
     );
}
 
export default Register;