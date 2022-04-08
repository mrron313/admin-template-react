import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";

import Login from './views/Login';

export default function App() {
  const [token, setToken] = useState('');
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    setToken(tokenString);
  };

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={()=> <Login getToken={getToken} token={token} />} />
        <Route path="/admin" render={(props) => <AdminLayout getToken={getToken} token={token} {...props} />} />
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}
