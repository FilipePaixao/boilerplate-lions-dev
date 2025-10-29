import { Router } from 'express';
import userController from '../controllers/user.controller.js';
import { ensureValidId } from '../middlewares/validate.middleware.js';

const router = Router();

router.post('/users', userController.create);
router.get('/users', userController.list);
router.get('/users/:id', ensureValidId, userController.get);
router.put('/users/:id', ensureValidId, userController.update);
router.delete('/users/:id', ensureValidId, userController.remove);

export default router;
