import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import users from './data/users.json' with { type: 'json' };

// Setup für __dirname, da du ESM verwendest
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Pfad zur todos.json
const TODOS_PATH = path.join(__dirname, 'data', 'todos.json');

// Hilfsfunktion: Todos-Datei laden
function loadTodos() {
  const data = fs.readFileSync(TODOS_PATH, 'utf-8');
  return JSON.parse(data);
}

// Hilfsfunktion: Todos-Datei speichern
function saveTodos(todos) {
  fs.writeFileSync(TODOS_PATH, JSON.stringify(todos, null, 2), 'utf-8');
}

// Express-Setup
const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());

// Login-Route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password, ...safeUser } = user;
    res.json(safeUser);
  } else {
    res.status(401).json({ message: 'Login fehlgeschlagen' });
  }
});

// Todos nach userID filtern
app.post('/todos', (req, res) => {
  const { userID } = req.body;
  const todos = loadTodos();
  const userTodos = todos.filter((todo) => todo.uID === userID);
  res.json(userTodos);
});

// Neuen Todo speichern
app.post('/add-todo', (req, res) => {
  const newTodo = req.body;

  // Datei lesen
  const todos = loadTodos();

  // Todo anhängen
  todos.push(newTodo);

  // Datei speichern
  saveTodos(todos);

  res.status(201).json({ message: 'Todo gespeichert', todo: newTodo });
});

//Datei löschen
app.delete("/delete-todo/:id", (req, res) => {
  const todoId = parseInt(req.params.id);
  const todos = loadTodos();
  const filtered = todos.filter((t) => t.id !== todoId);

  saveTodos(filtered);

  res.json({ message: "Todo gelöscht", id: todoId });
})

// Server starten
app.listen(PORT, () => {
  console.log(`✅ Server läuft auf http://localhost:${PORT}`);
});