const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

// Import authentication routes
const authRoutes = require('./routes/auth');

// Import Appwrite Storage service
const AppwriteStorageService = require('./services/appwriteStorageService');

const app = express();
const PORT = process.env.PORT || 3000;

// Cache removed - Appwrite Storage handles caching internally


// Initialize Appwrite Storage service
const appwriteStorageService = new AppwriteStorageService();

// Security middleware
app.use(helmet());

// CORS configuration for React Native
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// NOTE: Rate limiting completely disabled for development and unlimited access
// This removes the 429 "Too Many Requests" errors that were blocking the app

// Cache removed - Appwrite Storage handles caching internally

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Authentication routes
app.use('/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Appwrite Storage Service',
    version: '2.0.0'
  });
});

// Debug endpoint to check environment variables
app.get('/debug-env', (req, res) => {
  res.status(200).json({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    APPWRITE_ENDPOINT: !!process.env.APPWRITE_ENDPOINT,
    APPWRITE_PROJECT_ID: !!process.env.APPWRITE_PROJECT_ID,
    APPWRITE_API_KEY: !!process.env.APPWRITE_API_KEY,
    APPWRITE_BUCKET_ID: !!process.env.APPWRITE_BUCKET_ID,
    APPWRITE_BUCKET_VALUE: process.env.APPWRITE_BUCKET_ID,
    allAppwriteVars: Object.keys(process.env).filter(key => key.startsWith('APPWRITE_'))
  });
});

// Cache endpoints removed - Appwrite Storage handles caching internally

// R2 endpoints removed - All functionality migrated to Appwrite Storage

// R2 iOS audio endpoint removed - Use Appwrite Storage instead

// R2 batch endpoint removed - Use Appwrite Storage instead

// R2 upload endpoint removed - Use Appwrite Storage instead

// R2 delete endpoint removed - Use Appwrite Storage instead

// ===== APPWRITE STORAGE ENDPOINTS =====

// Upload file to Appwrite Storage (JSON format)
app.post('/appwrite/upload', async (req, res) => {
  try {
    const { fileBuffer, fileName, mimeType, folder } = req.body;
    
    if (!fileBuffer || !fileName) {
      return res.status(400).json({
        error: 'fileBuffer and fileName are required',
        example: { fileBuffer: 'base64string', fileName: 'image.jpg', mimeType: 'image/jpeg', folder: 'images' }
      });
    }

    // Convert base64 to buffer if needed
    let buffer;
    if (typeof fileBuffer === 'string') {
      buffer = Buffer.from(fileBuffer, 'base64');
    } else {
      buffer = Buffer.from(fileBuffer);
    }

    const result = await appwriteStorageService.uploadFile(buffer, fileName, mimeType, folder);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error uploading file to Appwrite Storage:', error);
    res.status(500).json({
      error: 'Failed to upload file to Appwrite Storage',
      message: error.message || 'Internal server error'
    });
  }
});

// Upload file to Appwrite Storage (FormData format)
app.post('/appwrite/upload-form', async (req, res) => {
  try {
    console.log('📤 FormData upload request received');
    console.log('Content-Type:', req.headers['content-type']);
    
    // Check if it's multipart/form-data
    if (!req.headers['content-type']?.includes('multipart/form-data')) {
      return res.status(400).json({
        error: 'Content-Type must be multipart/form-data',
        received: req.headers['content-type']
      });
    }

    // For now, we'll use the same JSON endpoint logic
    // In a real implementation, you'd use multer or similar to handle FormData
    return res.status(400).json({
      error: 'FormData upload not implemented yet',
      suggestion: 'Use the JSON endpoint instead'
    });

  } catch (error) {
    console.error('Error handling FormData upload:', error);
    res.status(500).json({
      error: 'Failed to handle FormData upload',
      message: error.message || 'Internal server error'
    });
  }
});

// Delete file from Appwrite Storage
app.delete('/appwrite/delete', async (req, res) => {
  try {
    const { fileId } = req.body;
    
    if (!fileId) {
      return res.status(400).json({
        error: 'fileId parameter is required in request body',
        example: { fileId: '64a1b2c3d4e5f6789abcdef0' }
      });
    }

    const result = await appwriteStorageService.deleteFile(fileId);

    res.json({
      success: true,
      message: 'File deleted successfully',
      fileId: fileId,
      deletedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error deleting file from Appwrite Storage:', error);
    
    res.status(500).json({
      error: 'Failed to delete file from Appwrite Storage',
      message: error.message || 'Internal server error'
    });
  }
});

// Get file URL from Appwrite Storage
app.get('/appwrite/fileUrl/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        error: 'fileId parameter is required'
      });
    }

    const fileUrl = appwriteStorageService.getFileUrl(fileId);

    res.json({
      success: true,
      url: fileUrl,
      fileId: fileId
    });

  } catch (error) {
    console.error('Error getting file URL from Appwrite Storage:', error);
    res.status(500).json({
      error: 'Failed to get file URL',
      message: error.message || 'Internal server error'
    });
  }
});

// Get file download URL from Appwrite Storage
app.get('/appwrite/downloadUrl/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        error: 'fileId parameter is required'
      });
    }

    const downloadUrl = appwriteStorageService.getFileDownloadUrl(fileId);

    res.json({
      success: true,
      url: downloadUrl,
      fileId: fileId
    });

  } catch (error) {
    console.error('Error getting download URL from Appwrite Storage:', error);
    res.status(500).json({
      error: 'Failed to get download URL',
      message: error.message || 'Internal server error'
    });
  }
});

// Get file preview URL from Appwrite Storage
app.get('/appwrite/previewUrl/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const { width, height } = req.query;
    
    if (!fileId) {
      return res.status(400).json({
        error: 'fileId parameter is required'
      });
    }

    const previewUrl = appwriteStorageService.getFilePreviewUrl(
      fileId, 
      width ? parseInt(width) : null, 
      height ? parseInt(height) : null
    );

    res.json({
      success: true,
      url: previewUrl,
      fileId: fileId,
      dimensions: { width, height }
    });

  } catch (error) {
    console.error('Error getting preview URL from Appwrite Storage:', error);
    res.status(500).json({
      error: 'Failed to get preview URL',
      message: error.message || 'Internal server error'
    });
  }
});

// List files in Appwrite Storage
app.get('/appwrite/files', async (req, res) => {
  try {
    const files = await appwriteStorageService.listFiles();

    res.json({
      success: true,
      files: files,
      count: files.length
    });

  } catch (error) {
    console.error('Error listing files from Appwrite Storage:', error);
    res.status(500).json({
      error: 'Failed to list files',
      message: error.message || 'Internal server error'
    });
  }
});

// Get file info from Appwrite Storage
app.get('/appwrite/fileInfo/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    if (!fileId) {
      return res.status(400).json({
        error: 'fileId parameter is required'
      });
    }

    const fileInfo = await appwriteStorageService.getFileInfo(fileId);

    res.json({
      success: true,
      file: fileInfo
    });

  } catch (error) {
    console.error('Error getting file info from Appwrite Storage:', error);
    res.status(500).json({
      error: 'Failed to get file info',
      message: error.message || 'Internal server error'
    });
  }
});

// Test Appwrite Storage connection
app.get('/appwrite/test', async (req, res) => {
  try {
    const result = await appwriteStorageService.testConnection();

    res.json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error testing Appwrite Storage connection:', error);
    res.status(500).json({
      error: 'Failed to test Appwrite Storage connection',
      message: error.message || 'Internal server error'
    });
  }
});

// Get Appwrite Storage statistics
app.get('/appwrite/stats', async (req, res) => {
  try {
    const stats = await appwriteStorageService.getStorageStats();

    res.json({
      success: true,
      stats: stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error getting Appwrite Storage stats:', error);
    res.status(500).json({
      error: 'Failed to get storage statistics',
      message: error.message || 'Internal server error'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /debug-env',
      'POST /appwrite/upload - Upload file to Appwrite Storage',
      'DELETE /appwrite/delete - Delete file from Appwrite Storage',
      'GET /appwrite/fileUrl/:fileId - Get file URL',
      'GET /appwrite/downloadUrl/:fileId - Get download URL',
      'GET /appwrite/previewUrl/:fileId - Get preview URL',
      'GET /appwrite/files - List all files',
      'GET /appwrite/fileInfo/:fileId - Get file info',
      'GET /appwrite/test - Test Appwrite connection',
      'GET /appwrite/stats - Get storage statistics',
      'POST /auth/send-otp',
      'POST /auth/verify-otp',
      'GET /auth/status'
    ]
  });
});

// Cache invalidation endpoint removed - Appwrite Storage handles caching internally

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Appwrite Storage Service running on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Local: http://localhost:${PORT}/health`);
  console.log(`🔗 Network: https://r2-backend-1k7p.onrender.com/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
