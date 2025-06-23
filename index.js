const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint root
app.get('/', (req, res) => {
  res.send('Hello from Express backend!');
});

// Endpoint contoh POST
app.post('/api/data', (req, res) => {
  const data = req.body;
  res.json({ message: 'Data received', data });
});

// In-memory storage for todos
let todos = [];
let nextId = 1;

// Helper: Standard response
function successResponse(message, data) {
  return { status: 'success', message, data };
}
function errorResponse(message) {
  return { status: 'error', message };
}

// GET /api/todos - Get all todos
app.get('/api/todos', (req, res) => {
  res.json(successResponse('Data retrieved successfully', todos));
});

// POST /api/todos - Add new todo
app.post('/api/todos', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !description || !dueDate) {
    return res.status(400).json(errorResponse('Title, description, and dueDate are required'));
  }
  const now = new Date();
  const todo = {
    id: nextId++,
    title,
    description,
    completed: false,
    dueDate,
    createdAt: now.toISOString(),
  };
  todos.push(todo);
  res.status(201).json(successResponse('To-do created successfully', todo));
});

// GET /api/todos/:id - Get todo by ID
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json(errorResponse('To-do with the given ID not found'));
  }
  res.json(successResponse('Data retrieved successfully', todo));
});

// PUT /api/todos/:id - Update todo by ID
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json(errorResponse('To-do with the given ID not found'));
  }
  const { title, description, completed, dueDate } = req.body;
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;
  if (dueDate !== undefined) todo.dueDate = dueDate;
  res.json(successResponse('To-do updated successfully', todo));
});

// DELETE /api/todos/:id - Delete todo by ID
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const idx = todos.findIndex(t => t.id === id);
  if (idx === -1) {
    return res.status(404).json(errorResponse('To-do with the given ID not found'));
  }
  const deleted = todos.splice(idx, 1)[0];
  res.json(successResponse('To-do deleted successfully', deleted));
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

