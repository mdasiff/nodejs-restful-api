import { check } from 'express-validator';
import {
  required,
  valid,
  min,
} from './lang.js';

  
const createRules = [
    check('name')
        .notEmpty().withMessage(required("Name"))
        .isString().withMessage(valid("name"))
        .isLength({ min: 2 }).withMessage(min('Name', 2))
];

export {
    createRules
};
