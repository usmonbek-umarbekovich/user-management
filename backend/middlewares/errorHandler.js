/**
 * Sending helpful error messages
 */
module.exports = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};
