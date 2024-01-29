import express from 'express';
const router = express.Router();
import { create,
    getAll,
    getAllDeleted,
    getById,
    update,
    destroy,
    restore,
    getAllParents
} from '../../controllers/CategoryController.js';
import { createRules } from '../../validations/category.js';
import { upload } from '../../helpers/fileUpload.js';

const middleware = express.Router();
router.use('/', middleware);

middleware.post('/', upload.single('image'), createRules, create);
middleware.get('/', getAll);
middleware.get('/parents/', getAllParents);
middleware.get('/deleted', getAllDeleted);
middleware.get('/:id', getById);
middleware.put('/:id', upload.single('image'), createRules, update);
middleware.delete('/:id', destroy);
middleware.delete('/restore/:id', restore);

export default router;