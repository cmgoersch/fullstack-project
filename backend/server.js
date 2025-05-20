import express from 'express'
import users from './data/users.json' with {type: "json"}
import todos from './data/todos.json'  with {type: "json"}
import cors from "cors";



const app = express()
const PORT = 5500

// middleware
app.use(express.json())
app.use(cors());

// app.get('/', (req, res) => res.send('Hallo World'))

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    const { password, ...safeUser } = user;
    res.json(safeUser); 
  } else {
    res.status(401).json({ message: "Login fehlgeschlagen" });
  }
});

app.post("/todos", (req, res)=>{
    const {userID} =req.body
    const userTodos = todos.filter((todo) => todo.uID === userID)
    res.json(userTodos)
    
})

app.listen(PORT, () => {
console.log(`Server: http://localhost:${PORT}`)})