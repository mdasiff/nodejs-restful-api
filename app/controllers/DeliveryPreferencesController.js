import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import DeliveryPreference from '../models/DeliveryPreference.js';
import { UPDATED, CREATED, NOT_FOUND, CATCH_ERROR } from '../config/messages.js';
import { addCostAndStatus } from '../helpers/common.js';

const getAll = async (req, res) => {
  try {
    const preferences = await DeliveryPreference.find({}).sort({ sortBy: 1 });
    res.status(200).json(preferences);
  } catch (error) {
   res.status(500).json({ error: CATCH_ERROR });
  }
}

const getDeliveryPreferencesByAdminId = async (req, res) => {
  try {
    const preferences = await DeliveryPreference.find({});

    const admin_id = req.params.admin_id;
  
    const data = await Admin.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(admin_id)
        }
      },
      {
        $unwind: "$vendor.delivery_preferences"
      },
      {
        $group: {
          _id: "$_id", // Group by admin ID
          values: {
            $push: "$vendor.delivery_preferences" // Push deleted addresses into an array
          }
        }
      }
    ]);
    const selected = data.length > 0 ? data[0].values : [];

    let updatedPreferences = addCostAndStatus(selected, preferences);

    res.status(200).json(updatedPreferences);
   
  } catch (error) {
   res.status(500).json({ error: CATCH_ERROR });
  }
}

const addUpdateDeliveryPreference = async (req, res) => {
 try {
    const { delivery_preference, cost, status } = req.body;
    const userId = req.params.id;
  
    // Specify the update data for the 'address' subdocument
    
    const filter = {
      _id: userId,
      roles_name: { $in: ['Vendor'] } // Condition to check if vendorId is in roles array
    };

    const admin = await Admin.findById(filter).select('vendor');

    if (!admin) {
      res.status(500).json({ error: error.message });
    }

    const newData = {
      delivery_preference
    };

    let isDuplicate = false;
    let delivery_preference_id = false;

    if(admin.vendor && admin.vendor.delivery_preferences)
    {
      isDuplicate = admin.vendor.delivery_preferences.some((existingData) => {
        delivery_preference_id = existingData.delivery_preference.toString();
        return (
          delivery_preference_id === newData.delivery_preference
        );
      });
    }

    if (isDuplicate && delivery_preference_id) {
      
      //record already exists, update it now.
      const updatedAdmin = await Admin.findOneAndUpdate(
        {
          'vendor.delivery_preferences.delivery_preference': delivery_preference_id
        },
        {
          $set: {
            'vendor.delivery_preferences.$.cost': cost,
            'vendor.delivery_preferences.$.status': status,
          },
        },
        { new: true }
      );
      if (updatedAdmin) {
        res.status(200).json({ message: UPDATED });
      } else {
        res.status(500).json({ message: NOT_FOUND });
      }
      
    } else {

      if (!admin.vendor) {
        admin.vendor = {};
      }
      
      if (!admin.vendor.delivery_preferences) {
        admin.vendor.delivery_preferences = [];
      }

      admin.vendor.delivery_preferences.push({
        delivery_preference,
        cost,
        status
      });

      await admin.save();
    
      res.status(200).json({ message: CREATED });
    }
  } catch (error) {
    //Handle any errors that occur during the update process
   res.status(500).json({ error: error.message });
  }  
}

export { 
  getDeliveryPreferencesByAdminId,
  addUpdateDeliveryPreference,
  getAll
}