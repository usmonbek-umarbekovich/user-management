const express = require('express');
const {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  blockUser,
  unblockUser,
  deleteUser,
} = require('./userController');
const protect = require('./middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/', protect, getUsers);
router.delete('/:id', protect, deleteUser);
router.put('/block', protect, blockUser);
router.put('/unblock', protect, unblockUser);

module.exports = router;
