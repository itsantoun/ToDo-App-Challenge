// The App.js which is the main page of the App.
import './App.css';
import React, { useState, useEffect } from "react";
import {BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // used for routing pages
import TodoApp from './Pages/toDoApp';
import Login from './Pages/Login';
import Signup from './Pages/signup';
import { auth } from './Backend/firebase'; //implemented from google Firebase API to check wether the user is logged in or not
import { onAuthStateChanged } from "firebase/auth"; // also from google Firebase API for authentication

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => { //useEffect is used for the logout button and update the user logged in or out
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="App">

      {/* Routing paths for the pages */}
      <Router>         
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/form" element={<TodoApp user={user} />} />
          <Route path="/status" element={<TodoApp user={user} />} />
          <Route path="/" element={<TodoApp user={user} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

