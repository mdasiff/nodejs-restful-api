import express from 'express';
const router = express.Router();
import { 
    getAll, 
    getById 
} from '../../controllers/VendorController.js';

import {
    updateStoreAddress,
    addStoreAddress,
    storeAddressGetById,
    destroyStoreAddress,
    restoreStoreAddress,
    getStoreAddressesByAdminId,
    getDeletedStoreAddressesByAdminId
} from '../../controllers/StoreAddressController.js';

import { 
    updateServiceArea,
    addServiceArea,
    storeServiceAreaById,
    destroyServiceArea,
    restoreServiceArea,
    getServiceAreaByAdminId,
    getDeletedServiceAreaByAdminId,
    updateDeliveryPreferences
} from '../../controllers/ServiceAreaController.js';

import { 
    getDeliveryPreferencesByAdminId,
    addUpdateDeliveryPreference
} from '../../controllers/DeliveryPreferencesController.js';


const middleware = express.Router();
router.use('/', middleware);
middleware.get('/', getAll);
middleware.get('/:id', getById);

//store address
middleware.get('/:admin_id/store_address', getStoreAddressesByAdminId);
middleware.get('/:admin_id/store_address/deleted', getDeletedStoreAddressesByAdminId);
middleware.get('/store_address/:id', storeAddressGetById);
middleware.post('/store_address/:id', addStoreAddress);
middleware.delete('/store_address/:id', destroyStoreAddress);
middleware.delete('/store_address/restore/:id', restoreStoreAddress);
middleware.put('/store_address/:id', updateStoreAddress);

//service area
middleware.get('/:admin_id/service_area', getServiceAreaByAdminId);
middleware.get('/:admin_id/service_area/deleted', getDeletedServiceAreaByAdminId);
middleware.get('/service_area/:id', storeServiceAreaById);
middleware.post('/service_area/:id', addServiceArea);
middleware.delete('/service_area/:id', destroyServiceArea);
middleware.delete('/service_area/restore/:id', restoreServiceArea);
middleware.put('/service_area/:id', updateServiceArea);

//delivery prefrences
middleware.get('/:admin_id/delivery_preference', getDeliveryPreferencesByAdminId);
middleware.post('/delivery_preference/:id', addUpdateDeliveryPreference);
middleware.put('/delivery_preference/:admin_id/:service_area_id', updateDeliveryPreferences);

export default router;