import Tax from '../models/Tax.js';

const getAll = async (req, res) => {
  try {
    // Query the database to find admin with 'deletedAt' property set to null,
    // populate their 'roles' field, and sort the results by 'createdAt' in descending order.
    const data = await Tax.find({});
    
    // Respond with a 200 OK status and the retrieved data in JSON format.
    res.status(200).json(data);
  } catch (err) {
    
    // Handle any errors that occur during the process and respond with a 500 Internal Server Error.
    res.status(500).json({ error: err.message });
  }
};

export { getAll }