const { Client, Storage, ID, Permission, Role } = require('node-appwrite');

class AppwriteStorageService {
  constructor() {
    // Initialize Appwrite client
    this.client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://fra.cloud.appwrite.io/v1')
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    this.storage = new Storage(this.client);
    this.bucketId = process.env.APPWRITE_BUCKET_ID || '68e12c7d000533b0403d';
  }

  /**
   * Upload a file to Appwrite Storage
   * @param {Buffer} fileBuffer - File buffer
   * @param {string} fileName - File name
   * @param {string} mimeType - File MIME type
   * @param {string} folder - Optional folder path
   */
  async uploadFile(fileBuffer, fileName, mimeType, folder = null) {
    try {
      console.log('Uploading file to Appwrite Storage...');
      console.log('File name:', fileName);
      console.log('MIME type:', mimeType);
      console.log('Folder:', folder || 'root');

      const fullPath = folder ? `${folder}/${fileName}` : fileName;

      // Ensure fileBuffer is a Buffer
      const buffer = Buffer.isBuffer(fileBuffer) ? fileBuffer : Buffer.from(fileBuffer);
      
      const file = await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        buffer,
        [
          Permission.read(Role.any()),
          Permission.write(Role.any())
        ],
        fullPath
      );

      console.log('✅ File uploaded successfully to Appwrite Storage');
      console.log('File ID:', file.$id);
      console.log('File path:', fullPath);

      return {
        success: true,
        fileId: file.$id,
        fileName: fullPath,
        fileSize: fileBuffer.length,
        url: this.getFileUrl(file.$id)
      };

    } catch (error) {
      console.error('Error uploading file to Appwrite Storage:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        bucketId: this.bucketId,
        fileName: fullPath,
        bufferLength: buffer.length
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
      return this.storage.getFileView(this.bucketId, fileId);
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
      return this.storage.getFileDownload(this.bucketId, fileId);
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
      return this.storage.getFilePreview(this.bucketId, fileId, width, height);
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
