import React, { useState } from 'react';
import "./Dashboard.css";

const Dashboard = ({ currentUser, userTodos }) => {
  const [todos, setTodos] = useState(userTodos || []);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");

  const addNewTodo = async (e) => {
  e.preventDefault();

  if (!newTitle.trim()) return;

  const newTodo = {
    id: Date.now(),
    uID: currentUser.userID,
    title: newTitle,
    text: newText,
    state: false,
  };

  try {
    const response = await fetch("http://localhost:5500/add-todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      const result = await response.json();
      setTodos([...todos, result.todo]);
      setNewTitle("");
      setNewText("");
    } else {
      console.error("Fehler beim Speichern des Todos");
    }
  } catch (error) {
    console.error("Serverfehler beim Speichern:", error);
  }
};

const deleteTodo = async (id) => {
  try {
    const response = await fetch(`http://localhost:5500/delete-todo/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setTodos(todos.filter((todo) => todo.id !== id));
    } else {
      console.error("Fehler beim Löschen");
    }
  } catch (error) {
    console.error("Serverfehler beim Löschen:", error);
  }
};

  return (
    <div className="dashboard">
      <h1>Willkommen, {currentUser?.username}!</h1>

      <h2>Deine Todos:</h2>
      {todos.length > 0 ? (
       <ul>
  {todos.map((todo) => (
    <li key={todo.id}>
      <strong>{todo.title}</strong>
      {todo.text && <p>{todo.text}</p>}
      <button onClick={() => deleteTodo(todo.id)}>🗑️ Löschen</button>
    </li>
  ))}
</ul>
      ) : (
        <p>Keine Todos vorhanden.</p>
      )}

      <form onSubmit={addNewTodo} className="new-todo-form">
        <h3>Neues To-Do anlegen</h3>
        <input
          type="text"
          placeholder="Titel"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Beschreibung (optional)"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
        <button type="submit">Hinzufügen</button>
      </form>
    </div>
  );
};

export default Dashboard;