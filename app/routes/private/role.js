import express from 'express';
const router = express.Router();
import {
    create,
    getAll,
    getAllDeleted,
    getById,
    update,
    destroy,
    restore
} from '../../controllers/RoleController.js';
import { createRules } from '../../validations/role.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', [createRules], create);
middleware.get('/', getAll);
middleware.get('/deleted', getAllDeleted);
middleware.get('/:id', getById);
middleware.put('/:id', [createRules], update);
middleware.delete('/:id', destroy);
middleware.delete('/restore/:id', restore);

export default router;