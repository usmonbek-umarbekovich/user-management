const express = require('express');
const {
  registerUser,
  loginUser,
  blockUser,
  unblockUser,
  deleteUser,
} = require('./userController');
const protect = require('./middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/:id', protect, deleteUser);
router.put('/block/:id', protect, blockUser);
router.put('/unblock/:id', protect, unblockUser);

module.exports = router;
