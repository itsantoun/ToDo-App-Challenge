// Form.js is the form part of the toDo App where users are asked to fill information about their task to be done
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { MdOutlineCalendarMonth } from "react-icons/md";
import '../CSS/Form.css';
import { db, auth } from '../Backend/firebase';
import { collection, addDoc } from 'firebase/firestore';

function Form({ todoList, setTodoList }) {

  const [dueDate, setDueDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [message, setMessage] = useState("");
  
  const today = new Date();  //initializing the date
  today.setHours(0, 0, 0, 0);

  const tileDisabled = ({ date }) => { //tileDisable is used down in the code to disable past days and do not let user select a past day, for example choose 22 May 2024
    return date < today;
  };
  const onChange = (newDate) => {setDueDate(newDate);}

  const toggleCalendar = () => {setShowCalendar(prevState => !prevState);}

  const handleAddTask = async () => {
    if (taskName.trim() === "") {   //check if the task name input field is empty and display an alert for the user to enter a task name since its a required field
      alert("Please enter a task name!\nFor sure you do have something to do XD")
      return;
    }

    const todoListTask = {    //The user inputs are added to this todoListTask array to be then stored in the database.
      task: taskName,
      notes: taskNote,
      date: dueDate
    };

    try {
      const docRef = await addDoc(collection(db, 'users', auth.currentUser.uid, 'tasks'), todoListTask); //Add the elements of the array toDoApp to the database

      //After successfull additiont a message is displayed and the inputs in the form are reset (set to null) and the date is resetted to the current day
      setMessage("Good Luck! Task added successfully:) ");
      setTaskName("");    
      setTaskNote("");
      setDueDate(new Date());

      setTimeout(() => {   //The message disappears after 2 seconds
        setMessage("");
      }, 2000);

      setTimeout(() => { //the page is reloaded in order for the status.js to update the list the tasks by adding the current task added from the user
        window.location.reload();
      }, 3000);

      //error handling while adding tasks in case something occured like connection issues...
    } catch (error) {
      console.error("Error adding document: ", error);    
      setMessage("An error occurred while adding the task: " + error.message);
    }
  }

  return (

    // The form input that is used to add task. Like Task name (Topic name), notes (small description of the task and highlight important stuff to focus on)
    <div className='todo-wrapper'>
      <h2 className='header2'>To-Do Task</h2>
      <div className='todo-input'>

        <div className='todo-inputs'>
          <label>Task Name: </label>
          <input type='text'
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder='What are you working on?'
            required></input>
        </div>

        <div className='todo-inputs'>
          <label>Notes: </label>
          <input type='text'
            value={taskNote}
            onChange={(e) => setTaskNote(e.target.value)}
            placeholder='Add some information'></input>
        </div>

      </div>

      <div className='todo-inputs'>
          <label>Due Date: </label>
          <p className='due-date'>{dueDate.toDateString()}</p>   {/*  displaying the date selected from the calendar */}
          
          <MdOutlineCalendarMonth className='calendar-icon' onClick={toggleCalendar} />   {/* Calendar is being displayed,  the onClick={toggleCalendar}  is used to show the calendar when selected*/}
        </div>

      {showCalendar && (    //show calendar is a function implemented when user presses on the calendar icon, here the calendar is displayed
        <div className='calendar-wrapper'>
          <Calendar
            onChange={onChange} //set the date based on users selection.
            value={dueDate}   //selected date from the user
            minDate={today} //Today's date
            tileDisabled={tileDisabled} // To avoid the user to choose a previous data, this function disables the previous dates for example today is 26 May 2024 everything before 26 may is disabled.
            tileClassName={({ date }) => date < today ? 'react-calendar__tile--disabled' : null}
          />
        </div>
      )}

{/* Message is being displayed when the task is being added (successful message)*/}
      {message && (
        <div className='message'>
          <p>{message}</p>
        </div>
      )}

{/* Add Task button adds the tasks that are store in the array todoListTask */}
      <div className='button-container'>
        <button className='add-btn' onClick={handleAddTask}>Add Task</button>
      </div>
    </div>
  );
}

export default Form;
