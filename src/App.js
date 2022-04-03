import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import AdminLayout from "layouts/Admin.js";

import Login from './views/Login.js';

function getToken() {
  const tokenString = localStorage.getItem('token');
  return tokenString;
}

export default function App() {
  const token = getToken();

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={()=> <Login token={token} />} />
        <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
        <Redirect from="/" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}
