const protect = (req, res, next) => {
  if (!req.session.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  next();
};

module.exports = protect;
