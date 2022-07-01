const express = require('express');

const router = express.Router();

const { auth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { checkIsAdmin } = require('../middleware/checkIsAdmin');

const {
  register,
  login,
  get,
  logout,
  getAll,
  toggleAdmin,
} = require('../controllers/user.controller');
const {
  validatateAuthBody,
  validateIsAdminParams,
} = require('../utils/validate/user');

// adding new user (sign-up route)
router.post('/register', ...validatateAuthBody, validate, register);

// login user
router.post('/login', ...validatateAuthBody, validate, login);

// get logged in user
router.get('/profile', auth, get);

// logout user
router.get('/logout', auth, logout);

// get all users
router.get('/all', auth, checkIsAdmin, getAll);

// toggle admin role
router.patch(
  '/:userId',
  ...validateIsAdminParams,
  validate,
  auth,
  checkIsAdmin,
  toggleAdmin
);

module.exports = router;
