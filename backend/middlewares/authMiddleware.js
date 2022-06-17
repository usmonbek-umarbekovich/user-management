const restrict = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    throw new Error('Not authenticated');
  }
};

module.exports = restrict;
