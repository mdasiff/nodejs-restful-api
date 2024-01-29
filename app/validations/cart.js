import { check } from 'express-validator';
import Product from '../models/Product.js';
import {
  required,
  valid,
  min,
  upload_valid,
  number_only
} from './lang.js';


const addToCartRules = [
  check('unique_id')
    .notEmpty().withMessage(required('Unique Id')),
  check('product.id')
    .notEmpty().withMessage(required('Product Id'))
    .custom(async (productId, { req }) => {
      try {
        // Check if the product with the given id exists in the database
        const product = await Product.findOne({
          _id: productId,
          status: 'Active',
          deletedAt: null,
        });

        if (!product) {
          throw new Error('Product not found');
        }

        // Attach the product object to the request for later use
        req.body.product_detail = product;

        return true;
      } catch (error) {
        console.error('Error finding products:', error);
        throw error;
      }
    }),
  check('product.quantity')
    .notEmpty().withMessage(required('Quantity'))
    .isNumeric().withMessage(number_only('Quantity'))
    .isInt({ min: 1, max: 10 }).withMessage('Quantity must be between 1 and 10'),
];


const getAllRules = [
  check('unique_id')
    .notEmpty().withMessage(required('Unique Id'))
];

const itemDeleteRules = [
  check('unique_id')
    .notEmpty().withMessage(required('Unique Id'))
];

const checkoutRules = [
  check('unique_id')
    .notEmpty().withMessage(required('Unique Id')),
  check('name')
    .notEmpty().withMessage(required('Name')),
  check('email')
    .notEmpty().withMessage(required('Email'))
];

const createRules = [
];

export {
  addToCartRules,
  getAllRules,
  itemDeleteRules,
  createRules,
  checkoutRules
};