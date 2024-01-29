import express from 'express';
const router = express.Router();
import { 
    addToCartRules,
    getAllRules,
    itemDeleteRules,
    checkoutRules
} from '../../validations/cart.js';
import {
    getAll,
    addToCart,
    destroy,
    checkout
} from '../../controllers/front/CartController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', getAllRules, getAll);
middleware.post('/checkout', checkoutRules, checkout);
middleware.post('/add', addToCartRules, addToCart);
middleware.delete('/item/:id', itemDeleteRules, destroy);
middleware.post('/checkout', checkoutRules, checkout);

export default router;