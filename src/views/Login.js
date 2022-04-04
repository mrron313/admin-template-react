
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Login.css";

import Alert from 'react-bootstrap/Alert'
 
export default function Login({ token, getToken }) {
  const history = useHistory();
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

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
    
    setLoading(true);
    axios(config)
    .then(function (response) {
      localStorage.clear();
      localStorage.setItem('token', response.data);
      getToken();
      setShow(false);
      setMessage('');
      setLoading(false);
    })
    .catch(function (error) {
      setShow(true);
      setMessage('Incorrect Credentials!');
      setLoading(false);
      console.log(error);
    });
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await loginUser({
      username,
      password
    });
  }

  const validateForm = () => {
    return username.length > 0 && password.length > 0;
  }

  useEffect(() => {
    if (token) {
      history.push('/admin/stores');
    }
  }, [token]);
   
  return(
    <div className="Login">
      <Form onSubmit={handleSubmit}>

        <Alert show={show} variant="danger">
          <p> { message } </p>
        </Alert>

        <Form.Group size="lg" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={username}
            onChange={e => setUserName(e.target.value)}
          />
        </Form.Group>
        <Form.Group size="lg" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className='mt-2' block size="lg" type="submit" disabled={!validateForm() || loading}>
          { loading? 'Loading..' : 'Login' }
        </Button>
      </Form>
    </div>
  )
}