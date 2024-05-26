// This page is reponsible for checking if the user is logged in or not and if not then the user is redirected to the Login.js in order to access the app
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
