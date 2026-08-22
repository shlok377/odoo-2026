import express from 'express';
import { getRealDestinationPlaces } from '../controllers/destinationController.js';

const router = express.Router();

router.get('/places', getRealDestinationPlaces);

export default router;
