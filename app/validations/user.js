import { check } from 'express-validator';

const createMsg = {
    name_required: 'Name is required.',
    name_string: 'Please enter a valid name.',
    name_min: 'Name must be at least 3 characters long.',
    email_required: 'Email is required.',
    email_valid: 'Please enter a valid email.',
    password_required: 'Password is required',
    password_min: 'Password must be at least 8 characters long.',
    password_min: 'Password must be at least 8 characters long.',
    phone_length_min: 'Phone must be at least 10 characters long.',
    phone_length_max: 'Phone should not be more than 12 characters.'
  };
  
const createRules = [
    check('name')
        .notEmpty().withMessage(createMsg.name_required)
        .isString().withMessage(createMsg.name_string)
        .isLength({ min: 3 }).withMessage(createMsg.name_min),
    check('email')
        .notEmpty().withMessage(createMsg.email_required)
        .isEmail().withMessage(createMsg.email_valid),
    check('password')
        .notEmpty().withMessage(createMsg.password_required)
        .isLength({ min: 8 }).withMessage(createMsg.password_min),
    check('phone')
        .optional()
        .custom((value) => {
        // Check if the 'phone' field is exactly 10 characters long
        if (value && value.length === 10) {
            return true;
        }
        throw new Error('Phone number must be exactly 10 characters long.');
        })
];

export {
    createRules,
};
