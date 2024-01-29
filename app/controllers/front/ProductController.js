import Model from '../../models/Product.js';
import {
  addItemToCart
} from '../../helpers/cart.js';
import { validationResult } from 'express-validator';
import {
    NOT_FOUND
} from '../../config/messages.js';

const getAll = async (req, res) => {
  try {
    // Check for validation errors using express-validator
    const errors = validationResult(req);

    // If there are validation errors, return a 400 Bad Request response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Retrieve all records from the database where 'deletedAt' is null, sorted by 'createdAt' in descending order
    //const data = await Model.find({ unique_id:unique_id }).sort( { createdAt: -1 } );
    const data = await Model.find({
      status: 'Active',
      deletedAt: null,
    }).sort( { createdAt: -1 } );
    // Return a success response with the retrieved data
    res.status(200).json(data);
  } catch (err) {

    // If an error occurs during the process, return a 500 Internal Server Error response with details about the error
    res.status(500).json({ error: err.message });
  }
};

const getProductDetail = async (req, res) => {
  const { slug } = req.params;
  try {
    // Check for validation errors using express-validator
    const errors = validationResult(req);

    // If there are validation errors, return a 400 Bad Request response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Retrieve all records from the database where 'deletedAt' is null, sorted by 'createdAt' in descending order
    //const data = await Model.find({ unique_id:unique_id }).sort( { createdAt: -1 } );
    
    const data = await Model.findOne({
      slug: slug,
      status: 'Active',
      deletedAt: null,
    });

    if (!data) {
      throw new Error(NOT_FOUND);
    }

    return res.status(200).json(data);

  } catch (err) {

    // If an error occurs during the process, return a 500 Internal Server Error response with details about the error
    res.status(500).json({ error: err.message });
  }
}

export {
  getAll,
  getProductDetail
}