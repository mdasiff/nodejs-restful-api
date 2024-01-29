import Model from '../../models/Sitesetting.js';

/**
 * Retrieves site settings from the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
const getSiteSetting = async (req, res) => {
  try {
    // Retrieve all records from the database where 'deletedAt' is null, sorted by 'createdAt' in descending order
    const data = await Model.find({});
    
    // Return a success response with the retrieved data
    res.status(200).json(data);
  } catch (err) {

    // If an error occurs during the process, return a 500 Internal Server Error response with details about the error
    res.status(500).json({ error: err.message });
  }
};

export {
  getSiteSetting
}