// In this page, both pages form.js and status.js are being merged into one page which forms the app.
// Before accessing the page the user must be logged in, since each user has their own/dedicated tasks added and implemented.
// The page also contains a logout button to end the session and a loading function to show that the page is processing the log out operation
import React, { useState, useEffect } from "react";
import { auth, signOut } from '../Backend/firebase';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import Login from "./Login";
import Form from "./Form";
import Status from "./Status";

function TodoApp() {
  const [todoList, setTodoList] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => { // the hadnle logout is linked to a button that will end the user session.
    try {
      setLoading(true); //a loading status to show the processing of logout
      await signOut(auth); // the Google authntication API used for logout
      navigate('/login');  //after logging out the user is redirected to the login page
    } catch (error) {
      // handeling errors in case something went wrong (connection issues...)
      console.error("Error logging out: ", error);
      setMessage("An error occurred while logging out: " + error.message);
    } finally {
      setLoading(false); //the loading status is not invoked
    }
  }

  useEffect(() => { 
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    // the content is being displayed after successful login with a welcome message and a small type writer text with of course the Form.js and Status.js
    <div className="App">
      {loading ? ( 
        <div>Loading...</div>
      ) : (
        <>
          {user ? (
            <>
              <h1 className="welcome">Hey there! </h1>
              <div class="typewriter">
                <h2>What are your plans for today?</h2>
              </div>

              <button className='logout-btn' onClick={handleLogout}>Logout</button>
              <div className='form-positioning'>
                <Form todoList={todoList} setTodoList={setTodoList} />
              </div>

              <div className='status-positioning'>
                <Status todoList={todoList} />
              </div>
            </>
          ) : (
            <Login />
          )}
        </>
      )}
    </div>
  );
}

export default TodoApp;
