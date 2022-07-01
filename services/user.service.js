const { User } = require('../models/User');

exports.checkExistingEmail = async (email) => {
  const userCount = await User.countDocuments({ email });
  if (userCount) return true;
  return false;
};
exports.checkExistingId = async (userId) => {
  const userCount = await User.countDocuments({ _id: userId });
  if (userCount) return true;
  return false;
};
exports.register = async (email, password) => {
  const user = new User({
    email,
    password,
  });
  try {
    await user.save();
  } catch (err) {
    console.log(err);
    return Promise.reject({ error: 'Error saving user!' });
  }
  return Promise.resolve({
    success: true,
    user,
  });
};

exports.getByCredentials = async (email, password) => {
  return User.findByCredentials(email, password);
};

exports.generateToken = (user) => {
  return user.generateAuthToken();
};

exports.logout = async (user) => {
  return user.deleteToken().catch((err) => Promise.reject(err));
};

exports.getAll = async () => {
  return User.find();
};

exports.toggleIsAdmin = async (userId) => {
  return User.updateOne({ _id: userId }, [
    {
      $set: { isAdmin: { $not: '$isAdmin' } },
    },
  ]);
};
