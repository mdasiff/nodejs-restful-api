import fs from 'fs/promises';
import path from 'path';
import { trim } from './common.js';

/**
 * Read the contents of a directory and return file names.
 *
 * This function reads the contents of a directory, lists the files within it, and returns an array
 * containing the names of the files (with the '.js' extension removed).
 *
 * @param {string} directoryPath - The path to the directory to read.
 *
 * @returns {Array<string>} An array of file names in the directory (with '.js' extension removed).
 */
const readDirectory = async (directoryPath) => {
  try {
    const files = await fs.readdir(directoryPath);
    const filesName = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const stats = await fs.stat(filePath);

      if (stats.isFile()) {
        //console.log('File:', filePath);
        filesName.push(trim(file, '.js'));
        // You can perform operations on each file here.
      }
    }

    return filesName;
  } catch (err) {
    console.error('Error reading directory:', err);
    return [];
  }
};

export default readDirectory;