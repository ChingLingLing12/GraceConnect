import express from 'express';
import logController  from '../controllers/logController';

const router = express.Router();

router.get('/logs', (req: any, res: any) => logController.getLogs(req, res));

export default router;