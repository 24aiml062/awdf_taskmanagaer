const express = require('express');
const router = express.Router();
const { validateTaskId } = require('../middleware/validators');
const Task = require('../models/Task');
const cache = require('../cache');
const taskEvents = require('../events/taskEvents');

// GET /tasks - Fetch all tasks with in-memory caching (P9)
router.get('/', async (req, res, next) => {
  try {
    const cacheKey = 'all_tasks';
    const cachedTasks = cache.get(cacheKey);

    if (cachedTasks) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedTasks);
    }

    const tasks = await Task.find().sort({ createdAt: -1 });
    cache.set(cacheKey, tasks);
    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /tasks - Create task, invalidate cache, respond immediately, and emit async event (P10)
router.post('/', async (req, res, next) => {
  try {
    const task = await Task.create(req.body);
    cache.del('all_tasks'); // Invalidate cache on write

    // P10: Send HTTP 201 response immediately to the client
    const responseTime = new Date().toISOString();
    console.log(`[API Response] [${responseTime}] 201 Created sent for task "${task.title}"`);
    res.status(201).json(task);

    // Emit asynchronous event after response is dispatched
    taskEvents.emit('task-created', task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    next(err);
  }
});

// PUT /tasks/:id - Update an existing task and invalidate cache (P9)
router.put('/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    cache.del('all_tasks'); // Invalidate cache on write
    res.status(200).json(task);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    next(err);
  }
});

// DELETE /tasks/:id - Delete a task and invalidate cache (P9)
router.delete('/:id', validateTaskId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    cache.del('all_tasks'); // Invalidate cache on write
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
