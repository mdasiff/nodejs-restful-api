import express from 'express';
const router = express.Router();

import {
    getAll,
    destroy,
    addToCart
} from '../../controllers/CartController.js';

import { createRules } from '../../validations/cart.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', createRules, addToCart);
middleware.get('/', getAll);
middleware.delete('/:id', destroy);

export default router;