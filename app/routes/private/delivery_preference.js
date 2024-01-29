import express from 'express';
const router = express.Router();
import { 
    getAll
} from '../../controllers/DeliveryPreferencesController.js';

const middleware = express.Router();

router.use('/', middleware);
middleware.get('/', getAll);

export default router;