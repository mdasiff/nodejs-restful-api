import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import { NO_TOKEN, AUTENTICATION_FAILED, NO_PERMISSION } from '../config/messages.js';
import { validateAdmin, hasPermission } from '../helpers/rbac.js';
/**
 * Middleware function to authenticate and verify JWT tokens provided in the request header.
 *
 * @function
 * @param {Object} req - The HTTP request object containing the 'Authorization' token header.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next function in the request-response cycle.
 * @returns {void} Calls the next middleware function if authentication is successful.
 * 
 * @author Md Asif <asif@avya-tech.com>
 */
const authMiddleware = async (req, res, next) => {
  //console.log("==res==", res);
  const { method, originalUrl } = req;
  //console.log("originalUrl", originalUrl);
  //console.log("method", method);
  const URLArr = originalUrl.split('/');
  const module_name  = URLArr[URLArr.length -1];
  
  //console.log("module_name", module_name);
 // Retrieve the token from the 'Authorization' header
  const token = req.header('Authorization');
  //console.log(token);
  // Check if a token is present
  // if (!token) {
  //   return res.status(401).json({ message: NO_TOKEN });
  // }

  try {
    
    // Verify the token using the provided JWT_SECRET and exclude 'Bearer'
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    //console.log("decodedToken", decodedToken);
   
    // Attach user data to the request object
    req.userData = { userId: decodedToken.userId };

    
    //validate admin account and get the data
    const adminData = await validateAdmin(decodedToken.userId);
    //console.log("adminData", adminData);
    
    // if(!hasPermission(adminData, method, originalUrl))
    // {
    //   //return res.status(401).json({ error: NO_PERMISSION });
    // }
     
    // Continue to the next middleware function
    next();
  
  } catch (error) {

    // Respond with a 401 Unauthorized status in case of token verification failure
    res.status(401).json({ error: AUTENTICATION_FAILED });
    
  }
};

export default authMiddleware;