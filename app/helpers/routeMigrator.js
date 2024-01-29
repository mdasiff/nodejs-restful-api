import mongoose from 'mongoose';
import connectDB from '../database/connect.js';
await connectDB();

import fs from 'fs';
import readDirectory from './readdir.js';
import { arrayElementFromSlugToNameSlugPair } from './common.js';

import {
    ROUTE_PATH_PRIVATE
} from '../config/route.js';
import PermissionGroup from '../models/PermissionGroup.js';
import Permission from '../models/Permission.js';

/**
 * Perform the route migration process for Permission Groups and Permissions.
 *
 * This function reads private route files, migrates Permission Groups, and migrates Permissions
 * based on the provided route information. It logs the results of these migrations and
 * closes the MongoDB database connection when done.
 */
const migrateRoute = async () => {
    
    // Read the route data from the specified directory
    const routesName = await readDirectory(ROUTE_PATH_PRIVATE);
    const routes = arrayElementFromSlugToNameSlugPair(routesName);

     // Migrate Permission Groups
    const pg_migrated = await PermissionGroupMigrate(routes);
    console.log('=======Permission Group Migrated======');
    console.log(pg_migrated);

    //console.log(routesName);

    // Migrate Permissions
    const p_migrated = await PermissionMigrate(routesName);
    //console.log('Permission Migrated: ', p_migrated);
    console.log('=======Permission Migrated======');
    console.dir(p_migrated, { depth: null, colors: true });

    // Close the MongoDB database connection
    mongoose.connection.close();
}

/**
 * Migrate permissions based on route data and Permission Groups.
 *
 * This function processes a list of route groups, retrieves route data from associated files,
 * filters and transforms the route data, and attempts to migrate the permissions into the database.
 *
 * @param {Array<string>} route_groups - An array of route group names to be processed.
 *
 * @returns {Array<Object>|null} An array of successful migrations, each containing Permission Group
 * and the associated Permissions, or null for unsuccessful migrations.
 */
const PermissionMigrate = async (route_groups) => {
    const migrations = route_groups.map(async function(route_group) {
        const file = `${ROUTE_PATH_PRIVATE}${route_group}.js`;
        const file_data = readFile(file);

        const file_data_arr = file_data.split('\n');
        const filtered_elements = getRouteElements(file_data_arr);
        const final_arr = transformRoutesIntoArray(filtered_elements);

        try {
            const pg = await PermissionGroup.findOne({ slug: route_group });
            if (!pg) {
                return null; // Return null for unsuccessful migrations
            } else {
                const migrated = await PermissionSave(final_arr, pg);
                return { "PermissionGroup":route_group, "Permissions":migrated };
            }
        } catch (error) {
            console.error('Error:', error);
            return null; // Return null for unsuccessful migrations
        }
    });

    const results = await Promise.all(migrations);
    const successfulMigrations = results.filter(result => result !== null);

    return successfulMigrations;
}

/**
 * Save permissions for a Permission Group in the database.
 *
 * This function processes a list of permissions, checks if documents with the same method and URL
 * exist in the database, and saves new permissions for the specified Permission Group. It filters
 * out null values and returns an array of successfully saved permission names.
 *
 * @param {Array<Object>} permissions - An array of permissions to be saved.
 * @param {Object} permissiongroup - The Permission Group to which the permissions belong.
 *
 * @returns {Array<string>} An array of permission names that were successfully saved.
 */
const PermissionSave = async (permissions, permissiongroup) => {
    const pg_id = permissiongroup._id;
    //const pg_name = permissiongroup.name;
    // Check if a document with the same method and URL exists
    const migrated = await Promise.all(permissions.map(async (permission) => {
        const existingPermission = await Permission.findOne({
            permissiongroup: pg_id,
            method: permission.method,
            slug: permission.slug,
        });

        if (!existingPermission) {
            permission.permissiongroup = pg_id;
            const newPermission = new Permission(permission);
            await newPermission.save();
            //console.log(permission.name);
            return permission.name;
        }
        return null;
    }));
    
    const filteredMigrated = migrated.filter(Boolean); // Filter out null values
    //return [{ permissiongroup: pg_name }, filteredMigrated];
    return filteredMigrated;
}

/**
 * Migrate Permission Groups based on route information.
 *
 * This function retrieves existing Permission Group slugs from the database, identifies missing
 * slugs based on provided route information, and inserts missing Permission Groups into the database.
 *
 * @param {Array<Object>} routes - An array of route information objects.
 *
 * @returns {Array<Object>|number} An array of missing Permission Group objects that were inserted or
 * the number '0' if no missing objects were inserted.
 */
const PermissionGroupMigrate = async (routes) => {
    try {
        // Retrieve existing slugs from the collection
        const existingSlugs = (await PermissionGroup.find({}, 'slug')).map(doc => doc.slug);
    
        // Find missing slugs
        const missingObjects = routes.filter(obj => !existingSlugs.includes(obj.slug));
    
        // Insert missing objects
        if (missingObjects.length > 0) {
          await PermissionGroup.insertMany(missingObjects);
          //console.log('Inserted missing objects:', missingObjects);
          return missingObjects;
        } else {
          //console.log('No missing objects to insert.');
          return 0;
        }
    } catch (error) {
        console.error('Error:', error);
        return 0;
    }
    //  finally {
    //     // Close the database connection
    //     mongoose.connection.close();
    // }
}

/**
 * Filter and extract route elements from an array based on a specific condition.
 *
 * This function takes an array of elements and filters out elements that start with the
 * specified condition ('middleware.') based on their trimmed content.
 *
 * @param {Array<string>} array - An array of elements to filter.
 *
 * @returns {Array<string>} An array containing filtered route elements.
 */
const getRouteElements = (array) => {
    return array.filter((element) => element.trim().startsWith('middleware.'));
}

/**
 * Transform route data into an array of objects containing name, slug, and method.
 *
 * This function takes an array of route data and transforms it into an array of objects. Each
 * object in the array contains a name, slug, and method extracted from the route data.
 *
 * @param {Array<string>} arr - An array of route data.
 *
 * @returns {Array<Object>} An array of objects, each containing name, slug, and method properties.
 */
const transformRoutesIntoArray = (arr) => {
    const output = [];

    for (const line of arr) {
        output.push({
            name:extractFunctionName(line),
            slug:extractUrlPath(line),
            method:extractHttpMethod(line)
        });
    }

    return output;
}

/**
 * Extract the HTTP method from a string of route data.
 *
 * This function extracts the HTTP method from a string that represents route data. If a method
 * is found, it is converted to uppercase and returned. If no method is found, the function returns null.
 *
 * @param {string} str - A string containing route data.
 *
 * @returns {string|null} The extracted HTTP method in uppercase or null if no method is found.
 */
const extractHttpMethod = (str) => {
    const methodMatch = str.match(/middleware\.(\w+)\s*\(/);
    if (methodMatch) {
        return methodMatch[1].toUpperCase();
    }
    return null; // Return null if no method is found
}

/**
 * Extract the URL path from a string of route data.
 *
 * This function extracts the URL path from a string that represents route data. If a path
 * is found, it is returned. If no path is found, the function returns null.
 *
 * @param {string} str - A string containing route data.
 *
 * @returns {string|null} The extracted URL path or null if no path is found.
 */
const extractUrlPath = (str) => {
    const pathMatch = str.match(/middleware\.\w+\s*\(\s*'([^']+)'/);
    if (pathMatch) {
      return pathMatch[1];
    }
    return null; // Return null if no path is found
}

/**
 * Extract the function name from a string of route data.
 *
 * This function extracts the function name from a string that represents route data. The extracted
 * function name is returned.
 *
 * @param {string} str - A string containing route data.
 *
 * @returns {string} The extracted function name.
 */
const extractFunctionName = (str) => {
    const match = str.match(/middleware\.\w+\s*\(.+\s*,\s*(\w+)[\);]/);
    return match[1];
}

/**
 * Read the contents of a file.
 *
 * This function reads and returns the contents of a file using the specified encoding (utf8).
 *
 * @param {string} file - The path to the file to be read.
 *
 * @returns {string|null} The contents of the file if successful, or null in case of an error.
 */
const readFile = (file) => {
    try {
        const data = fs.readFileSync(file, 'utf8');
        //console.log('File content:', data);
        return data;
    } catch (err) {
        console.error('Error reading file:', err);
    }
}

export default migrateRoute;