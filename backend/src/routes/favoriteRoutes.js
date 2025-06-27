const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getFavorites,
  addFavorite,
  removeFavorite,
  checkFavorite
} = require('../controllers/favoriteController');

// All routes are protected
router.use(protect);

router.route('/')
  .get(getFavorites);

router.route('/check/:siteId')
  .get(checkFavorite);

router.route('/:siteId')
  .post(addFavorite)
  .delete(removeFavorite);

module.exports = router; 