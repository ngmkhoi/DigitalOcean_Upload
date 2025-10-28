import React, { useState, useEffect, useRef } from 'react';
import spacesService from './services/spacesService';
import './App.css';

function App() {
  // State
  const [connected, setConnected] = useState(false);
  const [credentials, setCredentials] = useState({
    spaceName: '',
    region: 'sgp1',
    accessKey: '',
    secretKey: '',
  });
  const [currentFolder, setCurrentFolder] = useState('');
  const [folderPath, setFolderPath] = useState([]);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [notification, setNotification] = useState(null);
  const fileInputRef = useRef(null);

  // New features state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [batchFiles, setBatchFiles] = useState([]);
  const [batchUploadProgress, setBatchUploadProgress] = useState({});
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  // Load files when folder changes
  useEffect(() => {
    if (connected) {
      loadFiles();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFolder, connected]);

  // Show notification
  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Connect to Spaces
  const handleConnect = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      spacesService.initialize(
        credentials.spaceName,
        credentials.region,
        credentials.accessKey,
        credentials.secretKey
      );

      const result = await spacesService.testConnection();
      
      if (result.success) {
        setConnected(true);
        notify('✅ Connected successfully!');
        // Save to localStorage
        localStorage.setItem('do_spaces_creds', JSON.stringify(credentials));
      } else {
        notify('❌ Connection failed: ' + result.error, 'error');
      }
    } catch (error) {
      notify('❌ Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Disconnect
  const handleDisconnect = () => {
    setConnected(false);
    setFiles([]);
    setFolders([]);
    setCurrentFolder('');
    setFolderPath([]);
    localStorage.removeItem('do_spaces_creds');
    notify('Disconnected');
  };

  // Load files
  const loadFiles = async () => {
    setLoading(true);
    try {
      const result = await spacesService.listFiles(currentFolder);
      if (result.success) {
        setFiles(result.files);
        setFolders(result.folders);
      } else {
        notify('Failed to load files: ' + result.error, 'error');
      }
    } catch (error) {
      notify('Error: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Navigate to folder
  const navigateToFolder = (folder) => {
    setCurrentFolder(folder.prefix);
    setFolderPath([...folderPath, folder]);
  };

  // Go back
  const goBack = () => {
    if (folderPath.length > 0) {
      const newPath = [...folderPath];
      newPath.pop();
      setFolderPath(newPath);
      setCurrentFolder(newPath.length > 0 ? newPath[newPath.length - 1].prefix : '');
    }
  };

  // Go to root
  const goToRoot = () => {
    setCurrentFolder('');
    setFolderPath([]);
  };


  // Delete file
  const handleDelete = async (file) => {
    if (!window.confirm(`Delete ${file.name}?`)) return;

    try {
      const result = await spacesService.deleteFile(file.key);
      if (result.success) {
        notify(`🗑️ Deleted: ${file.name}`);
        loadFiles();
      }
    } catch (error) {
      notify('Delete failed: ' + error.message, 'error');
    }
  };

  // Create folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const result = await spacesService.createFolder(newFolderName, currentFolder);
      if (result.success) {
        notify(`📁 Created folder: ${newFolderName}`);
        setNewFolderName('');
        setShowNewFolder(false);
        loadFiles();
      }
    } catch (error) {
      notify('Failed to create folder: ' + error.message, 'error');
    }
  };

  // Copy URL
  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    notify('📋 URL copied!');
  };

  // Load saved credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem('do_spaces_creds');
    if (saved) {
      try {
        const creds = JSON.parse(saved);
        setCredentials(creds);
      } catch (e) {}
    }
  }, []);

  // Search filter
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Multi-select handlers
  const toggleSelectItem = (item) => {
    const newSelected = new Set(selectedItems);
    const itemKey = item.key || item.prefix;

    if (newSelected.has(itemKey)) {
      newSelected.delete(itemKey);
    } else {
      newSelected.add(itemKey);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    const allKeys = new Set([
      ...files.map(f => f.key),
      ...folders.map(f => f.prefix)
    ]);
    setSelectedItems(allKeys);
  };

  const clearSelection = () => {
    setSelectedItems(new Set());
  };

  const deleteSelected = async () => {
    if (selectedItems.size === 0) return;

    if (!window.confirm(`Delete ${selectedItems.size} selected items?`)) return;

    const filesToDelete = files.filter(f => selectedItems.has(f.key));
    let successCount = 0;

    for (const file of filesToDelete) {
      try {
        const result = await spacesService.deleteFile(file.key);
        if (result.success) successCount++;
      } catch (error) {
        console.error('Error deleting:', file.name, error);
      }
    }

    notify(`🗑️ Deleted ${successCount} of ${filesToDelete.length} items`);
    clearSelection();
    loadFiles();
  };

  // Batch upload handlers
  const handleBatchFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setBatchFiles(files);
  };

  const removeBatchFile = (index) => {
    setBatchFiles(batchFiles.filter((_, i) => i !== index));
  };

  const handleBatchUpload = async () => {
    if (batchFiles.length === 0) return;

    setIsBatchUploading(true);
    const progress = {};

    batchFiles.forEach((_, index) => {
      progress[index] = 0;
    });
    setBatchUploadProgress(progress);

    let successCount = 0;

    for (let i = 0; i < batchFiles.length; i++) {
      try {
        await spacesService.uploadFileWithProgress(
          batchFiles[i],
          currentFolder,
          {},
          (percent) => {
            setBatchUploadProgress(prev => ({
              ...prev,
              [i]: percent
            }));
          }
        );
        successCount++;
      } catch (error) {
        console.error('Error uploading:', batchFiles[i].name, error);
      }
    }

    notify(`✅ Uploaded ${successCount} of ${batchFiles.length} files`);
    setBatchFiles([]);
    setBatchUploadProgress({});
    setIsBatchUploading(false);
    loadFiles();
  };

  return (
    <div className="App">
      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>🗄️ DO Spaces</h1>
          <p>File Manager</p>
        </div>

        {!connected ? (
          <form className="credentials-form" onSubmit={handleConnect}>
            <div className="form-group">
              <label>Space Name</label>
              <input
                type="text"
                value={credentials.spaceName}
                onChange={(e) => setCredentials({...credentials, spaceName: e.target.value})}
                placeholder="my-space"
                required
              />
            </div>

            <div className="form-group">
              <label>Region</label>
              <select
                value={credentials.region}
                onChange={(e) => setCredentials({...credentials, region: e.target.value})}
              >
                <option value="sgp1">Singapore</option>
                <option value="nyc3">New York</option>
                <option value="sfo3">San Francisco</option>
                <option value="ams3">Amsterdam</option>
                <option value="fra1">Frankfurt</option>
              </select>
            </div>

            <div className="form-group">
              <label>Access Key</label>
              <input
                type="text"
                value={credentials.accessKey}
                onChange={(e) => setCredentials({...credentials, accessKey: e.target.value})}
                placeholder="DO00..."
                required
              />
            </div>

            <div className="form-group">
              <label>Secret Key</label>
              <input
                type="password"
                value={credentials.secretKey}
                onChange={(e) => setCredentials({...credentials, secretKey: e.target.value})}
                placeholder="••••••"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '🔄 Connecting...' : '🚀 Connect'}
            </button>
          </form>
        ) : (
          <div className="connected-info">
            <div className="info-card">
              <div className="info-label">Space</div>
              <div className="info-value">{credentials.spaceName}</div>
            </div>
            <div className="info-card">
              <div className="info-label">Region</div>
              <div className="info-value">{credentials.region}</div>
            </div>
            <button className="btn btn-secondary" onClick={handleDisconnect}>
              🔌 Disconnect
            </button>
          </div>
        )}

        <div className="sidebar-footer">
          <p>🔒 Credentials stored locally</p>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {!connected ? (
          <div className="welcome">
            <div className="welcome-icon">🚀</div>
            <h2>Welcome to DO Spaces Manager</h2>
            <p>Enter your credentials in the sidebar to get started</p>
            <div className="features">
              <div className="feature">📤 Upload files</div>
              <div className="feature">📁 Create folders</div>
              <div className="feature">🔗 Copy URLs</div>
              <div className="feature">🗑️ Delete files</div>
            </div>
          </div>
        ) : (
          <>
            {/* Breadcrumb */}
            <div className="breadcrumb">
              <button className="breadcrumb-item" onClick={goToRoot}>
                🏠 Root
              </button>
              {folderPath.map((folder, index) => (
                <React.Fragment key={index}>
                  <span className="breadcrumb-separator">/</span>
                  <span className="breadcrumb-item">{folder.name}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Toolbar */}
            <div className="toolbar">
              <div className="toolbar-left">
                {folderPath.length > 0 && (
                  <button className="btn btn-secondary" onClick={goBack}>
                    ← Back
                  </button>
                )}
                <button className="btn btn-secondary" onClick={() => setShowNewFolder(!showNewFolder)}>
                  📁 New Folder
                </button>
              </div>

              <div className="toolbar-center">
                <div className="search-box">
                  <span className="search-icon">🔍</span>
                  <input
                    type="text"
                    placeholder="Search files and folders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  {searchQuery && (
                    <button
                      className="search-clear"
                      onClick={() => setSearchQuery('')}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <button className="btn btn-secondary" onClick={loadFiles}>
                🔄 Refresh
              </button>
            </div>

            {/* Multi-select toolbar */}
            {selectedItems.size > 0 && (
              <div className="multi-select-toolbar">
                <div className="multi-select-info">
                  <span>{selectedItems.size} item(s) selected</span>
                </div>
                <div className="multi-select-actions">
                  <button className="btn btn-secondary" onClick={selectAll}>
                    Select All
                  </button>
                  <button className="btn btn-secondary" onClick={clearSelection}>
                    Clear Selection
                  </button>
                  <button className="btn btn-danger" onClick={deleteSelected}>
                    🗑️ Delete Selected
                  </button>
                </div>
              </div>
            )}

            {/* New Folder Input */}
            {showNewFolder && (
              <div className="new-folder-form">
                <input
                  type="text"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <button className="btn btn-primary" onClick={handleCreateFolder}>
                  Create
                </button>
                <button className="btn btn-secondary" onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName('');
                }}>
                  Cancel
                </button>
              </div>
            )}

            {/* Upload Area */}
            <div className="upload-area">
              <div className="upload-tabs">
                <div className="upload-tab active">
                  📤 Batch Upload
                </div>
              </div>

              <div className="upload-box">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleBatchFileSelect}
                  className="file-input"
                />
                <div className="upload-icon">📤</div>
                <p>{batchFiles.length > 0 ? `${batchFiles.length} file(s) selected` : 'Click or drag to upload multiple files'}</p>
              </div>

              {batchFiles.length > 0 && !isBatchUploading && (
                <div className="batch-file-list">
                  {batchFiles.map((file, index) => (
                    <div key={index} className="batch-file-item">
                      <span className="batch-file-icon">📄</span>
                      <span className="batch-file-name">{file.name}</span>
                      <span className="batch-file-size">{spacesService.constructor.formatFileSize(file.size)}</span>
                      <button
                        className="batch-file-remove"
                        onClick={() => removeBatchFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div className="batch-upload-actions">
                    <button className="btn btn-primary" onClick={handleBatchUpload}>
                      🚀 Upload All ({batchFiles.length})
                    </button>
                    <button className="btn btn-secondary" onClick={() => {
                      setBatchFiles([]);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}>
                      Clear All
                    </button>
                  </div>
                </div>
              )}

              {isBatchUploading && (
                <div className="batch-progress-container">
                  {batchFiles.map((file, index) => (
                    <div key={index} className="batch-progress-item">
                      <div className="batch-progress-info">
                        <span className="batch-progress-name">{file.name}</span>
                        <span className="batch-progress-percent">{batchUploadProgress[index] || 0}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{width: `${batchUploadProgress[index] || 0}%`}}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Files Grid */}
            {loading ? (
              <div className="loading">
                <div className="spinner" />
                <p>Loading...</p>
              </div>
            ) : (
              <div className="files-grid">
                {/* Folders */}
                {filteredFolders.map((folder, index) => (
                  <div
                    key={index}
                    className={`file-card folder ${selectedItems.has(folder.prefix) ? 'selected' : ''}`}
                  >
                    <div className="file-select-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(folder.prefix)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleSelectItem(folder);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div onClick={() => navigateToFolder(folder)}>
                      <div className="file-icon">📁</div>
                      <div className="file-name">{folder.name}</div>
                    </div>
                  </div>
                ))}

                {/* Files */}
                {filteredFiles.map((file, index) => (
                  <div
                    key={index}
                    className={`file-card ${selectedItems.has(file.key) ? 'selected' : ''}`}
                  >
                    <div className="file-select-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(file.key)}
                        onChange={() => toggleSelectItem(file)}
                      />
                    </div>
                    <div className="file-icon">
                      {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? '🖼️' :
                       file.name.match(/\.(pdf)$/i) ? '📄' :
                       file.name.match(/\.(doc|docx)$/i) ? '📝' :
                       file.name.match(/\.(xls|xlsx)$/i) ? '📊' :
                       file.name.match(/\.(zip|rar)$/i) ? '📦' : '📄'}
                    </div>
                    <div className="file-info">
                      <div className="file-name" title={file.name}>{file.name}</div>
                      <div className="file-meta">
                        {spacesService.constructor.formatFileSize(file.size)}
                      </div>
                    </div>
                    <div className="file-actions">
                      <button 
                        className="btn-icon" 
                        onClick={() => copyUrl(file.cdnUrl)}
                        title="Copy URL"
                      >
                        📋
                      </button>
                      <a 
                        href={file.cdnUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-icon"
                        title="View"
                      >
                        👁️
                      </a>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleDelete(file)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}

                {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                  <div className="empty-state">
                    <div className="empty-icon">
                      {searchQuery ? '🔍' : '📭'}
                    </div>
                    <p>{searchQuery ? 'No results found' : 'This folder is empty'}</p>
                    <p className="empty-hint">
                      {searchQuery ? 'Try a different search term' : 'Upload files or create folders to get started'}
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
