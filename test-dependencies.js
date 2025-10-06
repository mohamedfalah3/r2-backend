/**
 * Test script to verify all dependencies are available
 * This helps identify missing modules before deployment
 */

console.log('🧪 Testing all dependencies...');

const dependencies = [
  'express',
  'cors', 
  'helmet',
  'dotenv',
  'node-cache',
  'redis',
  'appwrite',
  'axios',
  'express-rate-limit'
];

let allPassed = true;

dependencies.forEach(dep => {
  try {
    require(dep);
    console.log(`✅ ${dep} - Available`);
  } catch (error) {
    console.error(`❌ ${dep} - Missing: ${error.message}`);
    allPassed = false;
  }
});

console.log('\n📊 Dependency Test Results:');
console.log('==========================');

if (allPassed) {
  console.log('✅ All dependencies are available!');
  console.log('The server should start successfully.');
} else {
  console.log('❌ Some dependencies are missing!');
  console.log('Run: npm install');
  console.log('Then test again.');
}

// Test specific Appwrite imports
console.log('\n🔧 Testing Appwrite imports...');

try {
  const { Client, Account, Databases, Storage, ID, Permission, Role } = require('appwrite');
  console.log('✅ Appwrite SDK imports successful');
  
  // Test creating a client
  const client = new Client();
  console.log('✅ Appwrite Client creation successful');
  
} catch (error) {
  console.error('❌ Appwrite SDK test failed:', error.message);
  allPassed = false;
}

console.log(`\nOverall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
