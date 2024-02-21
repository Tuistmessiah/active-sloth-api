import express from 'express';

import authController from '../controllers/auth.controller';
import { deleteMe, updateMe } from '../controllers/user.controller';

import { protect } from '../middleware/permissions.middleware';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(protect());

router.get('/check-session', authController.checkSession);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

export default router;
