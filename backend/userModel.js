const mongoose = require('mongoose');

const schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add password'],
    },
    status: {
      type: String,
      default: 'active',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: 'registrationTime' },
  }
);

module.exports = mongoose.model('User', schema);
