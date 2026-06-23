const { body, validationResult } = require('express-validator');

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array().map(e => `"${e.path}" : ${e.msg}`).join(' ; '),
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const projectRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required'),
];

const certificationRules = [
  body('name').trim().notEmpty().withMessage('Certification name is required'),
  body('issuer').trim().notEmpty().withMessage('Issuer is required'),
];

const messageRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

const verifyCodeRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').notEmpty().withMessage('Verification code is required'),
];

module.exports = { handleErrors, loginRules, verifyCodeRules, projectRules, certificationRules, messageRules };
