import { check, validationResult } from 'express-validator';

export const validateQuiz = [
  check('question').notEmpty().withMessage('Question is required'),
  check('options').isArray({ min: 2 }).withMessage('At least two options are required'),
  check('answer').isInt({ min: 0 }).withMessage('Answer must be a valid option index'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }];
  // Validation rules for QA response
export const validateQA = [
  // Check if 'userId' is present and is a valid MongoDB ObjectId
  check('userId')
    .not().isEmpty().withMessage('User ID is required.')
    .isMongoId().withMessage('User ID must be a valid ID.'),

  // Check if 'questionId' is present and is a valid MongoDB ObjectId
  check('questionId')
    .not().isEmpty().withMessage('Question ID is required.')
    .isMongoId().withMessage('Question ID must be a valid ID.'),

  // Check if 'response' is present and is a string
  check('response')
    .not().isEmpty().withMessage('Response text is required.')
    .isString().withMessage('Response must be a text.')
    .trim()
    .escape(),

  // Middleware to handle the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

 