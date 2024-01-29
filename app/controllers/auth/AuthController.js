import Admin from '../../models/Admin.js';
import { INVALID_CREDENTIALS, CATCH_ERROR } from '../../config/messages.js';
import { comparePassword } from '../../helpers/passwordUtils.js';
import { removeKeyFromObject } from '../../helpers/common.js';
import authMiddleware from '../../middleware/authMiddleware.js';

import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { STATUS_ACTIVE } from '../../config/constants.js';

/**
 * Authenticates an admin by verifying their email and password and issues a JWT token upon successful login.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing the user's email and password.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If an error occurs during validation, user retrieval, password comparison, or token generation.
 * @returns {Object} A JSON response containing a JWT token and the user's data (excluding the password) if authentication is successful.
 */
 const login = async (req, res) => {
    try {
      
      // Check for validation errors using validationResult from your validation logic.
      const errors = validationResult(req);
  
      // If there are validation errors, respond with a 400 Bad Request and the error details.
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      // Extract the email and password from the request body.
      const { email, password } = req.body;
  
      // Find a user with the provided email, ensuring it's active and not deleted.
      const user = await Admin.findOne({ email, status: STATUS_ACTIVE, deletedAt: null });
  
      // If no user is found, respond with a 401 Unauthorized error (invalid credentials).
      if (!user) {
        return res.status(401).json({ error: INVALID_CREDENTIALS });
      }
      
      // Compare the provided password with the user's stored password.
      const isPasswordValid = await comparePassword(password, user.password);
  
      // If the password is invalid, respond with a 401 Unauthorized error (invalid credentials).
      if (!isPasswordValid) {
        return res.status(401).json({ error: INVALID_CREDENTIALS });
      }
      
      // Generate a JWT token containing the user's ID and sign it with a secret key, expiring in 365d.
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '365d' });
      
      // Remove the 'password' field from the user object and respond with a 200 OK status.
      let data = removeKeyFromObject(user.toJSON(), 'password');

      res.status(200).json({ token, data });
    } catch (error) {
  
      // Handle any errors that occur during the authentication process and respond with a 401 Unauthorized error.
      res.status(401).json({ error: CATCH_ERROR });
    }
  };

  export {
    login 
  }