import Model from '../models/Cart.js';
import { validationResult } from 'express-validator';
import {
    CREATED,
    NOT_FOUND,
    UPDATED,
    DELETED,
    RESTORED
} from '../config/messages.js';

/**
 * Creates a new record using the provided data in the request body.
 *
 * @param {Object} req - Express request object containing the HTTP request parameters.
 * @param {Object} res - Express response object used to send HTTP responses.
 *
 * @returns {Promise<void>} - A Promise that resolves once the operation is completed.
 */
const addToCart = async (req, res) => {
  
  try {
    // Check for validation errors using express-validator
    const errors = validationResult(req);

    // If there are validation errors, return a 400 Bad Request response
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    

    // Create a new instance of the Model with data from the request body
    const data = new Model(req.body);

    // Save the data to the database asynchronously
    await data.save();
    
    // Return a success response with the created data and a message
    res.status(200).json({ data, message: CREATED });
  } catch (err) {

    // If an error occurs during the process, return a 500 Internal Server Error response
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves all records from the database with a condition to exclude soft-deleted records.
 *
 * @param {Object} req - Express request object containing the HTTP request parameters.
 * @param {Object} res - Express response object used to send HTTP responses.
 *
 * @returns {Promise<void>} - A Promise that resolves once the operation is completed.
 */
const getAll = async (req, res) => {
  try {
    // Retrieve all records from the database where 'deletedAt' is null, sorted by 'createdAt' in descending order
    const data = await Model.find({ deletedAt: null }).sort( { createdAt: -1 } );
    
    // Return a success response with the retrieved data
    res.status(200).json(data);
  } catch (err) {

    // If an error occurs during the process, return a 500 Internal Server Error response with details about the error
    res.status(500).json({ error: err.message });
  }
};

/**
 * Soft-deletes a specific record in the database by updating the 'deletedAt' field.
 *
 * @param {Object} req - Express request object containing the HTTP request parameters.
 * @param {Object} res - Express response object used to send HTTP responses.
 *
 * @returns {Promise<void>} - A Promise that resolves once the operation is completed.
 */
const destroy = async (req, res) => {
  try {
    // Find and soft-delete the record in the database by its unique identifier (ID)
    const data = await Model.findByIdAndUpdate(req.params.id, {deletedAt: new Date()});

    // If the record with the specified ID is not found, return a 404 Not Found response
    if (!data) {

      // Return a success response indicating that the record has been soft-deleted
      return res.status(404).json({ error: NOT_FOUND });
    } else {
      return res.status(200).json({ message: DELETED });
    }
  } catch (err) {
    // If an error occurs during the process, return a 500 Internal Server Error response with details about the error
    res.status(500).json({ error: err.message });
  }
};

export {
    getAll,
    addToCart,
    destroy
}