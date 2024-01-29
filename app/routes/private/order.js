import express from 'express';
const router = express.Router();
import { 
    getAll
} from '../../controllers/OrderController.js';

const middleware = express.Router();

router.use('/', middleware);
middleware.get('/', getAll);

export default router;