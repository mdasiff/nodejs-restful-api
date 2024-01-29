import Admin from '../models/Admin.js';
import { validationResult } from 'express-validator';
import { hashPassword } from '../helpers/passwordUtils.js';
import { removeKeyFromObject, extractValues, extractLabel } from '../helpers/common.js';
import { CREATED, NOT_FOUND, UPDATED, DELETED, RESTORED } from '../config/messages.js';

/**
 * Creates a new admin with the provided data.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing admin data.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during validation, password hashing, or database save.
 * @returns {Object} A JSON response containing the created admin's details and a success message.
 */
const create = async (req, res) => {
  try {

    // Check for validation errors using validationResult from your validation logic.
    const errors = validationResult(req);

    // Extract the role names from the request body.
    let roles_name = extractLabel(req.body.roles);

    // If there are validation errors, respond with a 400 Bad Request and the error details.
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Hash the admin password before saving it.
    req.body.password = await hashPassword(req.body.password);
    

    // Extract the role values from the request body using extractValues.
    let roles1 = extractValues(req.body.roles);
    
    // Update the request body with the extracted roles if they exist.
    if(roles1)
    req.body.roles = roles1;
    
    // Update the request body with the extracted role names if they exist.
    if(roles_name)
    req.body.roles_name = roles_name;

    // Create a new Admin instance with the request body and save it to the database.
    const data = new Admin(req.body);
    await data.save();
    
    // Respond with a 200 OK status, the created admin details, and a success message.
    res.status(200).json({ data, message: CREATED });
  } catch (err) {
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};


/**
 * Updates the roles and role names for an admin.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing updated roles and role names.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the update process.
 * @returns {Object} A JSON response with a success message.
 */
 const update = async (req, res) => {
  try {

     // Extract the role names from the request body.
    let roles_name = extractLabel(req.body.roles);

    // Update the request body with the extracted role names if they exist.
    if(roles_name)
    req.body.roles_name = roles_name;

    // Extract the role values from the request body using extractValues.
    let roles1 = extractValues(req.body.roles);

    // Update the request body with the extracted roles if they exist.
    if(roles1)
    req.body.roles = roles1;
    
    const data = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }

    // Respond with a 200 OK status and a success message.
    res.status(200).json({ message: UPDATED });
  } catch (err) {

    // Handle any errors that occur during the update process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a list of all admin with their roles, sorted by creation date in descending order.
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
    // Query the database to find admin with 'deletedAt' property set to null,
    // populate their 'roles' field, and sort the results by 'createdAt' in descending order.
    const data = await Admin.find({ deletedAt: null }).populate('roles').sort( { createdAt: -1 } );
    
    // Respond with a 200 OK status and the retrieved data in JSON format.
    res.status(200).json(data);
  } catch (err) {
    
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves a list of all deleted admin with their roles, sorted by deletion date in descending order.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the database query or processing.
 * @returns {Object} A JSON response containing the list of deleted admin with their roles.
 */
const getAllDeleted = async (req, res) => {
  
  try {
    //const data = await Admin.find({}, { password: 0 }).sort( { createdAt: -1 } );
    // Query the database to find admins with 'deletedAt' property not equal to null,
    // populate their 'roles' field, and sort the results by 'deletedAt' in descending order.
    const data = await Admin.find({ deletedAt: { $ne: null } }).populate('roles').sort( { deletedAt: -1 } );
    
    // Respond with a 200 OK status and the retrieved data in JSON format.
    res.status(200).json(data);
  } catch (err) {

    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};

/**
 * Retrieves an admin's details by their unique ID, excluding the 'password' field,
 * and populating the 'roles' field.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing the ID parameter.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the database query or processing.
 * @returns {Object} A JSON response containing the admin's details excluding the 'password' field.
 */
const getById = async (req, res) => {
  try {
    // Retrieve the admin document by its unique ID and populate the 'roles' field.
    const user = await Admin.findById(req.params.id).populate('roles');
    if (!user) {
      // If no user is found with the specified ID, respond with a 404 Not Found error.
      return res.status(404).json({ error: NOT_FOUND });
    }
    let data = removeKeyFromObject(user.toJSON(), 'password');
    res.status(200).json(data);
  } catch (err) {
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};

/**
 * Marks an admin as deleted by setting the 'deletedAt' field to the current date.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing the ID of the admin to be marked as deleted.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the update or if the admin is not found.
 * @returns {Object} A JSON response with a success message if the admin is successfully marked as deleted.
 */
const destroy = async (req, res) => {
  try {
    // Find and update the admin by setting the 'deletedAt' field to the current date.
    //const data = await Admin.findByIdAndRemove(req.params.id);
    const data = await Admin.findByIdAndUpdate(req.params.id, {deletedAt: new Date()});
    
    // If no admin is found with the specified ID, respond with a 404 Not Found error.
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }

    // Respond with a 200 OK status and a success message.
    res.status(200).json({ message: DELETED });
  } catch (err) {

    // Handle any errors that occur during the update process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};

/**
 * Restores a previously deleted admin by setting the 'deletedAt' field to null.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing the ID of the admin to be restored.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during the update or if the admin is not found.
 * @returns {Object} A JSON response with a success message if the admin is successfully restored.
 */
const restore = async (req, res) => {
  try {

    // Find and update the admin by setting the 'deletedAt' field to null.
    const data = await Admin.findByIdAndUpdate(req.params.id, {deletedAt: null});

    // If no admin is found with the specified ID, respond with a 404 Not Found error.
    if (!data) {
      return res.status(404).json({ error: NOT_FOUND });
    }

    // Respond with a 200 OK status and a success message.
    res.status(200).json({ message: RESTORED });
  } catch (err) {

    // Handle any errors that occur during the update process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};


export { 
  create,
  getAll,
  getAllDeleted,
  getById,
  update,
  destroy,
  restore
}