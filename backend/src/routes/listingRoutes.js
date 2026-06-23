import express from 'express';
import * as listingController from '../controllers/listingController.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const validateListing = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('whatsappNumber').notEmpty().withMessage('WhatsApp number is required')
];

// Public routes
router.get('/listings', listingController.getListings);
router.get('/listings/:id', listingController.getListing);
router.get('/stats', listingController.getStats);

// NEW: Lead tracking route (public - anyone can track a lead)
router.post('/listings/:id/lead', listingController.trackLead);

// Admin routes
router.post('/admin/login', listingController.adminLogin);
router.post('/listings', validateListing, listingController.createListing);
router.put('/listings/:id', listingController.updateListing);
router.delete('/listings/:id', listingController.deleteListing);

// NEW: Lead stats (protected - admin only)
router.get('/leads/stats', listingController.getLeadStats);

export default router;
