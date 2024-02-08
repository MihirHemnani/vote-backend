import express from 'express'
import { createPoll, getPolls, getSinglePoll, userPoll, votePoll } from '../controllers/pollControllers.js';
const router = express.Router();

router.get('/', getPolls)
router.post('/', createPoll)
router.get('/:id', getSinglePoll)
router.post('/vote/:id', votePoll)
router.get('/userpolls/:id', userPoll)


export default router