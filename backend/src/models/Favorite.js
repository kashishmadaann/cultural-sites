const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CulturalSite',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only favorite a site once
FavoriteSchema.index({ user: 1, site: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema); 