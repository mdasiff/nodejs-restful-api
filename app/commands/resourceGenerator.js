import fs from 'fs';
import {
    PATH_MIGRATION,
    PATH_MODEL,
    PATH_PRIVATE_ROUTE,
    PATH_VALIDATION,
    PATH_CONTROLLER,
    MOCK_FILE_MIGRATION,
    MOCK_PATH_TEMPLATES,
    MOCK_FILE_MODEL,
    MOCK_FILE_CONTROLLER,
    MOCK_FILE_ROUTE,
    MOCK_FILE_VALIDATION
} from '../config/command.js';
import {
    ucfirst,
    getFileAbsolutePath,
    lcfirst
} from '../helpers/common.js';

/**
 * Generates various resources (model, migration, validation, route, and controller) for a given resource name.
 *
 * @param {string} name - The name of the resource for which to generate the components.
 *
 * @returns {Promise<void>} - A Promise that resolves once all components are generated.
 */
 const resources = async (name) => {
    try {
      // Validate the resource name to ensure it meets certain criteria
      validateResource(name);
  
      // Generate the model for the resource
      createModel(name);
  
      // Generate the migration for the resource
      createMigration(name);
  
      // Generate the validation logic for the resource
      createValidation(name);
  
      // Generate the route for the resource
      createRoute(name);
  
      // Generate the controller for the resource
      createController(name);
  
      // All components successfully generated
      console.log(`Resources for '${name}' successfully generated.`);
    } catch (err) {
      // If an error occurs during the resource generation process, log the error
      console.error(`Error generating resources for '${name}': ${err.message}`);
    }
  };

/**
 * Validates whether components (model, route, validation, and controller) for a given resource name already exist.
 * If any of the components already exist, it logs an error message and exits the process.
 *
 * @param {string} name - The name of the resource to be validated.
 */
const validateResource = (name) => {

    let hasError = false;

    // Validate Model
    const model_file = getModelName(name);

    if (fs.existsSync(getFileAbsolutePath(model_file, PATH_MODEL))) {
        console.error(`Model '${model_file}' already exists.`);
        hasError = true;
    }

    // Validate Route
    const route_file = getRouteName(name);

    if (fs.existsSync(getFileAbsolutePath(route_file, PATH_PRIVATE_ROUTE))) {
        console.error(`Route '${model_file}' already exists.`);
        hasError = true;
    }

    // Validate Validation
    const validation_file = getRouteName(name);

    if (fs.existsSync(getFileAbsolutePath(validation_file, PATH_VALIDATION))) {
        console.error(`Validation '${model_file}' already exists.`);
        hasError = true;
    }
    
    // Validate Cotroller
    const controller_file = getControllerName(name);

    if (fs.existsSync(getFileAbsolutePath(controller_file, PATH_CONTROLLER))) {
        console.error(`Controller '${controller_file}' already exists.`);
        hasError = true;
    }

    // If any error occurred (component already exists), exit the process with an error code
    if(hasError) {
        process.exit(1);
    }
}

/**
 * Creates a model file for a given resource name by replacing placeholders in a template file.
 *
 * @param {string} name - The name of the resource for which to create the model file.
 */
const createModel = (name) => {
    // Construct the filename for the model
    const file = getModelName(name);

    // Get the absolute path for the destination file
    const destination = getFileAbsolutePath(file, PATH_MODEL);
    
    // Get the absolute path for the source template file
    const sourchFile = getFileAbsolutePath(MOCK_FILE_MODEL, MOCK_PATH_TEMPLATES);

    // Read the content of the source template file
    fs.readFile(sourchFile, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading the source file:', err);
        return;
        }
        
        // Replace placeholders in the template with the resource name
        const modifiedData = data.replace(/{{name}}/g, name);
    
        // Write the modified content to the destination file
        fs.writeFile(destination, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error creating model:', err);
            return;
        }
    
        console.log(`Model '${file}' created successfully.`);
        });
    });
}

/**
 * Creates a migration file for a given resource name by replacing placeholders in a template file.
 *
 * @param {string} name - The name of the resource for which to create the migration file.
 */
const createMigration = (name) => {
    // Construct the filename for the migration
    const file = getMigrationName(name);

    // Get the absolute path for the destination file
    const destination = getFileAbsolutePath(file, PATH_MIGRATION);

    // Get the model name associated with the resource
    const model = getModelName(name);

    // Get the absolute path for the source template file
    const sourchFile = getFileAbsolutePath(MOCK_FILE_MIGRATION, MOCK_PATH_TEMPLATES);

    // Read the content of the source file
    fs.readFile(sourchFile, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading the source file:', err);
        return;
        }
        
        // Replace placeholders in the template with the model name
        const modifiedData = data.replace(/{{name}}/g, model);
    
        // Write the modified content to the destination file
        fs.writeFile(destination, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error creating migration:', err);
            return;
        }
    
        console.log(`Migration '${file}' created successfully.`);
        });
    });
}

/**
 * Creates a validation file for a given resource name by copying content from a template file.
 *
 * @param {string} name - The name of the resource for which to create the validation file.
 */
const createValidation = (name) => {
    // Construct the filename for the migration
    const file = getRouteName(name);

    // Get the absolute path for the destination file
    const destination = getFileAbsolutePath(file, PATH_VALIDATION);

    // Get the absolute path for the destination file
    const sourchFile = getFileAbsolutePath(MOCK_FILE_VALIDATION, MOCK_PATH_TEMPLATES);

    // Read the content of the source file
    fs.readFile(sourchFile, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading the source file:', err);
        return;
        }
        
        // Replace placeholders in the template with the model name
       // const modifiedData = data.replace(/{{name}}/g, 'asif');
    
        // Write the modified content to the destination file
        fs.writeFile(destination, data, 'utf8', (err) => {
        if (err) {
            console.error('Error creating migration:', err);
            return;
        }
    
        console.log(`Validation '${file}' created successfully.`);
        });
    });
}

/**
 * Creates a route file for a given resource name by copying content from a template file.
 *
 * @param {string} name - The name of the resource for which to create the route file.
 */
const createRoute = (name) => {
    // Construct the filename for the migration
    const file = getRouteName(name);

    // Get the absolute path for the destination file
    const destination = getFileAbsolutePath(file, PATH_PRIVATE_ROUTE);

    // Get the model name associated with the resource
    const sourchFile = getFileAbsolutePath(MOCK_FILE_ROUTE, MOCK_PATH_TEMPLATES);

    // Read the content of the source file
    fs.readFile(sourchFile, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading the source file:', err);
        return;
        }
        
        // Replace placeholders in the template with the model name
        let modifiedData = data.replace(/{{validation}}/g, name);
        modifiedData = modifiedData.replace(/{{controller}}/g, ucfirst(name));
    
        // Write the modified content to the destination file
        fs.writeFile(destination, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error creating route:', err);
            return;
        }
    
        console.log(`Route '${file}' created successfully.`);
        });
    });
}

/**
 * Creates a controller file for a given resource name by copying content from a template file.
 *
 * @param {string} name - The name of the resource for which to create the controller file.
 */
const createController = (name) => {
    // Construct the filename for the migration
    const file = getControllerName(name);

    // Get the absolute path for the destination file
    const destination = getFileAbsolutePath(file, PATH_CONTROLLER);

    // Get the absolute path for the source file
    const sourchFile = getFileAbsolutePath(MOCK_FILE_CONTROLLER, MOCK_PATH_TEMPLATES);

    // Read the content of the source file
    fs.readFile(sourchFile, 'utf8', (err, data) => {
        if (err) {
        console.error('Error reading the source file:', err);
        return;
        }
        
        // Replace placeholders in the template with the model name
        const modifiedData = data.replace(/{{model}}/g, name);
    
        // Write the modified content to the destination file
        fs.writeFile(destination, modifiedData, 'utf8', (err) => {
        if (err) {
            console.error('Error creating controller:', err);
            return;
        }
    
        console.log(`Controller '${file}' created successfully.`);
        });
    });
}

/**
 * Generates the filename for a controller based on the resource name.
 *
 * @param {string} name - The resource name.
 * @returns {string} - The generated controller filename.
 */
const getControllerName = (name) => {
    return `${ucfirst(name)}Controller.js`;
}

/**
 * Generates the filename for a model based on the resource name.
 *
 * @param {string} name - The resource name.
 * @returns {string} - The generated model filename.
 */
const getModelName = (name) => {
    return `${ucfirst(name)}.js`;
}

/**
 * Generates the filename for a route based on the resource name.
 *
 * @param {string} name - The resource name.
 * @returns {string} - The generated route filename.
 */
const getRouteName = (name) => {
    return `${lcfirst(name)}.js`;
}

/**
 * Generates the filename for a migration based on the resource name.
 *
 * @param {string} name - The resource name.
 * @returns {string} - The generated migration filename.
 */
const getMigrationName = (name) => {
    return `${lcfirst(name)}.js`;
}

export default resources;