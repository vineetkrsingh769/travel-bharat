/**
 * Central error handler — must be registered last with app.use().
 */
function errorHandler(err, req, res, _next) {
  console.error(err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;
