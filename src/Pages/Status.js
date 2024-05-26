// The second part of the project is called Status.js in this page, the added tasks in the database are being fetched and displayed. In addition, the user is capable of deleting a task, and mark 
//a task is done using the corresponding buttons. the Status.js filters the tasks; when the user mark a task completed the task moves from the "Pending" tab to the "Completed" Tab
// A cool feature that has been implemented is that, while liosting the tasks, the Due Dates are colored based on the due date assigned and todays date, in which if there is 1 day between the current day and 
//the due date assigned, the color is red, yellow if there are between 2 to 9 days and green for 10+ days.
//The Drag and drop has been implemented to let the user reorder the task based on their preference
import React, { useState, useEffect } from 'react';
import '../CSS/Status.css';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import { db, auth } from '../Backend/firebase';
import { collection, getDocs, deleteDoc, updateDoc, doc, query } from 'firebase/firestore';

function Status() {

  const [isComplete, setIsComplete] = useState(null); // State variable for filtering tasks
  const [completedButtonActive, setCompletedButtonActive] = useState(false); // State variable for Completed button
  const [pendingButtonActive, setPendingButtonActive] = useState(false); // State variable for Pending button
  const [allButtonActive, setAllButtonActive] = useState(true); // State variable for All button

  // const [isComplete, setIsComplete] = useState(false);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const today = new Date();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => { //fetching tasks is the Google API method used to retrieve the tasks added by the user. based on its uid in Firebase. which is a unique ID for each user.
      try {
        if (auth.currentUser) {
          const q = query(collection(db, 'users', auth.currentUser.uid, 'tasks'));
          const querySnapshot = await getDocs(q);
          const tasksData = [];
          const completedTasksData = [];
          querySnapshot.forEach((doc) => {
            const task = { id: doc.id, ...doc.data() };
            if (task.completed) {
              completedTasksData.push(task);
            } else {
              tasksData.push(task);
            }
          });
          setTodoList(tasksData);
          setCompletedTasks(completedTasksData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [auth.currentUser]);


  // Saves the ordering of the tasks even if user refreshes the page
  useEffect(() => {
    const savedTodoList = localStorage.getItem('todoList');
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    
    if (savedTodoList && savedCompletedTasks) {
      setTodoList(JSON.parse(savedTodoList));
      setCompletedTasks(JSON.parse(savedCompletedTasks));
    }
  }, []);

  // Update local storage whenever todoList or completedTasks changes
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }, [todoList]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);


  // The algorithm used to calculate the number of days between the current day and the due date, and based on the number which represents the number of days
  // the color is assigned from the css file attached.
  const dueDateColor = (dueDate) => {
    const days = 24 * 60 * 60 * 1000;
    const differenceInDays = Math.round((dueDate - today) / days);
    if (differenceInDays <= 1) {
      return 'red';
    } else if (differenceInDays > 1 && differenceInDays < 10) {
      return 'yellow';
    } else if (differenceInDays >= 10) {
      return 'green';
    } else {
      return '';
    }
  }

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("startIndex", index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const startIndex = parseInt(e.dataTransfer.getData("startIndex"));
    const draggedTask = todoList[startIndex];
    const updatedTodoList = Array.from(todoList);
    updatedTodoList.splice(startIndex, 1);
    updatedTodoList.splice(index, 0, draggedTask);
    setTodoList(updatedTodoList);
  };
  


  // The user have the ability to delete a task, a confirmation box is displayed before deletion and after confirmation the task is deleted.
  // Note: The deletion is deleted from both the List displayed and from the database as well.
  const handleDeleteTask = async (taskId) => {
    const confirmDeletion = window.confirm("Do you want to delete this task?");
    if (confirmDeletion) {
      try {
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', taskId));
  
        // Update both todoList and completedTasks state
        setTodoList(todoList.filter(task => task.id !== taskId));
        setCompletedTasks(completedTasks.filter(task => task.id !== taskId));
  
        alert("Task Deleted Successfully!");
      } catch (error) {
        alert("Error deleting the Task: " + error);
      }
    }
  };

//The completeTask is a function that is linked to the check button which refers to the completion of the task and then the task checked is moved from the Pending to completed
  const handleCompleteTask = async (taskId) => {
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid, 'tasks', taskId), { completed: true }); //updates the status of the task in the firebase from Pending to complete
      const updatedTask = todoList.find(task => task.id === taskId);  //matches the task in the todoList with the task id in the database.
      setCompletedTasks([...completedTasks, updatedTask]);
      setTodoList(todoList.filter(task => task.id !== taskId));
      alert("Good Job!!");
    } catch (error) {
      alert("Error Confirmation: " + error);
    }
  }

  return (
    <div className='todo-wrapper'>
      <h2>My To-Do list</h2>


{/* The toggle button classes are the two buttons in the my to-do list form which shows all the tasks added, the Pending tasks and the completed tasks */}
<div className="toggle-buttons">

        <button
          className={`isComplete ${allButtonActive ? 'active' : ''}`}   
          onClick={() => { setIsComplete(null); setAllButtonActive(true); setCompletedButtonActive(false); setPendingButtonActive(false); }}>
          All
        </button>

        <button
          className={`isComplete ${pendingButtonActive ? 'active' : ''}`}   
          onClick={() => { setIsComplete(false); setPendingButtonActive(true); setCompletedButtonActive(false); setAllButtonActive(false); }}>
          Pending
        </button>

        <button
          className={`isComplete ${completedButtonActive ? 'active' : ''}`}
          onClick={() => { setIsComplete(true); setCompletedButtonActive(true); setPendingButtonActive(false); setAllButtonActive(false); }}>
          Completed
        </button>

       
      </div>

      <div className='todo-list'>
        {/* {isComplete  //checker implemented previously in the code that checks weither the task is maked completed  */}
        {isComplete === null // Check if isComplete state is null, indicating to display all tasks
  ? todoList.concat(completedTasks).map((todo, index) => (
      // Render all tasks, both pending and completed
      <div className={`todo-list-items ${dueDateColor(todo.date.toDate()) === 'red' ? 'due-today-red' :
        dueDateColor(todo.date.toDate()) === 'yellow' ? 'due-today-yellow' :
          dueDateColor(todo.date.toDate()) === 'green' ? 'due-today-green' : ''}`} 
          key={index}
          draggable="true" 
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
          style={{ cursor: 'move' }}
      >
        <div>
          <h3>{todo.task}</h3>
          <p>{todo.notes}</p>
          <p className='due'><strong>Due: </strong>{todo.date ? todo.date.toDate().toDateString() : ''}</p>
        </div>
        <div>
          <MdOutlineDeleteOutline className='icon-delete' onClick={() => handleDeleteTask(todo.id)} />
          {todo.completed ? null : (
            <FaCheck className='check-icon' onClick={() => handleCompleteTask(todo.id)} />
          )}
        </div>
      </div>
    ))
  : isComplete // Check if isComplete state is true or false
          ? completedTasks.map((todo, index) => ( //fetch all the tasks that are in the completed part of the database
            <div className={`todo-list-items ${dueDateColor(todo.date.toDate()) === 'red' ? 'due-today-red' :
              dueDateColor(todo.date.toDate()) === 'yellow' ? 'due-today-yellow' :
                dueDateColor(todo.date.toDate()) === 'green' ? 'due-today-green' : ''}`} key={index}>

              <div>
                <h3>{todo.task}</h3>
                <p>{todo.notes}</p>
                {/* <p className='due'><strong>Due: </strong>{todo.date.toDate().toDateString()}</p> */}
                <p>{new Date(todo.date).toDateString()}</p>
              </div>
              <div>
                <MdOutlineDeleteOutline className='icon-delete' onClick={() => handleDeleteTask(todo.id)} />
              </div>
            </div>
          ))
        : todoList.map((todo, index) => ( //fetch all the tasks that are added from user and in "Pending" state part of the database
        // // coloring the dates based on the difference between the due date and the current date and assign the color accordingly
          <div className={`todo-list-items ${dueDateColor(todo.date.toDate()) === 'red' ? 'due-today-red' :
               dueDateColor(todo.date.toDate()) === 'yellow' ? 'due-today-yellow' :
                dueDateColor(todo.date.toDate()) === 'green' ? 'due-today-green' : ''}`} 
                key={index}
                //The drag and drop function is being called in the Pending section of the App
            draggable="true" 
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            style={{ cursor: 'move' }}
          >
            <div> {/* Display the tasks fetched in the database and display their information (like task name, notes and due date)  */}
              <h3>{todo.task}</h3>
              <p>{todo.notes}</p>
              {/* <p className='due'><strong>Due: </strong>{todo.date ? todo.date.toDate().toDateString() : ''}</p> */}
              <p className='due'><strong>Due: </strong>{new Date(todo.date.toDate()).toDateString()}</p>
            </div>
            <div>
              <MdOutlineDeleteOutline className='icon-delete' onClick={() => handleDeleteTask(todo.id)} /> {/* Delete icon button which handles deleting the tasks from the list and the database with confirmation before deletion  */}
              <FaCheck className='check-icon' onClick={() => handleCompleteTask(todo.id)} /> {/* Check icon button used to mark the task as completed and move it to the completed section */}
              {/* Note that the check icon disappears when task is marked as completed */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Status;
