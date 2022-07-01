const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const config = require('../config/config').get(process.env.NODE_ENV);
const salt = 10;

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  token: {
    type: String,
  },
  isAdmin: Boolean,
});

userSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(salt, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

// generate token
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign(
    { id: user._id.toHexString(), email: user.email },
    config.SECRET
  );

  user.token = token;
  await user.save((err) => {
    if (err) return Promise.reject(err);
  });
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email', 'isAdmin']);
};

// find by token
userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  jwt.verify(token, config.SECRET, function (err, decode) {
    user.findOne(
      { _id: decode.id, email: decode.email, token: token },
      function (err, user) {
        if (err) return cb(err);
        cb(null, user);
      }
    );
  });
};

userSchema.statics.findByCredentials = function (email, password) {
  const User = this;
  return User.findOne({ email: email }).then((user) => {
    if (!user) {
      return Promise.reject(`User ${email} not found.`);
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject('Wrong Email or Password');
        }
      });
    });
  });
};

//delete token
userSchema.methods.deleteToken = async function () {
  const user = this;
  try {
    await user.update({ $unset: { token: 1 } });
    return Promise.resolve(user);
  } catch (err) {
    console.log(err);
    if (err) return Promise.reject(err);
  }
};
const User = mongoose.model('User', userSchema);
module.exports = { User };
