// Use server-side SDK in Node
const { Client, Storage, ID, Permission, Role } = require('node-appwrite');
const { InputFile } = require('node-appwrite/file');
const fs = require('fs');
const path = require('path');
const os = require('os');

class AppwriteStorageService {
  constructor() {
    // Initialize Appwrite client
    this.client = new Client();
    this.client.setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1');
    this.client.setProject(process.env.APPWRITE_PROJECT_ID);
    this.client.setKey(process.env.APPWRITE_API_KEY);

    this.storage = new Storage(this.client);
    this.bucketId = process.env.APPWRITE_BUCKET_ID || '68e543cb002d88b0ea1c';
  }

  /**
   * Upload a file to Appwrite Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - File name
   * @param {string} mimeType - File MIME type
   * @param {string} folder - Optional folder path
   */
  async uploadFile(fileBuffer, fileName, mimeType, folder = null) {
    let buffer;
    
    try {
      console.log('Uploading file to Appwrite Storage...');
      console.log('File name:', fileName);
      console.log('MIME type:', mimeType);
      console.log('Folder:', folder || 'root');

      // If folder is provided and fileName doesn't already include it, prepend it
      // Otherwise use fileName as is (it may already contain the path)
      const fullPath = (folder && !fileName.startsWith(folder)) ? `${folder}/${fileName}` : fileName;

      // Ensure fileBuffer is a Buffer
      buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);

      console.log('File size:', buffer.length, 'bytes');

      // Use InputFile.fromBuffer as per node-appwrite documentation
      const inputFile = InputFile.fromBuffer(buffer, path.basename(fileName));

      const file = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        inputFile,
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ]
      );

      console.log('✅ File uploaded successfully to Appwrite Storage');
      console.log('Full file response:', JSON.stringify(file, null, 2));
      console.log('File ID:', file.$id);
      console.log('File name:', file.name);

      return {
        success: true,
        fileId: file.$id,
        fileName: file.name,
        fileSize: file.sizeOriginal,
        url: this.getFileUrl(file.$id)
      };

    } catch (error) {
      console.error('Error uploading file to Appwrite Storage:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        bucketId: this.bucketId,
        fileName: fileName,
        bufferLength: buffer ? buffer.length : 0
      });
      throw error;
    }
  }

  /**
   * Delete a file from Appwrite Storage
   * @param {string} fileId - Appwrite file ID
   */
  async deleteFile(fileId) {
    try {
      console.log(`Deleting file from Appwrite Storage: ${fileId}`);

      await this.storage.deleteFile(this.bucketId, fileId);

      console.log(`✅ Successfully deleted file ${fileId} from Appwrite Storage`);

      return {
        success: true,
        fileId: fileId,
        message: 'File deleted successfully'
      };

    } catch (error) {
      console.error(`Error deleting file ${fileId} from Appwrite Storage:`, error);
      throw error;
    }
  }

  /**
   * Get file URL
   * @param {string} fileId - Appwrite file ID
   */
  getFileUrl(fileId) {
    try {
      if (!fileId) {
        throw new Error('File ID is required to generate URL');
      }
      
      // getFileView returns a URL object in node-appwrite
      // We need to get the href property to get the actual URL string
      const urlObject = this.storage.getFileView(this.bucketId, fileId);
      const urlString = urlObject.href || urlObject.toString();
      
      console.log('Generated file URL:', urlString);
      return urlString;
    } catch (error) {
      console.error('Error generating file URL:', error);
      throw error;
    }
  }

  /**
   * Get file download URL
   * @param {string} fileId - Appwrite file ID
   */
  getFileDownloadUrl(fileId) {
    try {
      if (!fileId) {
        throw new Error('File ID is required to generate download URL');
      }
      
      // getFileDownload returns a URL object in node-appwrite
      const urlObject = this.storage.getFileDownload(this.bucketId, fileId);
      const urlString = urlObject.href || urlObject.toString();
      
      console.log('Generated download URL:', urlString);
      return urlString;
    } catch (error) {
      console.error('Error generating download URL:', error);
      throw error;
    }
  }

  /**
   * Get file preview URL
   * @param {string} fileId - Appwrite file ID
   * @param {number} width - Preview width
   * @param {number} height - Preview height
   */
  getFilePreviewUrl(fileId, width = null, height = null) {
    try {
      if (!fileId) {
        throw new Error('File ID is required to generate preview URL');
      }
      
      // getFilePreview returns a URL object in node-appwrite
      const urlObject = this.storage.getFilePreview(this.bucketId, fileId, width, height);
      const urlString = urlObject.href || urlObject.toString();
      
      console.log('Generated preview URL:', urlString);
      return urlString;
    } catch (error) {
      console.error('Error generating preview URL:', error);
      throw error;
    }
  }

  /**
   * List files in the storage bucket
   */
  async listFiles() {
    try {
      console.log('Listing files from Appwrite Storage...');
      
      const files = await this.storage.listFiles(
        this.bucketId,
        undefined, // queries
        undefined, // search
        undefined  // cursor
      );

      console.log(`Found ${files.files.length} files`);
      return files.files;

    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }

  /**
   * Get file information
   * @param {string} fileId - Appwrite file ID
   */
  async getFileInfo(fileId) {
    try {
      const file = await this.storage.getFile(this.bucketId, fileId);
      return file;
    } catch (error) {
      console.error('Error getting file info:', error);
      throw error;
    }
  }

  /**
   * Extract file ID from Appwrite URL
   * @param {string} url - Appwrite file URL
   */
  extractFileIdFromUrl(url) {
    try {
      // Appwrite URLs typically contain the file ID
      // Format: https://cloud.appwrite.io/v1/storage/buckets/{bucketId}/files/{fileId}/view
      const match = url.match(/\/files\/([a-zA-Z0-9]+)\//);
      return match ? match[1] : null;
    } catch (error) {
      console.error('Error extracting file ID from URL:', error);
      return null;
    }
  }

  /**
   * Test Appwrite Storage connection
   */
  async testConnection() {
    try {
      await this.listFiles();
      return {
        success: true,
        message: 'Appwrite Storage connection successful'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to connect to Appwrite Storage'
      };
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats() {
    try {
      const files = await this.listFiles();
      const totalFiles = files.length;
      const totalSize = files.reduce((sum, file) => sum + file.sizeOriginal, 0);
      const averageFileSize = totalFiles > 0 ? totalSize / totalFiles : 0;

      return {
        totalFiles,
        totalSize,
        averageFileSize
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return {
        totalFiles: 0,
        totalSize: 0,
        averageFileSize: 0
      };
    }
  }
}

module.exports = AppwriteStorageService;
