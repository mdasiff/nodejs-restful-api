import mongoose from 'mongoose';
import Admin from '../models/Admin.js';

import { UPDATED, CREATED, NOT_FOUND, DUPLICATE, DELETED, CATCH_ERROR, RESTORED } from '../config/messages.js';

const storeAddressGetById = async (req, res) => {
  try {
    const data = await getStoreAddressById(req.params.id);
    if(data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: NOT_FOUND });
    }
  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
};

const updateStoreAddress = async (req, res) => {
  try {
    const { address, city, state, pincode, landmark } = req.body;
    const id = req.params.id;

    // Use updateOne to update the subdocument
    const filter = { 'vendor.store_addresses._id': id };
    const update = { $set: {
      'vendor.store_addresses.$.pincode': pincode,
      'vendor.store_addresses.$.address': address,
      'vendor.store_addresses.$.city': city,
      'vendor.store_addresses.$.state': state,
      'vendor.store_addresses.$.landmark': landmark,
    } }
    const result = await Admin.findOneAndUpdate(filter, update, { new: true });

    if (result === 0) {
      // Handle the case where the update did not modify any documents
      res.status(500).json({ error: CATCH_ERROR });
    }
    else {
      const data = await Admin.findOne({ 'vendor.store_addresses': { $elemMatch: { _id: id } } })
      .select('vendor.store_addresses');
      
      res.status(200).json({ message: UPDATED, data });
    }

  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}

const getStoreAddressById = async (id) => {
  
  try {
    const data = await Admin.findOne({ 'vendor.store_addresses': { $elemMatch: { _id: id } } })
      .select('vendor.store_addresses');

    if (data && data.vendor && data.vendor.store_addresses) {
      return data.vendor.store_addresses.id(id);
    } else {
      return false;
    }
    
  } catch (error) {
    throw new Error(error);
  }
}

const addStoreAddress = async (req, res) => {
  try {
    const { address, city, state, pincode, landmark } = req.body;
    const userId = req.params.id;
    
  
    // Specify the update data for the 'address' subdocument
    
    const filter = {
      _id: userId,
      roles: { roles_name: { $in: ['Vendor'] } } // Condition to check if vendorId is in roles array
    };

    const admin = await Admin.findById(filter).select('vendor');

    if (!admin) {
      res.status(500).json({ error: error.message });
    }

    const newAddress = {
      address: address,
      city: city,
      state: state,
      pincode: pincode
    };

    let isAddressDuplicate = false;

    if(admin.vendor && admin.vendor.store_addresses)
    {
      isAddressDuplicate = admin.vendor.store_addresses.some((existingAddress) => {
        return (
          existingAddress.address === newAddress.address &&
          existingAddress.city === newAddress.city &&
          existingAddress.state === newAddress.state &&
          existingAddress.pincode === newAddress.pincode
        );
      });
    }

    if (isAddressDuplicate) {
      res.status(500).json({ message: DUPLICATE });
    } else {

      if (!admin.vendor) {
        admin.vendor = {};
      }
      
      if (!admin.vendor.store_addresses) {
        admin.vendor.store_addresses = [];
      }

      admin.vendor.store_addresses.push({
        address: address,
        city: city,
        state: state,
        pincode: pincode,
        landmark: landmark
      });

      await admin.save();
    
      // Find and return the updated user document if needed
      const data = await Admin.findById(userId)
        .select('_id name email phone status roles deletedAt createdAt updatedAt vendor');
      res.status(200).json({ data, message: CREATED });
    }
  } catch (error) {
    // Handle any errors that occur during the update process
    res.status(500).json({ error: error.message });
  }  
}

const destroyStoreAddress = async (req, res) => {
  try {
    
    const id = req.params.id;

    // Use updateOne to update the subdocument
    const filter = { 'vendor.store_addresses._id': id };
    const update = { $set: {
      'vendor.store_addresses.$.deletedAt': new Date()
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
const restoreStoreAddress = async (req, res) => {
  try {
    
    const id = req.params.id;

    // Use updateOne to update the subdocument
    const filter = { 'vendor.store_addresses._id': id };
    const update = { $set: {
      'vendor.store_addresses.$.deletedAt': null
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

const getStoreAddressesByAdminId = async (req, res) => {
  try {
    
    const admin_id = req.params.admin_id;
  
    const data = await Admin.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(admin_id)
        }
      },
      {
        $unwind: "$vendor.store_addresses"
      },
      {
        $match: {
          "vendor.store_addresses.deletedAt": {
            $eq: null
          }
        }
      },
      {
        $group: {
          _id: "$_id", // Group by admin ID
          addresses: {
            $push: "$vendor.store_addresses" // Push deleted addresses into an array
          }
        }
      }
    ]);
    const flattenedAddresses = data.length > 0 ? data[0].addresses : [];
    res.status(200).json(flattenedAddresses);
   
  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}

const getDeletedStoreAddressesByAdminId = async (req, res) => {
  try {
    
    const admin_id = req.params.admin_id;
  
    const data = await Admin.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(admin_id)
        }
      },
      {
        $unwind: "$vendor.store_addresses"
      },
      {
        $match: {
          "vendor.store_addresses.deletedAt": {
            $ne: null
          }
        }
      },
      {
        $group: {
          _id: "$_id", // Group by admin ID
          addresses: {
            $push: "$vendor.store_addresses" // Push deleted addresses into an array
          }
        }
      }
    ]);

    const flattenedAddresses = data.length > 0 ? data[0].addresses : [];
    res.status(200).json(flattenedAddresses);
   
  } catch (error) {
    res.status(500).json({ error: CATCH_ERROR });
  }
}

export { 
  updateStoreAddress,
  addStoreAddress,
  storeAddressGetById,
  destroyStoreAddress,
  restoreStoreAddress,
  getStoreAddressesByAdminId,
  getDeletedStoreAddressesByAdminId
}