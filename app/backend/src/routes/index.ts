import { Router } from 'express';
import merkleRoutes from './merkleRoutes';

const router = Router()

router.use('/merkle', merkleRoutes)

export default router;