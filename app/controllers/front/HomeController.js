//import Model from '../../models/Cart.js';
import { validationResult } from 'express-validator';
import {
    CREATED,
    NOT_FOUND,
    UPDATED,
    DELETED,
    RESTORED
} from '../../config/messages.js';
import Model from '../../models/Homeslider.js';

/**
 * Creates a new record using the provided data in the request body.
 *
 * @param {Object} req - Express request object containing the HTTP request parameters.
 * @param {Object} res - Express response object used to send HTTP responses.
 *
 * @returns {Promise<void>} - A Promise that resolves once the operation is completed.
 */
const getSlider = async (req, res) => {
  
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

export {
  getSlider
}