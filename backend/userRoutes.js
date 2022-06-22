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

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/', protect, getUsers);
router.delete('/delete', protect, deleteUsers);
router.put('/block', protect, blockUsers);
router.put('/unblock', protect, unblockUsers);

module.exports = router;
