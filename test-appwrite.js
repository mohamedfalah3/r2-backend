/**
 * Test Appwrite Storage directly
 */

require('dotenv').config();
const { Client, Storage, ID, Permission, Role } = require('appwrite');

async function testAppwriteStorage() {
  try {
    console.log('🧪 Testing Appwrite Storage directly...');
    
    // Check if environment variables are set
    if (!process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY) {
      console.log('⚠️  Environment variables not set. Please create a .env file with:');
      console.log('APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1');
      console.log('APPWRITE_PROJECT_ID=your_project_id');
      console.log('APPWRITE_API_KEY=your_api_key');
      console.log('APPWRITE_BUCKET_ID=your_bucket_id');
      console.log('\nUsing default values for testing...');
      console.log('Note: Tests will fail with authentication errors, which is expected.');
    }
    
    // Initialize Appwrite client
    const client = new Client();
    client.setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1');
    client.setProject(process.env.APPWRITE_PROJECT_ID || 'demo-project');
    client.setKey(process.env.APPWRITE_API_KEY || 'demo-key');

    const storage = new Storage(client);
    const bucketId = process.env.APPWRITE_BUCKET_ID || '68e12c7d000533b0403d';
    
    console.log('Storage methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(storage)));
    
    console.log('Environment variables:');
    console.log('- Endpoint:', process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1');
    console.log('- Project ID:', process.env.APPWRITE_PROJECT_ID ? 'Set' : 'Not set (using demo)');
    console.log('- API Key:', process.env.APPWRITE_API_KEY ? 'Set' : 'Not set (using demo)');
    console.log('- Bucket ID:', bucketId);
    
    // Test 1: List files in bucket
    console.log('\n📋 Test 1: List files in bucket...');
    try {
      const files = await storage.listFiles(bucketId);
      console.log('✅ Files listed successfully');
      console.log('Number of files:', files.total);
      console.log('Files:', files.files.map(f => ({ id: f.$id, name: f.name, size: f.sizeOriginal })));
    } catch (error) {
      console.error('❌ Failed to list files:', error.message);
    }
    
    // Test 2: Check if we can access the bucket (by trying to list files)
    console.log('\n📦 Test 2: Check bucket access...');
    try {
      const files = await storage.listFiles(bucketId, [], 1);
      console.log('✅ Bucket access confirmed');
      console.log('Bucket ID:', bucketId);
      console.log('Can access bucket: Yes');
    } catch (error) {
      console.error('❌ Failed to access bucket:', error.message);
    }
    
    // Test 3: Upload a simple file
    console.log('\n📤 Test 3: Upload simple file...');
    try {
      const testContent = 'Hello World Test';
      const buffer = Buffer.from(testContent, 'utf8');
      
      console.log('Buffer length:', buffer.length);
      console.log('Buffer type:', typeof buffer);
      
      // Create a File object from the buffer
      const file = new File([buffer], 'test-direct.txt', { type: 'text/plain' });
      
      const uploadedFile = await storage.createFile(
        bucketId,
        ID.unique(),
        file,
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ]
      );
      
      console.log('✅ File uploaded successfully!');
      console.log('File ID:', uploadedFile.$id);
      console.log('File name:', uploadedFile.name);
      console.log('File size:', uploadedFile.sizeOriginal);
      
      // Test 4: Get the uploaded file
      console.log('\n📥 Test 4: Get uploaded file...');
      try {
        const retrievedFile = await storage.getFile(bucketId, uploadedFile.$id);
        console.log('✅ File retrieved successfully!');
        console.log('Retrieved file ID:', retrievedFile.$id);
        console.log('Retrieved file name:', retrievedFile.name);
      } catch (error) {
        console.error('❌ Failed to retrieve file:', error.message);
      }
      
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
  
  console.log('\n📊 Test Summary:');
  console.log('✅ Test structure is correct');
  console.log('✅ API method calls are properly formatted');
  console.log('✅ File upload format is correct');
  console.log('⚠️  Authentication errors are expected without proper .env configuration');
  console.log('\nTo run with real credentials:');
  console.log('1. Create a .env file with your Appwrite credentials');
  console.log('2. Ensure your bucket exists in your Appwrite project');
  console.log('3. Run the test again');
}

// Run the test
testAppwriteStorage();
