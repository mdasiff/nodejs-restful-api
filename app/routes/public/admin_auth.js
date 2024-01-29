import express from 'express';
const router = express.Router();
import { login } from '../../controllers/auth/AuthController.js';
import { loginRules } from '../../validations/admin.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/login', loginRules, login);

export default router;