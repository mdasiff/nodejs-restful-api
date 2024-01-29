import { check } from 'express-validator';

const createMsg = {
    name_required: 'Name is required.',
    name_string: 'Please enter a valid name.',
    name_min: 'Name must be at least 2 characters long.',
  };
  
const createRules = [
    check('name')
        .notEmpty().withMessage(createMsg.name_required)
        .isString().withMessage(createMsg.name_string)
        .isLength({ min: 2 }).withMessage(createMsg.name_min),
];

export {
    createRules
};
