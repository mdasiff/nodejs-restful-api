import Admin from '../models/Admin.js';
import { getVendorId, roleHasVendor } from '../helpers/vendor.js';
import { 
  INVALID_VENDOR,
  NOT_FOUND
} from '../config/messages.js';

/**
 * Retrieves a list of all administrators associated with a specific vendor.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the database query or processing.
 * @returns {Object} A JSON response containing the list of administrators.
 */
const getAll = async (req, res) => {
  try {
    
    // Query the database to find vendor.
    const data = await Admin.find({ deletedAt: null, roles_name: { $in: ['Vendor'] } })
      .sort( { createdAt: -1 } )
      .select('_id name email phone status roles, roles_name deletedAt createdAt updatedAt vendor');
    
      // Respond with a 200 OK status and the retrieved data in JSON format.
    res.status(200).json(data);
    
  } catch (error) {
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: error.message });
  }
};

/**
 * Retrieves an administrator's details by their unique ID.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing the ID parameter.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the database query or processing.
 * @returns {Object} A JSON response containing the administrator's details.
 */
const getById = async (req, res) => {
  try {
    // Retrieve the administrator document by its unique ID and populate the 'roles' field.
    const user = await Admin.findById(req.params.id)
      .populate('roles')
      
      .select('_id name email phone status roles roles_name deletedAt createdAt updatedAt vendor');

    // If no user is found with the specified ID, respond with a 404 Not Found error.
    if (!user) {
      res.status(404).json({ error: NOT_FOUND });
    }
    // Check if the user has a valid vendor role using the roleHasVendor function.
    else if(!roleHasVendor(user)) {
      res.status(500).json({ error: INVALID_VENDOR });
    }
    // Respond with a 200 OK status and the retrieved user's details in JSON format.
    else {
      res.status(200).json(user);
    }
  } catch (error) {
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: error.message });
  }
};

export { 
  getAll,
  getById
}