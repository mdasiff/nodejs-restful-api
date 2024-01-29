import express from 'express';
const router = express.Router();
import { add, getAll, getById } from '../../controllers/ProductTagsController.js';
//import { createRules } from '../../validations/product_tag.js';

const middleware = express.Router();
router.use('/', middleware);

//middleware.post('/', createRules, add);
middleware.get('/', getAll);
middleware.get('/:id', getById);

export default router;