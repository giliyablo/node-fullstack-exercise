import express from 'express';
import { register, login, verify, refresh } from '../controllers/auth.js';

const router = express.Router();

// Middleware for error handling
const handleErrors = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.post('/authentication/register', handleErrors(register));
router.post('/authentication/login', handleErrors(login));
router.get('/authentication/verify', handleErrors(verify));
router.get('/authentication/refresh', handleErrors(refresh));

export default router;
