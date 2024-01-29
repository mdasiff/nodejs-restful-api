import express from 'express';
const router = express.Router();
import {
    create,
    getAll,
    getById,
    update,
    destroy 
} from '../../controllers/UserController.js';
import { createRules } from '../../validations/user.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', createRules, create);
middleware.get('/', getAll);
middleware.get('/:id', getById);
middleware.put('/:id', update);
middleware.delete('/:id', destroy);

export default router;