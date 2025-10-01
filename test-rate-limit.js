// Test script for rate limiting functionality
// Run this with: node test-rate-limit.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/grants';

async function testRateLimit() {
  console.log('Testing rate limiting (10 requests per second)...\n');
  
  const requests = [];
  const startTime = Date.now();
  
  // Make 15 requests rapidly to test rate limiting
  for (let i = 0; i < 15; i++) {
    requests.push(
      axios.get(`${BASE_URL}/by-program`)
        .then(response => ({
          status: response.status,
          headers: response.headers,
          requestNumber: i + 1
        }))
        .catch(error => ({
          status: error.response?.status || 'ERROR',
          headers: error.response?.headers || {},
          requestNumber: i + 1,
          error: error.message
        }))
    );
  }
  
  try {
    const results = await Promise.all(requests);
    const endTime = Date.now();
    
    console.log(`Completed ${results.length} requests in ${endTime - startTime}ms\n`);
    
    let successCount = 0;
    let rateLimitedCount = 0;
    
    results.forEach(result => {
      if (result.status === 200) {
        successCount++;
        console.log(`Request ${result.requestNumber}: SUCCESS (200)`);
        console.log(`  Rate Limit Remaining: ${result.headers['x-ratelimit-remaining']}`);
      } else if (result.status === 429) {
        rateLimitedCount++;
        console.log(`Request ${result.requestNumber}: RATE LIMITED (429)`);
        console.log(`  Retry After: ${result.headers['retry-after']} seconds`);
      } else {
        console.log(`Request ${result.requestNumber}: ERROR (${result.status})`);
        if (result.error) console.log(`  Error: ${result.error}`);
      }
    });
    
    console.log(`\nSummary:`);
    console.log(`- Successful requests: ${successCount}`);
    console.log(`- Rate limited requests: ${rateLimitedCount}`);
    console.log(`- Expected: 10 successful, 5 rate limited`);
    
    if (successCount === 10 && rateLimitedCount === 5) {
      console.log('\n✅ Rate limiting is working correctly!');
    } else {
      console.log('\n❌ Rate limiting may not be working as expected.');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// Run the test
testRateLimit();
