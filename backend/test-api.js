const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API endpoint...');
    
    const response = await axios.get('http://localhost:5001/api/sites');
    
    console.log('Status:', response.status);
    console.log('Data count:', response.data.count);
    console.log('Success:', response.data.success);
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('First site:', {
        name: response.data.data[0].name,
        category: response.data.data[0].category,
        description: response.data.data[0].description?.substring(0, 100) + '...'
      });
    }
    
    console.log('API is working correctly!');
  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI(); 