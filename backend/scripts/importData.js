const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const CulturalSite = require('../src/models/CulturalSite');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 20000,
}).then(() => {
  console.log('MongoDB Connected...');
}).catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Helper function to validate and format URL
const formatUrl = (url) => {
  if (!url) return null;
  
  // Remove any whitespace
  url = url.trim();
  
  // If URL doesn't start with http:// or https://, add https://
  if (url && !url.match(/^https?:\/\//i)) {
    url = 'https://' + url;
  }
  
  try {
    // Validate URL format
    new URL(url);
    return url;
  } catch (e) {
    console.log(`Invalid URL format: ${url}`);
    return null;
  }
};

// Helper function to determine category and type
const determineCategories = (props) => {
  const categories = [];
  const types = [];

  // Tourism categories
  if (props.tourism) {
    categories.push(props.tourism.charAt(0).toUpperCase() + props.tourism.slice(1));
    types.push('Tourism');
  }

  // Amenity categories
  if (props.amenity) {
    categories.push(props.amenity.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));
    types.push('Amenity');
  }

  // Historic categories
  if (props.historic) {
    categories.push(props.historic.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));
    types.push('Historic');
  }

  // Shop categories
  if (props.shop) {
    categories.push(props.shop.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));
    types.push('Shop');
  }

  // Leisure categories
  if (props.leisure) {
    categories.push(props.leisure.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '));
    types.push('Leisure');
  }

  // If no categories found, try to determine from name
  if (categories.length === 0 && props.name) {
    const name = props.name.toLowerCase();
    if (name.includes('museum')) {
      categories.push('Museum');
      types.push('Cultural');
    } else if (name.includes('theater') || name.includes('theatre')) {
      categories.push('Theatre');
      types.push('Cultural');
    } else if (name.includes('gallery') || name.includes('kunst')) {
      categories.push('Art Gallery');
      types.push('Cultural');
    } else if (name.includes('park')) {
      categories.push('Park');
      types.push('Leisure');
    } else if (name.includes('restaurant') || name.includes('cafe')) {
      categories.push('Restaurant');
      types.push('Amenity');
    }
  }

  // Default category if none found
  if (categories.length === 0) {
    categories.push('Point of Interest');
    types.push('Other');
  }

  return {
    categories: categories.join(', '),
    types: types.join(', ')
  };
};

// Read and process GeoJSON file
const processGeoJSONData = () => {
  try {
    const filePath = path.join(__dirname, '../../dbwProjectOfflineData/Chemnitz.geojson');
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    
    // Filter and transform features
    const sites = data.features
      .filter(feature => {
        const props = feature.properties;
        
        // Must have a name or be a significant point of interest
        if (!props.name && !props.amenity && !props.tourism && !props.shop && !props.leisure) {
          console.log('Skipping entry without name or type:', props);
          return false;
        }

        // Must have valid coordinates
        if (!feature.geometry?.coordinates || feature.geometry.coordinates.length !== 2) {
          console.log('Skipping entry with invalid coordinates:', props.name || 'Unnamed location');
          return false;
        }

        return true;
      })
      .map(feature => {
        const props = feature.properties;
        const [longitude, latitude] = feature.geometry.coordinates;
        
        // Build address string
        const addressParts = [
          props['addr:street'],
          props['addr:housenumber'],
          props['addr:postcode'],
          props['addr:city']
        ].filter(Boolean);

        // Determine categories and types
        const { categories, types } = determineCategories(props);
        
        // Create a description if none exists
        let description = props.description || props.wikipedia;
        if (!description) {
          description = `${props.name || categories} in Chemnitz.`;
          if (props.opening_hours) {
            description += ` Opening hours: ${props.opening_hours}`;
          }
        }

        // Format and validate website URL
        const website = formatUrl(props.website);

        return {
          name: props.name || `${categories} (${types})`,
          description: description,
          latitude: latitude,
          longitude: longitude,
          category: categories,
          type: types,
          address: addressParts.join(', ') || 'Chemnitz, Germany',
          website: website,
          imageUrl: props.image || null,
          // Additional metadata
          osmId: props['@id'],
          openingHours: props.opening_hours || null,
          wheelchair: props.wheelchair === 'yes',
          phone: props.phone || null,
          email: props.email || null,
          // Additional properties
          tags: {
            tourism: props.tourism || null,
            amenity: props.amenity || null,
            historic: props.historic || null,
            shop: props.shop || null,
            leisure: props.leisure || null,
            cuisine: props.cuisine || null,
            capacity: props.capacity || null,
            smoking: props.smoking || null,
            outdoor_seating: props.outdoor_seating || null,
            takeaway: props.takeaway || null,
            delivery: props.delivery || null
          }
        };
      });

    // Log statistics
    console.log('\nData Processing Statistics:');
    console.log(`Total features in GeoJSON: ${data.features.length}`);
    console.log(`Valid points of interest found: ${sites.length}`);
    
    // Log category distribution
    const categoryCount = {};
    const typeCount = {};
    sites.forEach(site => {
      categoryCount[site.category] = (categoryCount[site.category] || 0) + 1;
      typeCount[site.type] = (typeCount[site.type] || 0) + 1;
    });

    console.log('\nCategory Distribution:');
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`- ${category}: ${count} sites`);
      });

    console.log('\nType Distribution:');
    Object.entries(typeCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([type, count]) => {
        console.log(`- ${type}: ${count} sites`);
      });
    
    // Log example sites
    if (sites.length > 0) {
      console.log('\nExample sites to be imported:');
      sites.slice(0, 5).forEach(site => {
        console.log(`- ${site.name} (${site.category}, ${site.type})`);
        if (site.website) {
          console.log(`  Website: ${site.website}`);
        }
      });
    }

    return sites;
  } catch (error) {
    console.error('Error processing GeoJSON file:', error);
    return [];
  }
};

// Import into DB
const importData = async () => {
  try {
    const sitesToImport = processGeoJSONData();
    if (sitesToImport.length === 0) {
      console.log('No valid points of interest found in the GeoJSON file.');
      return;
    }

    // Validate all sites before importing
    const validationErrors = [];
    sitesToImport.forEach((site, index) => {
      try {
        const culturalSite = new CulturalSite(site);
        culturalSite.validateSync();
      } catch (err) {
        validationErrors.push({
          index,
          name: site.name,
          errors: err.errors
        });
      }
    });

    if (validationErrors.length > 0) {
      console.error('\nValidation errors found:');
      validationErrors.forEach(err => {
        console.error(`\nSite: ${err.name}`);
        Object.values(err.errors).forEach(e => console.error(`- ${e.message}`));
      });
      throw new Error('Validation failed for some sites');
    }

    // Clear existing data
    await CulturalSite.deleteMany();
    console.log('\nCleared existing data.');

    // Insert new data
    const result = await CulturalSite.insertMany(sitesToImport);
    console.log(`\nSuccessfully imported ${result.length} points of interest!`);

    process.exit(0);
  } catch (err) {
    console.error('\nError importing data:', err.message);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await CulturalSite.deleteMany();
    console.log('All points of interest have been deleted from the database.');
    process.exit(0);
  } catch (err) {
    console.error('Error deleting data:', err);
    process.exit(1);
  }
};

// Handle command line arguments
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Please use -i to import data or -d to delete data.');
  process.exit(1);
} 