const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    // match: /^[\w][\w\-\.]*[\w]$/i,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  createBy: {
    type: Date,
    immutable: true,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
