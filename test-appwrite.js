/**
 * Test Appwrite Storage directly
 */

require('dotenv').config();
const { Client, Storage, ID, Permission, Role } = require('node-appwrite');

async function testAppwriteStorage() {
  try {
    console.log('🧪 Testing Appwrite Storage directly...');
    
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const storage = new Storage(client);
    const bucketId = process.env.APPWRITE_BUCKET_ID || '68e12c7d000533b0403d';
    
    console.log('Environment variables:');
    console.log('- Endpoint:', process.env.APPWRITE_ENDPOINT);
    console.log('- Project ID:', process.env.APPWRITE_PROJECT_ID ? 'Set' : 'Not set');
    console.log('- API Key:', process.env.APPWRITE_API_KEY ? 'Set' : 'Not set');
    console.log('- Bucket ID:', bucketId);
    
    // Test 1: List buckets
    console.log('\n📋 Test 1: List buckets...');
    try {
      const buckets = await storage.listBuckets();
      console.log('✅ Buckets listed successfully');
      console.log('Number of buckets:', buckets.total);
      console.log('Buckets:', buckets.buckets.map(b => ({ id: b.$id, name: b.name })));
    } catch (error) {
      console.error('❌ Failed to list buckets:', error.message);
    }
    
    // Test 2: Get bucket info
    console.log('\n📦 Test 2: Get bucket info...');
    try {
      const bucket = await storage.getBucket(bucketId);
      console.log('✅ Bucket info retrieved successfully');
      console.log('Bucket name:', bucket.name);
      console.log('Bucket ID:', bucket.$id);
    } catch (error) {
      console.error('❌ Failed to get bucket info:', error.message);
    }
    
    // Test 3: Upload a simple file
    console.log('\n📤 Test 3: Upload simple file...');
    try {
      const testContent = 'Hello World Test';
      const buffer = Buffer.from(testContent, 'utf8');
      
      console.log('Buffer length:', buffer.length);
      console.log('Buffer type:', typeof buffer);
      
      const file = await storage.createFile(
        bucketId,
        ID.unique(),
        buffer,
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ],
        'test-direct.txt'
      );
      
      console.log('✅ File uploaded successfully!');
      console.log('File ID:', file.$id);
      console.log('File name:', file.name);
      console.log('File size:', file.sizeOriginal);
      
    } catch (error) {
      console.error('❌ Failed to upload file:', error.message);
      console.error('Error details:', {
        code: error.code,
        type: error.type,
        message: error.message
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testAppwriteStorage();
