function requireJsonContentType(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
  }
  next();
}

function validateTaskId(req, res, next) {
  const { id } = req.params;
  // Valid in-memory or mongo id check
  if (!id || id.trim() === '') {
    return res.status(400).json({ error: 'Task ID is required' });
  }
  next();
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Endpoint route not found' });
}

module.exports = { requireJsonContentType, validateTaskId, notFoundHandler };
