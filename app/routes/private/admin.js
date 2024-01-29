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
    } from '../../controllers/AdminController.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', create);
middleware.get('/', getAll);
middleware.get('/deleted', getAllDeleted);
middleware.get('/:id', getById);
middleware.put('/:id', update);
middleware.delete('/:id', destroy);
middleware.delete('/restore/:id', restore);

export default router; 