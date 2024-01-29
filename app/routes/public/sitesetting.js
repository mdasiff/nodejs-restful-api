import express from 'express';
const router = express.Router();
//import { loginRules } from '../../validations/admin.js';
import {
    getSiteSetting
} from '../../controllers/front/SiteSettingController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.get('/', getSiteSetting);

export default router;