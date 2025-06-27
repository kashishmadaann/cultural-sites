const CulturalSite = require('../models/CulturalSite');

// @desc    Get all cultural sites
// @route   GET /api/sites
// @access  Public
exports.getSites = async (req, res, next) => {
  try {
    // Basic query. Add filtering/searching later e.g., by category or keyword
    // let query = CulturalSite.find();
    // if (req.query.category) {
    //   query = query.where('category').equals(req.query.category);
    // }
    // const sites = await query;

    const sites = await CulturalSite.find();
    res.status(200).json({ success: true, count: sites.length, data: sites });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cultural site by ID
// @route   GET /api/sites/:id
// @access  Public
exports.getSite = async (req, res, next) => {
  try {
    const site = await CulturalSite.findById(req.params.id);
    if (!site) {
      return res.status(404).json({ success: false, message: `Site not found with id of ${req.params.id}` });
    }
    res.status(200).json({ success: true, data: site });
  } catch (error) {
    // Catches CastError if ID format is wrong
    next(error);
  }
};

// @desc    Create new cultural site
// @route   POST /api/sites
// @access  Private (implement role-based access later if needed, e.g. admin)
exports.createSite = async (req, res, next) => {
  try {
    // Add user to req.body if sites are user-submitted and protect middleware is used
    // req.body.user = req.user.id;

    const site = await CulturalSite.create(req.body);
    res.status(201).json({ success: true, data: site });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cultural site
// @route   PUT /api/sites/:id
// @access  Private
exports.updateSite = async (req, res, next) => {
  try {
    let site = await CulturalSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({ success: false, message: `Site not found with id of ${req.params.id}` });
    }

    // Add authorization check: Make sure user is owner or admin
    // if (site.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(401).json({ success: false, message: 'Not authorized to update this site' });
    // }

    site = await CulturalSite.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Run Mongoose validators on update
    });

    res.status(200).json({ success: true, data: site });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cultural site
// @route   DELETE /api/sites/:id
// @access  Private
exports.deleteSite = async (req, res, next) => {
  try {
    const site = await CulturalSite.findById(req.params.id);

    if (!site) {
      return res.status(404).json({ success: false, message: `Site not found with id of ${req.params.id}` });
    }

    // Add authorization check: Make sure user is owner or admin
    // if (site.user.toString() !== req.user.id && req.user.role !== 'admin') {
    //   return res.status(401).json({ success: false, message: 'Not authorized to delete this site' });
    // }

    await site.deleteOne(); // or site.remove() in older Mongoose versions

    res.status(200).json({ success: true, data: {} }); // Or 204 No Content
  } catch (error) {
    next(error);
  }
}; 