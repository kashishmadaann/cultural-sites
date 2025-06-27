const express = require('express');
const {
  getSites,
  getSite,
  createSite,
  updateSite,
  deleteSite,
} = require('../controllers/culturalSiteController');
const { protect /*, authorize */ } = require('../middleware/authMiddleware'); // Import authorize if you use roles

const router = express.Router();

router
  .route('/')
  .get(getSites)
  // Example: protect route, only admins can create (uncomment authorize and set up roles)
  // .post(protect, authorize('admin', 'publisher'), createSite);
  .post(protect, createSite); // For now, any logged-in user can create

router
  .route('/:id')
  .get(getSite)
  // Example: protect route, only admins or site owner can update/delete
  // .put(protect, authorize('admin', 'publisher'), updateSite)
  // .delete(protect, authorize('admin', 'publisher'), deleteSite);
  .put(protect, updateSite) // For now, any logged-in user who created it (add logic in controller) or admin
  .delete(protect, deleteSite); // For now, any logged-in user who created it (add logic in controller) or admin

module.exports = router; 