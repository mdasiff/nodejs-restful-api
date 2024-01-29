import express from 'express';
const router = express.Router();
import { getAll } from '../../controllers/TaxController.js';

const middleware = express.Router();
router.use('/', middleware);


export default router;