// Signup.js is the part of the app to create an account with an email and password with the use of Google Authentication API which takes the name of the user the email and password.
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import {useNavigate,Link } from 'react-router-dom';
import { auth } from '../Backend/firebase';
import '../CSS/signup.css';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {   //used to create the account after entering the user information
    e.preventDefault();
    setError('');
    try {
      await createUserWithEmailAndPassword(auth, email, password);  
      alert('Account created successfully'); //a confirmation alert after successfull creation of the account 
      navigate("/"); //then the user is navigate to the todoListApp
    } catch (error) {
      //checks if the user already exists based on their email and the ability to login
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError(<>Email address is already in use. 
           <Link to="/login" className='linkto'> Log in instead?</Link></>
           );
          
          break;
          // errors made by users are also being handled such as weak password, invalid email format or address, or connection issues...
        case 'auth/weak-password':
          setError('Password is too weak');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError('An error occurred during signup');
      }
    }
  };

  return (

    // Sign up form which has the name of the user, email and password
    <div className="signup-wrapper">
      <form className="signup-inputs" onSubmit={handleSignup}>
        <h2>Create an Account!</h2>
        <div className="signup-items">
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="signup-items">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="signup-items">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button className='signup-btn' type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
