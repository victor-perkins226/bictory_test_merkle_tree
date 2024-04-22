import { Router } from 'express';
import merkleController from '../../controllers/merkleController';
const router = Router()

router.get('/whitelist', merkleController.getWhiteLists)
router.post('/whitelist', merkleController.addWhiteList);

export default router;