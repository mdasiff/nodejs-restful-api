import path from 'path';

/**
 * remove key and values from the given object.
 * @param {Obj} | {Str} key to remove from object
 * @returns {Obj}
 */
 function removeKeyFromObject(obj, keyToRemove) {
    // Create a shallow copy of the original object
    const newObj = { ...obj };

    // Check if the key exists in the object
    if (newObj.hasOwnProperty(keyToRemove)) {
        // Delete the specified key from the new object
        delete newObj[keyToRemove];
    }

    // Return the new object with the key removed
    return newObj;
}

function removeEmptyProperties(obj) {
  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined || obj[key] === '') {
      delete obj[key];
    }
  }
  return obj;
}

/**
 * Generates a slug from an input string by converting it to lowercase, removing whitespace, replacing spaces with hyphens,
 * and removing non-word characters. The resulting slug is limited in length.
 *
 * @function
 * @param {string} inputString - The input string from which to generate the slug.
 * @returns {string} A slug derived from the input string.
 */
function generateSlug(inputString) {
    return inputString
        .toString() // Ensure the input is a string
        .toLowerCase() // Convert the string to lowercase
        .trim() // Remove leading and trailing whitespace
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]+/g, '') // Remove non-word characters (e.g., special symbols)
        .slice(0, 100); // Limit the slug length (adjust as needed)
}

/**
 * Generates a unique slug by combining an input string with a counter to ensure uniqueness.
 * It checks the uniqueness of the generated slug using a specified Mongoose model.
 *
 * @function
 * @async
 * @param {Mongoose.Model} Model - The Mongoose model to query for slug uniqueness.
 * @param {string} inputString - The input string from which to generate the slug.
 * @returns {Promise<string>} A unique slug derived from the input string.
 */
async function generateUniqueSlug(Modal, inputString) {
  let slug = generateSlug(inputString);
  let isUnique = await isSlugUnique(Modal, slug);
  let count = 1;

  while (!isUnique) {
    slug = `${generateSlug(inputString)}-${count}`;
    isUnique = await isSlugUnique(Modal, slug);
    count++;
  }

  return slug;
}

/**
 * Checks if a given slug is unique within a specified Mongoose model by counting the number of documents with the same slug.
 *
 * @function
 * @async
 * @param {Mongoose.Model} Model - The Mongoose model to query for slug uniqueness.
 * @param {string} slug - The slug to check for uniqueness.
 * @returns {Promise<boolean>} A Promise that resolves to true if the slug is unique, or false if it's not.
 */
async function isSlugUnique(Modal,slug) {
  const count = await Modal.countDocuments({ slug });
  return count === 0;
}

/**
 * Generates a random integer between a specified minimum and maximum value (inclusive of the minimum value).
 *
 * @function
 * @param {number} min - The minimum value for the generated random number (default: 10).
 * @param {number} max - The maximum value for the generated random number (default: 200).
 * @returns {number} A random integer between the specified minimum and maximum values.
 */
function between(min=10, max=200) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

/**
 * Calculates the sale price of a product after applying a discount percentage.
 *
 * @function
 * @param {number} originalPrice - The original price of the product.
 * @param {number} discountPercentage - The discount percentage to apply.
 * @returns {number} The sale price of the product rounded down to the nearest integer.
 * @throws {Error} If the original price or discount percentage is negative, or if the discount percentage is greater than 100.
 */
function calculateSalePrice(originalPrice, discountPercentage) {
  if (originalPrice < 0 || discountPercentage < 0 || discountPercentage > 100) {
    return originalPrice;
    //throw new Error('Invalid input. Price and discount percentage must be non-negative, and discount percentage must be between 0 and 100.');
  }

  const discountAmount = (originalPrice * discountPercentage) / 100;
  const salePrice = originalPrice - discountAmount;

  // Use Math.floor to round down to the nearest integer
  const salePriceInteger = Math.floor(salePrice);

  return salePriceInteger;
}

/**
 * Extracts the 'value' property from an array of objects, returning an array of values.
 *
 * @function
 * @param {Array} data - An array of objects containing a 'value' property.
 * @returns {Array|false} An array of extracted values if successful, or false if any 'value' is undefined or null.
 */
function extractValues(data) {
  // Check if data is not an array
  if (!Array.isArray(data)) {
    return false; // Return false if data is not an array
  }

  // Use the map function to extract the 'value' property from each element
  const values = data.map(val => val.value);

  // Check if any 'value' is undefined or null in the resulting array
  if (values.some(value => value === undefined || value === null)) {
    return false; // Return false if any 'value' is undefined or null
  }

  // If all 'value' properties exist and are not undefined or null, return the values array
  return values;
}

/**
 * Extracts the 'lable' property from an array of objects, returning an array of values.
 *
 * @function
 * @param {Array} data - An array of objects containing a 'value' property.
 * @returns {Array|false} An array of extracted values if successful, or false if any 'value' is undefined or null.
 */
function extractLabel(data) {
  // Check if data is not an array
  if (!Array.isArray(data)) {
    return false;
  }

  const labeles = data.map(val => val.label);
  
  // Check if any 'label' is undefined or null in the resulting array
  if (labeles.some(label => label === undefined || label === null)) {
    return false; // Return false if any 'label' is undefined or null
  }

  // If all 'label' properties exist and are not undefined or null, return the labeles array
  return labeles;
}

/**
 * Parses search input and converts it to an integer if it represents a number.
 *
 * @function
 * @param {string} input - The input to be parsed.
 * @returns {number|string} The parsed input, either as an integer or a string.
 */
function parsSearchInput(input) {
  
  if(isNumber(input))
    return parseInt(input);

  return input;
}

/**
 * Checks if a string represents a valid number and attempts to parse it as a number.
 *
 * @function
 * @param {string} str - The string to be checked and parsed.
 * @returns {number|null} The parsed number if the input is a valid number, or null if it's not.
 */
function isNumber(str) {
  const num = parseFloat(str);
  if (!isNaN(num)) {
    return parseInt(num);
  } else {
    return null; // Or any other value or message to indicate it's not a number
  }
}

/**
 * Updates delivery preferences with additional cost and status information.
 *
 * @function
 * @param {Array} selected - An array of selected delivery preferences.
 * @param {Array} preferences - An array of all available delivery preferences.
 * @returns {Array} An updated array of delivery preferences that includes cost and status information.
 */
const addCostAndStatus = (selected, preferences) => {
  
  const updatedPreferences = preferences.map(preference => {
    const matchingSelectedItem = selected.find(selectedItem => selectedItem.delivery_preference.toString() === preference._id.toString());
    let name = preference.name
    if (matchingSelectedItem) {
      return { ...matchingSelectedItem, name};
    }
    return preference;
  });
  return updatedPreferences;

};

/**
 * Remove all occurrences of a specific substring from a given string.
 *
 * This function creates a regular expression to match and remove all occurrences of a specific
 * substring from a given string and returns the modified string.
 *
 * @param {string} str - The string from which to remove occurrences of the substring.
 * @param {string} finder - The substring to be removed from the string.
 *
 * @returns {string} The modified string with all occurrences of the substring removed.
 */
const trim = (str, finder) => {
  // Create a regular expression to match the word with word boundaries
  const regex = new RegExp(`\\b${finder}\\b`, 'gi');
  
  // Use the replace method to replace all occurrences of the word with an empty string
  const result = str.replace(regex, '');

  return result;
}

/**
 * Convert an array of slugs to an array of name-slug pairs.
 *
 * This function takes an array of slugs, converts each slug to its corresponding name using
 * the `slugToName` function, and returns an array of objects where each object contains a name
 * and slug pair.
 *
 * @param {Array<string>} arr - An array of slugs to convert to name-slug pairs.
 *
 * @returns {Array<Object>} An array of objects, each containing a name and slug pair.
 */
const arrayElementFromSlugToNameSlugPair = (arr) => {
  return arr.map(slug => {
    const name = slugToName(slug);
    return {
      name,
      slug
    };
  });
}

/**
 * Convert a slug to a human-readable name.
 *
 * This function takes a slug, splits it by underscores, capitalizes the first letter of each word,
 * and then joins the words with spaces to create a human-readable name.
 *
 * @param {string} str - The slug to be converted to a name.
 *
 * @returns {string} The human-readable name derived from the slug.
 */
const slugToName = (str) => {
  return str.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
}

const ucfirst = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Return the input unchanged if it's not a string or an empty string
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const lcfirst = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return str; // Return the input unchanged if it's not a string or an empty string
  }
  
  return str.charAt(0).toLowerCase() + str.slice(1);
}

const getFileAbsolutePath = (file_name, file_path) => {
  const currentDir = path.dirname(new URL(import.meta.url).pathname);
  const dir = path.join(currentDir, file_path);
  const fileName = path.join(dir, file_name);
  return fileName;
}

export { 
  removeKeyFromObject,
  generateSlug,
  generateUniqueSlug,
  between,
  removeEmptyProperties,
  calculateSalePrice,
  extractValues,
  parsSearchInput,
  isNumber,
  addCostAndStatus,
  extractLabel,
  trim,
  arrayElementFromSlugToNameSlugPair,
  ucfirst,
  getFileAbsolutePath,
  lcfirst
}