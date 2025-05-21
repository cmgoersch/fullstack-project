import React, { useState } from 'react';
import "./Dashboard.css";

const Dashboard = ({ currentUser, userTodos }) => {
  const [todos, setTodos] = useState(userTodos || []);
  const [newTitle, setNewTitle] = useState("");
  const [newText, setNewText] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editText, setEditText] = useState("");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        const result = await response.json();
        setTodos([...todos, result.todo]);
        setNewTitle("");
        setNewText("");
      }
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:5500/delete-todo/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error("Fehler beim Löschen:", error);
    }
  };

  const toggleState = async (id) => {
  const todoToToggle = todos.find((t) => t.id === id);
  const updatedState = !todoToToggle.state;

  try {
    const response = await fetch(`http://localhost:5500/update-todo/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: updatedState }),
    });

    if (response.ok) {
      const result = await response.json();
      setTodos(
        todos.map((todo) =>
          todo.id === id ? result.todo : todo
        )
      );
    } else {
      console.error("Fehler beim Aktualisieren des Status");
    }
  } catch (error) {
    console.error("Serverfehler beim Statuswechsel:", error);
  }
};

const startEditing = (todo) => {
  setEditTodoId(todo.id);
  setEditTitle(todo.title);
  setEditText(todo.text || "");
};

const saveEdit = async () => {
  const updatedTodo = {
    title: editTitle,
    text: editText,
  };

  try {
    const response = await fetch(`http://localhost:5500/update-todo/${editTodoId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTodo),
    });

    if (response.ok) {
      const result = await response.json();

      setTodos(
        todos.map((todo) =>
          todo.id === editTodoId ? result.todo : todo
        )
      );
    } else {
      console.error("Fehler beim Aktualisieren des Todos");
    }
  } catch (error) {
    console.error("Serverfehler beim Aktualisieren:", error);
  }

  setEditTodoId(null);
  setEditTitle("");
  setEditText("");
};

  const cancelEdit = () => {
    setEditTodoId(null);
    setEditTitle("");
    setEditText("");
  };

  return (
    <div className="dashboard">
      <h1>Willkommen, {currentUser?.username}!</h1>

      <h2>Deine Todos:</h2>
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} className={todo.state ? "completed" : ""}>
              <input
                type="checkbox"
                checked={todo.state}
                onChange={() => toggleState(todo.id)}
              />
              {editTodoId === todo.id ? (
  <>
    <input
      type="text"
      value={editTitle}
      onChange={(e) => setEditTitle(e.target.value)}
    />
    <input
      type="text"
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
    />
    <div className="todo-actions">
     <button className="btn-save" onClick={saveEdit}>Speichern</button>
  <button className="btn-cancel" onClick={cancelEdit}>Abbrechen</button>
    </div>
  </>
) : (
  <>
    <strong>{todo.title}</strong>
    {todo.text && <p>{todo.text}</p>}
    <div className="todo-actions">
      <button className="btn-edit" onClick={() => startEditing(todo)}>Bearbeiten</button>
  <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>Löschen</button>
    </div>
  </>
)}
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