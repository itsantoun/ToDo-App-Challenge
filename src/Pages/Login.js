// The login page is the first page before any other operation which lets users access their own todo list app.
// Note that to perform the Login authentication, I used the Google Authentication API
import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { auth } from '../Backend/firebase';
import { signInWithEmailAndPassword } from "firebase/auth";
import '../CSS/Login.css';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {   //the handlSubmit is used to check if the email and password entered matches the ones in the database
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); //navigate to the main page which is the toDoListApp
    } catch (err) {
      setError("Failed to log in");
    }
  };

  return (
    // The login form to enter the username and password with a submit button
    <div className="login-wrapper">
      <form className="login-inputs" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="error">{error}</p>}
        <div className="login-items">
          <label htmlFor="email">Email: </label>
          <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="login-items">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className='login-btn' type="submit">Login</button>
      </form>
     
     <p className='parag'> Dont have an account yet? <Link to="/signup" className='link-format'>Create one!</Link></p>   {/* The user has the ability to create an account*/}
    </div>
  );
}

export default Login;
