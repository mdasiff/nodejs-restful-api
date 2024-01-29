import Admin from '../models/Admin.js';
import Permission from '../models/Permission.js';
import PermissionGroup from '../models/PermissionGroup.js';
import Role from '../models/Role.js';
import { STATUS_ACTIVE, SUPER_ADMIN_STR } from '../config/constants.js';

/**
 * Validates an admin based on their ID, ensuring they exist, have an active status, and have not been deleted.
 *
 * @async
 * @function
 * @param {string} id - The ID of the admin to validate.
 * @returns {object|boolean} The validated admin object if it meets the criteria, or `false` if not found or invalid.
 * @throws {Error} Throws an error if an unexpected error occurs during validation.
 * 
 * @author Md Asif <asif@avya-tech.com>
 */
const validateAdmin = async (id) => {
    try {
      
      // Check if admin id is exists, status is Active and admin should not be deleted.
      const admin = await Admin.findOne({
        _id: id,
        status: STATUS_ACTIVE,
        deletedAt: null
      }).select('_id name email roles roles_name')
      .populate({
        path: 'roles',
        model: Role,
        populate: {
          path: 'permissions',
          model: Permission,
          populate: {
            path: 'permissiongroup',
            model: PermissionGroup,
          },
        }
      });

      return admin;
    
    } catch (error) {
      throw new Error('Error: ' + error.message);
    }
}

/**
 * Checks if a user has the "Super Admin" role in their roles array.
 *
 * @function
 * @param {object} data - The user data containing the roles array.
 * @returns {boolean} `true` if the user has the "Super Admin" role, or `false` if not.
 * 
 * @author Md Asif <asif@avya-tech.com>
 */
const isSuperAdmin = (admin) => {
    if(admin.roles_name.length > 0) {
      return admin.roles_name.includes(SUPER_ADMIN_STR);
      //return admin.roles_name.some((item) => item.name === SUPER_ADMIN_STR);
    }
}

/**
 * Check if a user has permission for a specific HTTP method and URL.
 *
 * This function evaluates whether a user has the necessary permissions to access a given URL
 * with a specific HTTP method. It checks the user's roles and associated permissions to make
 * this determination.
 *
 * @param {Object} admin The user or admin object containing role and permission information.
 * @param {string} method The HTTP method (e.g., GET, POST, PUT, DELETE).
 * @param {string} url The URL to check for permission.
 *
 * @returns {boolean} True if the user has permission, false otherwise.
 */
const hasPermission = (admin, method, originalUrl) => {
  const url = trimAPIPath(originalUrl);
  //console.log('Request:- ', method, url);
  //console.log('admin', admin);
  // If the admin is a super admin, grant access immediately
  if(isSuperAdmin(admin)) {
    return true;
  }

  //admin = removeKeyFromObject(admin, 'roles');
  // If the admin doesn't have roles, deny access
  if(!admin.roles) {
    console.log('roles not found');
    return false;
  }

  // Get the admin's roles
  const roles = admin.roles;
  //console.log(roles);
  for (const role of roles) {
    
    // If a role doesn't have permissions, deny access
    if(!role.permissions) {
      console.log('permissions not found');
      return false;
    }

    // Get the permissions associated with the role
    const permissions = role.permissions;
    //console.log(permissions);

    for (const permission of permissions) {

      // If a permission doesn't have a permission group, deny access
      if(!permission.permissiongroup) {
        return false;
      }

      //const permissiongroup = permission.permissiongroup;
      
      //console.log('DB: ', permission.method, permission.slug);
      
      // Check if the permission matches the requested method and URL
      if(permission.method === method && (permission.slug === url || matchUrlPattern(url, permission.slug)))
      {
        // Permission granted, allow access
        return true;
      }
    }//permission
    //console.log(permissions);
  }//role

  // Deny access if no matching permission is found
  return false;
}

const trimAPIPath = (apiPath) => {
  const commonPrefix = "/api";
  const trimmedPath = apiPath.replace(commonPrefix, '');
  return trimmedPath;
}

/**
 * Check if a URL matches a pattern.
 *
 * This function checks if a given URL matches a specified pattern. The pattern can include
 * placeholders denoted by colons (e.g., ':param') to represent dynamic segments in the URL.
 *
 * @param {string} url The URL to be checked.
 * @param {string} pattern The URL pattern to match against.
 *
 * @returns {boolean} True if the URL matches the pattern, false otherwise.
 */
const matchUrlPattern = (url, pattern) => {
  const patternParts = pattern.split('/');
  const urlParts = url.split('/');

  if (patternParts.length !== urlParts.length) {
    return false;
  }

  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i] !== urlParts[i] && !patternParts[i].startsWith(':')) {
      return false;
    }
  }

  return true;
}

export { 
    validateAdmin,
    hasPermission
}