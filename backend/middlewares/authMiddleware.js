const protect = (req, res, next) => {
  // check if user is in the section
  if (!req.session.user) {
    res.status(401);
    throw new Error('Not authenticated');
  }

  next();
};

module.exports = protect;
