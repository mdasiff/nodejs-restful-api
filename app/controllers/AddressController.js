import Pincode from '../models/Pincode.js';
import Address from '../models/Address.js';
import Apple from '../models/Apple.js';
import { parsSearchInput, isNumber } from '../helpers/common.js';

/**
 * Searches for pincode information based on a provided search term, which can be a pincode or location details.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The pincode information that matches the search term.
 * @throws {Error} If an error occurs during the search process.
 */
const search = async (req, res) => {
  try {
    const searchTerm = req.query.key;
    
    let finder;
    let n = isNumber(searchTerm);
    if(n) {
      finder = [
        { pincode: n }
      ];
    }
    else {
      finder = [
        { officeName: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
        { taluk: { $regex: searchTerm, $options: 'i' } },
        { districtName: { $regex: searchTerm, $options: 'i' } },
        { stateName: { $regex: searchTerm, $options: 'i' } }
      ];
    }

    const query = {
      $or: finder
    };

    const data = await Pincode.find(query);
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/**
 * Searches for locations near a given pincode based on latitude and longitude coordinates.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The list of nearby addresses based on the given pincode's coordinates.
 */
const searchLatLong = async (req, res) => {
  const { pincode } = req.query;
  // Get the latitude and longitude of the given pincode
  const pincodeAddress = await Apple.findOne({ Postcode: pincode });
  const latitude = pincodeAddress.Latitude;
  const longitude = pincodeAddress.Longitude;
  console.log(pincodeAddress);

  //const maxDistance = 10 / 3963.2; // 10 kilometers in radians

  const radiusInKilometers = 10;
  const result = await Apple.find({
    Latitude: {
      $gte: latitude - (radiusInKilometers / 111.32), // Approximate conversion from degrees to kilometers
      $lte: latitude + (radiusInKilometers / 111.32),
    },
    Longitude: {
      $gte: longitude - (radiusInKilometers / (111.32 * Math.cos(latitude * (Math.PI / 180)))), // Adjust for longitude
      $lte: longitude + (radiusInKilometers / (111.32 * Math.cos(latitude * (Math.PI / 180)))), // Adjust for longitude
    },
  });

  // Return the nearby addresses
  res.status(200).json(result);
};

/**
 * Searches for addresses based on a provided pincode.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The list of addresses matching the provided pincode.
 * @throws {Error} If the pincode is not exactly 6 characters long or if an error occurs during the search process.
 */
const searchByPincode = async (req, res) => {
  try {
    const pincode = req.query.key;
    
    if (pincode.length !== 6) {
      res.status(500).json({ error: 'Pincode must be exactly 6 characters long.' });
    }else {
      const data = await Address.find({ Pincode: pincode });
      res.status(200).json(data);
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Searches for addresses based on a provided search term, which can be a pincode or location details.
 *
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Object} The list of addresses that match the search term, which can be a pincode or location details.
 * @throws {Error} If an error occurs during the search process.
 */
const searchAddress = async (req, res) => {
  try {
    const searchTerm = req.query.key;
    let finder;
    let n = isNumber(searchTerm);
    if(n) {
      finder = [
        { Pincode: n }
      ];
    }
    else {
      finder = [
        { CircleName: { $regex: searchTerm, $options: 'i' } }, // Case-insensitive search
        { RegionName: { $regex: searchTerm, $options: 'i' } },
        { DivisionName: { $regex: searchTerm, $options: 'i' } },
        { OfficeName: { $regex: searchTerm, $options: 'i' } },
        { District: { $regex: searchTerm, $options: 'i' } },
        { StateName: { $regex: searchTerm, $options: 'i' } },
      ];
    }

    const query = {
      $or: finder
    };

    const data = await Address.find(query);
    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  search,
  searchLatLong,
  searchByPincode,
  searchAddress
}