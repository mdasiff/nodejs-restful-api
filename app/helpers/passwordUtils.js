import bcrypt from 'bcrypt';

// Define the number of salt rounds for bcrypt
const saltRounds = 10;

/**
 * Hashes a plain text password using bcrypt.
 * @param {string} password - The plain text password to hash.
 * @returns {Promise<string>} A Promise that resolves to the hashed password.
 */
async function hashPassword(password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
}

/**
 * Compares a plain text password with a hashed password to check for a match.
 * @param {string} password - The plain text password to compare.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} A Promise that resolves to true if the passwords match, or false if they don't.
 */
async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
  } catch (error) {
    throw error;
  }
}

export { hashPassword, comparePassword };