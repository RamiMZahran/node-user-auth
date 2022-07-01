const { body, param } = require('express-validator');

exports.validatateAuthBody = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please enter a valid email'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Please enter a password with at least 8 characters'),
];

exports.validateIsAdminParams = [
  param('userId').isMongoId().withMessage('Please enter a valid user id'),
];
