import { Router } from 'express';
import { registerUser } from './controllers';
import { verifySignup, verifySignin } from './controllers';
const router = Router();

router.post('/checkuser', registerUser);
router.post('/signup', verifySignup);
router.post('/signin', verifySignin);

export default router;
