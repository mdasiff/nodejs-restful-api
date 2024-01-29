import express from 'express';
const router = express.Router();

import {
    getSlider
} from '../../controllers/front/HomeController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.get('/slider', getSlider);

export default router;