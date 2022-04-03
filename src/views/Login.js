
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

async function loginUser(credentials) {
  var data = JSON.stringify({
    "email": credentials.username,
    "password": credentials.password
  });
  
  var config = {
    method: 'put',
    url: 'https://us-central1-links-app-d5366.cloudfunctions.net/control_panel/login',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  axios(config)
  .then(function (response) {
    localStorage.setItem('token', response.data);
  })
  .catch(function (error) {
    console.log(error);
  });
}
 
export default function Login({ token }) {
  const history = useHistory();
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    await loginUser({
      username,
      password
    });
  }

  useEffect(() => {
    if (token) {
      history.push('/admin/menus');
    } else {
      history.push('/login');
    }
  }, [token])
   
  return(
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input type="text" onChange={e => setUserName(e.target.value)}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" onChange={e => setPassword(e.target.value)}/>
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}