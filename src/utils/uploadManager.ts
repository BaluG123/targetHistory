// Centralized upload manager to prevent multiple simultaneous uploads
// Now only used for manual uploads by developer
import { uploadTest1With20Questions, uploadTest2With20Questions } from '../scripts/uploadQuestions';

class UploadManager {
  private static instance: UploadManager;
  private isUploading = false;
  private uploadPromise: Promise<boolean> | null = null;

  private constructor() {}

  static getInstance(): UploadManager {
    if (!UploadManager.instance) {
      UploadManager.instance = new UploadManager();
    }
    return UploadManager.instance;
  }

  async performUpload(testType: 'test1' | 'test2' = 'test1'): Promise<boolean> {
    // If currently uploading, return the existing promise
    if (this.isUploading && this.uploadPromise) {
      console.log('⏳ Upload already in progress, waiting...');
      return this.uploadPromise;
    }

    // Start new upload
    this.isUploading = true;
    this.uploadPromise = this.doUpload(testType);
    
    try {
      const result = await this.uploadPromise;
      console.log(result ? `✅ ${testType} upload completed successfully` : `❌ ${testType} upload failed`);
      return result;
    } finally {
      this.isUploading = false;
      this.uploadPromise = null;
    }
  }

  private async doUpload(testType: 'test1' | 'test2'): Promise<boolean> {
    try {
      console.log(`🚀 Starting developer upload for ${testType}...`);
      const success = testType === 'test1' 
        ? await uploadTest1With20Questions()
        : await uploadTest2With20Questions();
      console.log(success ? `✅ ${testType} upload successful` : `❌ ${testType} upload failed`);
      return success;
    } catch (error) {
      console.log(`❌ ${testType} upload error:`, error);
      return false;
    }
  }

  // Check if upload is currently in progress
  isUploadInProgress(): boolean {
    return this.isUploading;
  }
}

export const uploadManager = UploadManager.getInstance();