import express from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();



router.get('/getAllUsers', UserController.getAllUsers);
// router.get('/:id', UserController.getUser);
// router.post('/', authenticate, UserController.createUser);

export default router;