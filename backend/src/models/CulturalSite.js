const mongoose = require('mongoose');

const CulturalSiteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name for the cultural site'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
  },
  latitude: {
    type: Number,
    required: [true, 'Please add a latitude'],
  },
  longitude: {
    type: Number,
    required: [true, 'Please add a longitude'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    // Example: enum: ['Museum', 'Monument', 'Theatre', 'Gallery', 'Historic Site', 'Other']
  },
  address: {
    type: String,
  },
  website: {
    type: String,
    match: [
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  imageUrl: { // URL to an image of the site
    type: String,
  },
  // Potentially add user who submitted it, or other relevant fields
  // user: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: 'User',
  //   required: true // If sites are user-submitted
  // },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically by Mongoose
});

// You might want to add geospatial indexing for efficient location-based queries later
// CulturalSiteSchema.index({ location: '2dsphere' }); // If storing location as GeoJSON point

module.exports = mongoose.model('CulturalSite', CulturalSiteSchema); 