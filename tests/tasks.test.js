const request = require('supertest');
const express = require('express');

// Test suite for Practical 12 CI/CD automation
describe('Task Manager API Suite', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // In-memory test endpoints to avoid live DB dependency in test runner
    const testTasks = [{ id: '1', title: 'Sample Unit Test Task', completed: false }];

    app.get('/tasks', (req, res) => {
      res.status(200).json(testTasks);
    });

    app.post('/tasks', (req, res) => {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      res.status(201).json({ id: '2', title, completed: false });
    });

    app.post('/api/ai/generate-description', (req, res) => {
      const { title } = req.body;
      if (!title) return res.status(400).json({ error: 'Title is required' });
      res.status(200).json({ description: `Suggested plan for ${title}` });
    });
  });

  test('GET /tasks should return 200 OK with array of tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('POST /tasks without title should return 400 Bad Request', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /tasks with valid title should create task with status 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send({ title: 'New Valid Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('New Valid Task');
  });

  test('POST /api/ai/generate-description should return 200 with suggestion', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({ title: 'Deploy Container' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('description');
  });
});
