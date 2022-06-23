const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const User = require('./userModel');

/**
 * @desc Register new user
 * @route POST /api/users/register
 * @access Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

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

  // save user to the session and send data
  req.session.regenerate(err => {
    if (err) throw new Error(err);

    req.session.user = {
      _id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      lastLogin: user.lastLogin,
      registrationTime: user.registrationTime,
    };

    res.status(200).json(req.session.user);
  });
});

/**
 * @desc Login user
 * @route POST /api/users/login
 * @access Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  // compare plain password against hashed one
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.status === 'blocked') {
      res.status(401);
      throw new Error('Sorry, You are blocked');
    }

    user = await User.findByIdAndUpdate(
      user.id,
      { lastLogin: Date.now() },
      { new: true }
    );

    // save user to the session and send data
    req.session.regenerate(err => {
      if (err) throw new Error(err);

      req.session.user = {
        _id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
        lastLogin: user.lastLogin,
        registrationTime: user.registrationTime,
      };

      res.status(200).json(req.session.user);
    });
  } else {
    res.status(400);
    throw new Error('Invalid credentials');
  }
});

/**
 * @desc Logout user
 * @route POST /api/users/logout
 * @access Private
 */
const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy(err => {
    if (err) throw new Error(err);
  });
});

/**
 * @desc Get the list of users
 * @route GET /api/users
 * @access Private
 */
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.where('_id')
    .ne(req.session.user._id)
    .select('_id name email status registrationTime lastLogin');
  res.status(200).json(users);
});

/**
 * @desc Block users
 * @route PUT /api/users/block
 * @access Private
 */
const blockUsers = changeStatus('blocked');

/**
 * @desc Unblock users
 * @route PUT /api/users/unblock
 * @access Private
 */
const unblockUsers = changeStatus('active');

/**
 * @desc Delete users
 * @route DELETE /api/users/delete
 * @access Private
 */
const deleteUsers = asyncHandler(async (req, res) => {
  const { selectedUsers } = req.body;
  const selectedIds = selectedUsers.map(user => user._id);
  const report = await User.deleteMany({ _id: selectedIds });
  res.status(200).json(report);
});

/**
 * @desc Helper function for blocking or unblocking users
 */
function changeStatus(status) {
  return asyncHandler(async (req, res) => {
    const { selectedUsers } = req.body;
    const selectedIds = selectedUsers.map(user => user._id);
    const report = await User.updateMany({ _id: selectedIds }, { status });
    res.status(200).json(report);
  });
}

module.exports = {
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
  blockUsers,
  unblockUsers,
  deleteUsers,
};
