const express = require('express');
const {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  blockUsers,
  unblockUsers,
  deleteUsers,
} = require('./userController');
const protect = require('./middlewares/authMiddleware');

const router = express.Router();

// public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// protected routes
router.post('/logout', protect, logoutUser);
router.get('/', protect, getUsers);
router.delete('/delete', protect, deleteUsers);
router.put('/block', protect, blockUsers);
router.put('/unblock', protect, unblockUsers);

module.exports = router;
