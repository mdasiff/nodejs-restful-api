import Order from '../models/Order.js';
import { CATCH_ERROR } from '../config/messages.js';

/**
 * Retrieves a list of all orders, sorted by creation date in descending order.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the database query or processing.
 * @returns {Object} A JSON response containing the list of admin with their roles.
 */
const getAll = async (req, res) => {
  try {
    // Query the database to find order with 'deletedAt' property set to null,
    const data = await Order.find({}).select('_id order_number user subtotal total status payment_status order_date').sort( { createdAt: -1 } );
    
    // Respond with a 200 OK status and the retrieved data in JSON format.
    res.status(200).json(data);
  } catch (err) {
    
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: CATCH_ERROR });
  }
};

export { getAll }