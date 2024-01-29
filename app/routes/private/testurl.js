import express from 'express';
const router = express.Router();

import {
    testurl
} from '../../controllers/SitesettingController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.get('/', testurl);

export default router;