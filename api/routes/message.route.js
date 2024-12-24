import express from 'express';
import { sendMessageToAdmin } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/send-to-admin', sendMessageToAdmin);

export default router;