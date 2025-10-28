/**
 * DigitalOcean Spaces Service
 * S3-compatible API wrapper
 */

import AWS from 'aws-sdk';

class SpacesService {
  constructor() {
    this.s3 = null;
    this.config = null;
    this.connected = false;
  }

  initialize(spaceName, region, accessKey, secretKey) {
    this.config = { spaceName, region, accessKey, secretKey };
    
    const spacesEndpoint = new AWS.Endpoint(`${region}.digitaloceanspaces.com`);
    
    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
      region: region,
    });

    this.connected = true;
    return this;
  }

  isConnected() {
    return this.connected;
  }

  async testConnection() {
    try {
      await this.s3.headBucket({ Bucket: this.config.spaceName }).promise();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async listFiles(prefix = '') {
    try {
      const params = {
        Bucket: this.config.spaceName,
        Prefix: prefix,
        Delimiter: '/',
      };

      const data = await this.s3.listObjectsV2(params).promise();

      const folders = (data.CommonPrefixes || []).map(item => ({
        type: 'folder',
        name: item.Prefix.replace(prefix, '').replace('/', ''),
        prefix: item.Prefix,
      }));

      const files = (data.Contents || [])
        .filter(item => item.Key !== prefix && !item.Key.endsWith('/.keep'))
        .map(item => ({
          type: 'file',
          key: item.Key,
          name: item.Key.split('/').pop(),
          size: item.Size,
          lastModified: item.LastModified,
          url: this.getPublicUrl(item.Key),
          cdnUrl: this.getCdnUrl(item.Key),
        }));

      return { success: true, folders, files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  uploadFileWithProgress(file, folder = '', metadata = {}, onProgress) {
    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const key = folder ? `${folder}${timestamp}_${file.name}` : `${timestamp}_${file.name}`;

      const params = {
        Bucket: this.config.spaceName,
        Key: key,
        Body: file,
        ACL: 'public-read',
        ContentType: file.type,
        Metadata: {
          'original-name': file.name,
          'upload-timestamp': new Date().toISOString(),
          ...metadata,
        },
      };

      const upload = this.s3.upload(params);

      upload.on('httpUploadProgress', (progress) => {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        if (onProgress) onProgress(percentage);
      });

      upload.send((error, data) => {
        if (error) {
          reject({ success: false, error: error.message });
        } else {
          resolve({
            success: true,
            key: data.Key,
            url: this.getPublicUrl(data.Key),
            cdnUrl: this.getCdnUrl(data.Key),
          });
        }
      });
    });
  }

  async deleteFile(key) {
    try {
      await this.s3.deleteObject({
        Bucket: this.config.spaceName,
        Key: key,
      }).promise();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createFolder(folderName, parentFolder = '') {
    try {
      const key = parentFolder 
        ? `${parentFolder}${folderName}/.keep`
        : `${folderName}/.keep`;

      await this.s3.putObject({
        Bucket: this.config.spaceName,
        Key: key,
        Body: '',
        ACL: 'public-read',
      }).promise();

      return { 
        success: true, 
        folder: parentFolder ? `${parentFolder}${folderName}/` : `${folderName}/` 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getPublicUrl(key) {
    return `https://${this.config.spaceName}.${this.config.region}.digitaloceanspaces.com/${key}`;
  }

  getCdnUrl(key) {
    return `https://${this.config.spaceName}.${this.config.region}.cdn.digitaloceanspaces.com/${key}`;
  }

  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  static formatDate(date) {
    return new Date(date).toLocaleString('vi-VN');
  }
}

export default new SpacesService();
