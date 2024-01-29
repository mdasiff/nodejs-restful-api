import express from 'express';
const router = express.Router();

import {
    getAll,
    getProductDetail
} from '../../controllers/front/ProductController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.get('/', getAll);
middleware.get('/:slug', getProductDetail);

export default router;