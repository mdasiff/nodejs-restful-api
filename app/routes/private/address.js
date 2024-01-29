import express from 'express';
const router = express.Router();

import { 
    search,
    searchLatLong,
    searchByPincode,
    searchAddress
} from '../../controllers/AddressController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.get('/search', search);
middleware.get('/search-lat-long', searchLatLong);
middleware.get('/search-by-pincode', searchByPincode);
middleware.get('/search_address', searchAddress);

export default router;