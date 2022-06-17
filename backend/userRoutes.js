const express = require('express');
const {
  registerUser,
  loginUser,
  blockUser,
  unblockUser,
  deleteUser,
} = require('./userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.delete('/:id', deleteUser);
router.put('/block/:id', blockUser);
router.put('/unblock/:id', unblockUser);

module.exports = router;
