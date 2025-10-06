/**
 * Simple test to check if the server can start without crashing
 * This helps identify the issue causing the npm error
 */

console.log('🧪 Testing server startup...');

// Test 1: Check if all required modules can be imported
try {
  console.log('1. Testing module imports...');
  
  const express = require('express');
  console.log('✅ Express imported successfully');
  
  const cors = require('cors');
  console.log('✅ CORS imported successfully');
  
  const helmet = require('helmet');
  console.log('✅ Helmet imported successfully');
  
  require('dotenv').config();
  console.log('✅ dotenv configured successfully');
  
} catch (error) {
  console.error('❌ Module import failed:', error.message);
  process.exit(1);
}

// Test 2: Check environment variables
console.log('\n2. Testing environment variables...');

const requiredEnvVars = [
  'APPWRITE_ENDPOINT',
  'APPWRITE_PROJECT_ID', 
  'APPWRITE_API_KEY',
  'APPWRITE_BUCKET_ID'
];

let missingVars = [];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
  }
});

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars);
  console.log('Please set these environment variables in your deployment platform:');
  missingVars.forEach(varName => {
    console.log(`  ${varName}=your_value_here`);
  });
} else {
  console.log('✅ All required environment variables are set');
}

// Test 3: Check if Appwrite service can be initialized
try {
  console.log('\n3. Testing Appwrite service initialization...');
  
  const AppwriteStorageService = require('./services/appwriteStorageService');
  const appwriteStorageService = new AppwriteStorageService();
  console.log('✅ Appwrite service initialized successfully');
  
} catch (error) {
  console.error('❌ Appwrite service initialization failed:', error.message);
  console.error('Error details:', error);
}

// Test 4: Check if routes can be loaded
try {
  console.log('\n4. Testing route imports...');
  
  const authRoutes = require('./routes/auth');
  console.log('✅ Auth routes imported successfully');
  
} catch (error) {
  console.error('❌ Route import failed:', error.message);
}

console.log('\n📊 Server startup test completed!');
console.log('If all tests passed, the server should start successfully.');
console.log('If any tests failed, fix those issues before deploying.');
