import { check } from 'express-validator';

import {
  required,
  valid,
  min,
  upload_valid
} from './lang.js';

const createRules = [
    check('name')
        .notEmpty().withMessage(required("Name"))
        .isString().withMessage(valid("name"))
        .isLength({ min: 2 }).withMessage(min('Name', 2)),
    check('image')
        .custom((value, { req }) => {
          if (value) {
            // If an image is provided, perform validation checks
            if (!value.buffer) {
              throw new Error('Invalid image file');
            }
  
            // Check the file type (MIME type)
            if (!value.mimetype.startsWith('image/')) {
              throw new Error('Only image files are allowed');
            }
  
            // Define a maximum file size (adjust as needed)
            const maxFileSize = 5 * 1024 * 1024; // 5 MB
            if (value.buffer.length > maxFileSize) {
              throw new Error('Image file size exceeds the maximum allowed size');
            }
          }
  
          return true; // Return true to indicate successful validation (or no image provided)
        })
        .withMessage('Invalid image file')
];

export {
    createRules
};
