import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import DeliveryPreference from '../models/DeliveryPreference.js';
import { DELIVERY_PREFERENCES } from '../config/constants.js';

import { 
  INVALID_VENDOR,
  UPDATED,
  CREATED,
  NOT_FOUND,
  DUPLICATE,
  DELETED,
  CATCH_ERROR,
  RESTORED,
  EMPTY_RECORD
} from '../config/messages.js';

const storeServiceAreaById = async (req, res) => {
  try {
    const data = await getServiceAreaById(req.params.id);
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: NOT_FOUND });
    }
  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
};

const updateServiceArea = async (req, res) => {
  try {
    const { address, city, state, pincode, landmark } = req.body;
    const id = req.params.id;

    // Use updateOne to update the subdocument
    const filter = { 'vendor.service_areas._id': id };
    const update = { $set: {
      'vendor.service_areas.$.pincode': pincode,
      'vendor.service_areas.$.address': address,
      'vendor.service_areas.$.city': city,
      'vendor.service_areas.$.state': state,
      'vendor.service_areas.$.landmark': landmark,
    } }
    const result = await Admin.findOneAndUpdate(filter, update, { new: true });

    if (result === 0) {
      // Handle the case where the update did not modify any documents
      res.status(500).json({ error: CATCH_ERROR });
    }
    else {
      const data = await Admin.findOne({ 'vendor.service_areas': { $elemMatch: { _id: id } } })
      .select('vendor.service_areas');
      
      res.status(200).json({ message: UPDATED, data });
    }

  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}

const getServiceAreaById = async (id) => {
  
  try {
    const data = await Admin.findOne({ 'vendor.service_areas': { $elemMatch: { _id: id } } })
      .select('vendor.service_areas');

    if (data && data.vendor && data.vendor.service_areas) {
      return data.vendor.service_areas.id(id);
    } else {
      return false;
    }
    
  } catch (error) {
    throw new Error(error);
  }
}

const getDPIdByName = async (name) => {
  const dp = await DeliveryPreference.findOne({name:name});
  return dp;
}

/**
 * Adds service areas to a vendor's profile by associating addresses with the vendor.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing addresses to add.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If there is an issue finding the vendor or saving the updated vendor profile.
 * @returns {Object} A JSON response indicating the success of the operation.
 */
const addServiceArea = async (req, res) => {
  
  try {
    const { addresses } = req.body;
    const userId = req.params.id;
   
    // Filter to find the vendor by their ID and check their role
    const filter = {
      _id: userId,
      roles: { roles_name: { $in: ['Vendor'] } } // Condition to check if vendorId is in roles array
    };

    const admin = await Admin.findById(filter).select('vendor');

    if (!admin) {
      res.status(500).json({ error: error.message });
    }

    //console.log(addresses, admin.vendor.service_areas);
    
    // Loop through the addresses array
    for (const addressId of addresses) {
      // Check if the addressId already exists in the service_areas array
      let isDuplicate = false;

      if (admin.vendor && admin.vendor.service_areas && admin.vendor.service_areas.length > 0) {
        isDuplicate = admin.vendor.service_areas.some((area) =>
          area.address.equals(addressId)
        );
      }

      if (isDuplicate) {
        console.log(`Duplicate addressId ${addressId}. Ignoring.`);
        continue; // Skip this addressId and move to the next one
      }

      //get standard delivery detail
      const constdp = DELIVERY_PREFERENCES.standard_delivery;

      const dp = await getDPIdByName(constdp.name);
      
      // Create a new service area object
      const newServiceArea = {
        address: addressId,
        delivery_preferences:[
          {
            delivery_preference:dp._id,
            name:dp.name,
            cost:constdp.cost
          }
        ]
      };

      if (!admin.vendor) {
        admin.vendor = {};
      }

      if (!admin.vendor.service_areas) {
        admin.vendor.service_areas = [];
      }      

      // Push the new service area into the service_areas array
      admin.vendor.service_areas.push(newServiceArea);
    }

    // Save the updated admin document
    await admin.save();
      
    res.status(200).json({ message: CREATED });

    
  } catch (error) {
    //Handle any errors that occur during the update process
   res.status(500).json({ error: error.message });
  }  
}

const destroyServiceArea = async (req, res) => {
  try {
    
    const id = req.params.id;

    // Use updateOne to update the subdocument
    const filter = { 'vendor.service_areas._id': id };
    const update = { $set: {
      'vendor.service_areas.$.deletedAt': new Date()
    } }
    const result = await Admin.findOneAndUpdate(filter, update, { new: true });

    if (result === 0) {
      // Handle the case where the update did not modify any documents
      res.status(500).json({ error: CATCH_ERROR });
    }
    else {
      res.status(200).json({ message: DELETED });
    }

  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}
const restoreServiceArea = async (req, res) => {
  try {
    
    const id = req.params.id;

    // Use updateOne to update the subdocument
    const filter = { 'vendor.service_areas._id': id };
    const update = { $set: {
      'vendor.service_areas.$.deletedAt': null
    } }
    const result = await Admin.findOneAndUpdate(filter, update, { new: true });

    if (result === 0) {
      // Handle the case where the update did not modify any documents
      res.status(500).json({ error: CATCH_ERROR });
    }
    else {
      res.status(200).json({ message: RESTORED });
    }

  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}

/**
 * Retrieve service areas for an admin by admin_id.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response containing service areas or error messages.
 */
 const getServiceAreaByAdminId = async (req, res) => {
  try {
    // Extract the admin_id from the request parameters
    const userId = req.params.admin_id;
    
    // Find the admin by admin_id and populate the vendor and service_areas
    const admin = await Admin.findOne({
      _id: userId,
      roles_name: { $in: ['Vendor'] },  // Condition to check if vendorId is in roles array
    })
    .populate({
      path: 'vendor',
      populate: {
        path: 'service_areas.address',
        model: 'Address',
      },
    })
    .populate({
      path: 'vendor',
      populate: {
        path: 'service_areas.delivery_preferences.delivery_preference',
        model: 'DeliveryPreference',
      },
    })

    // Handle case when admin is not found
    if (!admin) {
      return res.status(404).json({ error: NOT_FOUND });
    }

    // Handle case when no vendor or service areas are associated with the admin
    if (!admin.vendor || !admin.vendor.service_areas) {
      return res.status(200).json({ error: EMPTY_RECORD });
    }

    // Retrieve the service areas
    const serviceAreas = admin.vendor.service_areas;
    //console.log(serviceAreas);
    
    // Return the service areas in the response
    res.status(200).json(serviceAreas);
  } catch (error) {
    //console.error(error);

    // Handle internal server error
    res.status(500).json({ error: CATCH_ERROR });
  }
};

const getDeletedServiceAreaByAdminId = async (req, res) => {
  try {
    
    const admin_id = req.params.admin_id;
  
    const data = await Admin.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(admin_id)
        }
      },
      {
        $unwind: "$vendor.service_areas"
      },
      {
        $match: {
          "vendor.service_areas.deletedAt": {
            $ne: null
          }
        }
      },
      {
        $group: {
          _id: "$_id", // Group by admin ID
          addresses: {
            $push: "$vendor.service_areas" // Push deleted addresses into an array
          }
        }
      }
    ]);

    const flattenedArr = data.length > 0 ? data[0].addresses : [];
    res.status(200).json(flattenedArr);
   
  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}

/**
 * Updates delivery preferences for a specific service area of a vendor.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object containing admin_id and service_area_id in parameters,
 *                       and cost and status in the request body.
 * @param {Object} res - The HTTP response object.
 * @throws {Error} If cost or status arrays are empty or if the vendor or service area is not found.
 * @returns {Object} A JSON response indicating the success of the update.
 */
 async function updateDeliveryPreferences(req, res) {
  //try{
    const {admin_id, service_area_id} = req.params;
    const {cost, status} = req.body;
    

    // Check if cost or status arrays are empty
    if(cost.lenght<1 || status.length<1)
      return res.status(404).json({ error: CATCH_ERROR });

    // Convert the request data to a specific format also ignore InActive
    const convertedData = convertDPData(req.body);
    //console.log(convertedData);
    const filter = {
      _id: admin_id,
      roles: { roles_name: { $in: ['Vendor'] } }
    };

    // Find the admin if roles contains 'Vendor' role
    const admin = await Admin.findById(filter).select('vendor');
      
    // Find the service area within the vendor's service_areas array
    const serviceArea = admin.vendor.service_areas.find(sa => sa._id.toString() === service_area_id);

    // If the service area is not found, respond with an error
    if (!serviceArea) {
      return res.status(404).json({ error: 'Service area not found' });
    }

    //remove all delivery preferences before save
    serviceArea.delivery_preferences = [];

    await admin.save();

    //loop through the entire requests
    for (const iteration in convertedData) {
      
      const dpName = convertedData[iteration].name;
      const dpSlug = convertedData[iteration].slug;
      const dpCost = convertedData[iteration].cost;
      const dpStatus = convertedData[iteration].status;
      
      //check delivery preference exists?
      //const deliveryPreference = serviceArea.delivery_preferences.find(pref => pref.name === dpName);
      
      const dp = await getDPIdByName(dpName);
      const newDeliveryPreference = {
        delivery_preference: dp._id,
        name: dpName,
        slug: dpSlug,
        cost: dpCost,
        status: dpStatus
      };
      serviceArea.delivery_preferences.push(newDeliveryPreference);

      await admin.save();
      
    }
      // Respond with a 200 OK status and a success message
      res.status(200).send({message: UPDATED});
    //} catch (error) {
      // Handle any errors that occur during the update process and respond with a 500 Internal Server Error
    //  res.status(500).json({ error: error.message });
    //}
}
async function updateDeliveryPreferences__(req, res) {
  try{
    const {admin_id, service_area_id} = req.params;
    const {cost, status} = req.body;
    

    // Check if cost or status arrays are empty
    if(cost.lenght<1 || status.length<1)
      return res.status(404).json({ error: CATCH_ERROR });

    // Convert the request data to a specific format
    const convertedData = convertDPData(req.body);
    //console.log(convertedData);
    const filter = {
      _id: admin_id,
      roles: { roles_name: { $in: ['Vendor'] } }
    };

    // Find the admin if roles contains 'Vendor' role
    const admin = await Admin.findById(filter).select('vendor');
      
    // Find the service area within the vendor's service_areas array
    const serviceArea = admin.vendor.service_areas.find(sa => sa._id.toString() === service_area_id);

    // If the service area is not found, respond with an error
    if (!serviceArea) {
      return res.status(404).json({ error: 'Service area not found' });
    }
    //loop through the entire requests
    for (const iteration in convertedData) {
      
      const dpName = convertedData[iteration].name;
      const dpSlug = convertedData[iteration].slug;
      const dpCost = convertedData[iteration].cost;
      const dpStatus = convertedData[iteration].status;
      if(dpStatus=='Active')
      {
        //check delivery preference exists?
        const deliveryPreference = serviceArea.delivery_preferences.find(pref => pref.name === dpName);
        
        if (deliveryPreference) {
          //exists: update its value
          deliveryPreference.slug = dpSlug;
          deliveryPreference.cost = dpCost;
          deliveryPreference.status = dpStatus;
        } else {
          //not exists: create new
          //Get delivery preference by name
          const dp = await getDPIdByName(dpName);

          const newDeliveryPreference = {
            delivery_preference: dp._id,
            name: dpName,
            slug: dpSlug,
            cost: dpCost,
            status: dpStatus
          };
          serviceArea.delivery_preferences.push(newDeliveryPreference);
        }
        await admin.save();
      }
      else
      {
        //console.log(deliveryPreference, dpStatus, dpName);
        // Find the index of the delivery preference with the given name
        const index = serviceArea.delivery_preferences.findIndex(pref => pref.name === dpName);
        if (index !== -1) {
          //console.log('elsee',index); 
          // Remove the delivery preference from the array
          serviceArea.delivery_preferences.splice(index, 1);
        }
      }
    }
      // Respond with a 200 OK status and a success message
      res.status(200).send({message: UPDATED});
    } catch (error) {
      // Handle any errors that occur during the update process and respond with a 500 Internal Server Error
      res.status(500).json({ error: error.message });
    }
}

/**
 * Converts the delivery preferences data from the request body to a specific format.
  =====Input=====
  {
      "cost": {
          "express_delivery": 22,
          "midnight_delivery": 200,
          "morning_delivery": 0
      },
      "status": {
          "express_delivery": "Active",
          "midnight_delivery": "Active",
          "morning_delivery": "InActive"
      }
  }

  =====result coverted=====
  {
      cost {
          name: "express_delivery",
          value: 22
      },
      {
          name: "midnight_delivery",
          value: 200
      },
      {
          name: "morning_delivery",
          value: 20
      }
  }

 * @function
 * @param {Object} inputData - The delivery preferences data from the request body.
 * @returns {Array} An array of delivery preference objects in the converted format.
 */
function convertDPData(inputData) {
  const {cost, status} = inputData;
  const result = [];

  for (const deliveryType in cost) {
    const status1 = status[deliveryType];

    //consider only active
    if(status1=='Active')
    {
      const slug = deliveryType;
      const cost1 = cost[deliveryType];
      const name = DELIVERY_PREFERENCES[slug].name;

      result.push({
        name,
        slug,
        cost:cost1,
        status:status1
      });
    }
  }

  return result;
}

export {
  updateDeliveryPreferences,
  updateServiceArea,
  addServiceArea,
  storeServiceAreaById,
  destroyServiceArea,
  restoreServiceArea,
  getServiceAreaByAdminId,
  getDeletedServiceAreaByAdminId,
  
}