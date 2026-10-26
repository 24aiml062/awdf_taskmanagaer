const express = require('express');
const router = express.Router();
const { validateTaskId } = require('../middleware/validators');

// In-memory task store for Practical 4
let tasks = [
  { id: '1', title: 'Complete Lab Practical 4', description: 'Build RESTful API in Express', completed: false, createdAt: new Date() },
  { id: '2', title: 'Review Component Architecture', description: 'Study React props & hooks', completed: true, createdAt: new Date() }
];

// GET /tasks
router.get('/', (req, res) => {
  res.status(200).json(tasks);
});

// POST /tasks
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const newTask = {
    id: (Date.now()).toString(),
    title: title.trim(),
    description: description || '',
    completed: false,
    createdAt: new Date()
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
router.put('/:id', validateTaskId, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const { title, description, completed } = req.body;
  if (title !== undefined) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;
  if (completed !== undefined) tasks[taskIndex].completed = completed;

  res.status(200).json(tasks[taskIndex]);
});

// DELETE /tasks/:id
router.delete('/:id', validateTaskId, (req, res) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  res.status(200).json({ message: 'Task deleted successfully' });
});

module.exports = router;
