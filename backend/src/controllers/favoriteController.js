const Favorite = require('../models/Favorite');
const CulturalSite = require('../models/CulturalSite');

// @desc    Get user's favorite sites
// @route   GET /api/favorites
// @access  Private
exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate({
        path: 'site',
        select: 'name description category latitude longitude imageUrl'
      });

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites.map(fav => fav.site)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a site to favorites
// @route   POST /api/favorites/:siteId
// @access  Private
exports.addFavorite = async (req, res, next) => {
  try {
    // Check if site exists
    const site = await CulturalSite.findById(req.params.siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: 'Cultural site not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user.id,
      site: req.params.siteId
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Site is already in favorites'
      });
    }

    // Create favorite
    const favorite = await Favorite.create({
      user: req.user.id,
      site: req.params.siteId
    });

    res.status(201).json({
      success: true,
      data: favorite
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a site from favorites
// @route   DELETE /api/favorites/:siteId
// @access  Private
exports.removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      user: req.user.id,
      site: req.params.siteId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if a site is favorited by user
// @route   GET /api/favorites/check/:siteId
// @access  Private
exports.checkFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOne({
      user: req.user.id,
      site: req.params.siteId
    });

    res.status(200).json({
      success: true,
      data: {
        isFavorited: !!favorite
      }
    });
  } catch (error) {
    next(error);
  }
}; 