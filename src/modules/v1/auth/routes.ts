import { Router } from 'express';
import { checkuser } from './controllers';
import { verifySignup, verifySignin, getUserInfo } from './controllers';
import auth  from '../../../middlewares/auth';
const router = Router();

router.post('/checkuser', checkuser);
router.post('/signup', verifySignup);
router.post('/signin', verifySignin);
router.get('/me',auth, getUserInfo);

export default router;
