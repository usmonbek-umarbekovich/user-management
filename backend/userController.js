const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('./userModel');

// @desc Register new user
// @route POST /api/users/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!(name && email && password)) {
    res.status(400);
    throw new Error('All the fields are required');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid user data');
  }

  res.status(200).json({
    _id: user.id,
    name: user.name,
    email: user.email,
  });
});

// @desc Login user
// @route POST /api/users/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.status === 'blocked') {
      res.status(400);
      throw new Error('Sorry, You are blocked');
    }

    await User.findByIdAndUpdate(user.id, { lastLogin: Date.now() });

    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

// @desc Block user
// @route PUT /api/users/block/:id
// @access Private
const blockUser = changeStatus('blocked');

// @desc Unblock user
// @route PUT /api/users/unblock/:id
// @access Private
const unblockUser = changeStatus('active');

// @desc Delete user
// @route DELETE /api/users/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const user = User.findById(req.params.id);
  if (!user) {
    res.status(400);
    throw new Error('User not found');
  }

  await user.remove();
  res.status(200).json({ id: req.params.id });
});

// helpers
function changeStatus(status) {
  return asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(400);
      throw new Error('User not found');
    }

    const blockedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(blockedUser);
  });
}

module.exports = {
  registerUser,
  loginUser,
  blockUser,
  unblockUser,
  deleteUser,
};
