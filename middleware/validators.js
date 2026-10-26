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
  // MongoDB ObjectIds are 24-character hexadecimal strings
  if (!id || !/^[a-fA-F0-9]{24}$/.test(id)) {
    return res.status(400).json({ error: 'Invalid task ID format. Must be a 24-character hexadecimal string' });
  }
  next();
}

function notFoundHandler(req, res) {
  res.status(404).json({ error: 'Endpoint route not found' });
}

module.exports = { requireJsonContentType, validateTaskId, notFoundHandler };
