# 🗄️ DigitalOcean Spaces Manager

Modern web interface để quản lý files trên DigitalOcean Spaces. Build bằng React, deploy được lên GitHub Pages.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 📤 **Upload files** với progress tracking
- 📁 **Tạo folders** và navigate qua folder structure
- 🔗 **Copy URLs** (CDN URLs) một cách nhanh chóng
- 👁️ **Preview files** trong tab mới
- 🗑️ **Delete files** với confirmation
- 💾 **Auto-save credentials** trong localStorage
- 📱 **Responsive design** - hoạt động tốt trên mobile
- 🔒 **Secure** - credentials chỉ lưu local, không gửi lên server nào khác

## 🚀 Quick Start (5 phút)

### Prerequisites

- Node.js 14+ 
- npm hoặc yarn
- DigitalOcean Space với API credentials

### Bước 1: Installation

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/digitalocean-spaces-manager.git
cd digitalocean-spaces-manager

# Install dependencies
npm install
```

### Bước 2: Setup CORS

**Chọn 1 trong 2 cách:**

**Cách A - Via Console (Dễ nhất):**
1. Login vào https://cloud.digitalocean.com
2. Vào Space → Settings → CORS Configurations
3. Add rule: Origins: `*`, Methods: `GET, PUT, POST, DELETE`, Headers: `*`

**Cách B - Via Script:**
```bash
chmod +x setup-cors.sh && ./setup-cors.sh
```

📖 Lần đầu dùng AWS CLI? Xem: [HUONG-DAN-AWS-CLI.md](HUONG-DAN-AWS-CLI.md)

### Bước 3: Run App

```bash
npm start
```

App sẽ mở tại `http://localhost:3000`

### Bước 4: Connect & Test

1. Nhập Space credentials trong sidebar
2. Click **Connect**
3. Upload file để test → Done! 🎉


## 📦 Build for Production

```bash
# Build static files
npm run build

# Files sẽ được tạo trong folder `build/`
```

## 🌐 Deploy to GitHub Pages

### Lần Đầu Deploy

**1. Setup Git Repository (nếu chưa có):**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/digitalocean-spaces-manager.git
git branch -M main
git push -u origin main
```

**2. Update package.json:**

Mở `package.json` và sửa dòng `homepage`:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/digitalocean-spaces-manager"
}
```

**3. Deploy:**

```bash
npm run deploy
```

**4. Enable GitHub Pages:**

1. Vào repository trên GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: `gh-pages` → `/ (root)` → Save
5. Đợi ~1-2 phút

App sẽ live tại: `https://YOUR_USERNAME.github.io/digitalocean-spaces-manager`

### Update Sau Này

Khi có thay đổi code:

```bash
# Commit changes
git add .
git commit -m "Update: mô tả thay đổi"
git push origin main

# Redeploy
npm run deploy
```

## 🎨 Usage

### Connect to Space

1. Mở app
2. Nhập credentials trong sidebar:
   - **Space Name**: Tên Space của bạn
   - **Region**: Singapore (sgp1) hoặc region khác
   - **Access Key**: DO00XXXXXXXXXXXXX
   - **Secret Key**: Your secret key
3. Click **Connect**

### Upload Files

1. Click vào upload area hoặc drag & drop file
2. Click **Upload**
3. File sẽ được upload với progress bar

### Create Folder

1. Click **New Folder**
2. Nhập tên folder
3. Press Enter hoặc click **Create**

### Navigate Folders

- Click vào folder để vào trong
- Click **← Back** để quay lại
- Click **🏠 Root** trong breadcrumb để về root

### Copy URL

1. Click icon 📋 trên file
2. URL sẽ được copy vào clipboard
3. Paste vào DAG config hoặc nơi khác

### Delete Files

1. Click icon 🗑️
2. Confirm deletion
3. File sẽ bị xóa

## 🔒 Security Notes

- **Credentials**: Lưu trong `localStorage`, chỉ tồn tại trong browser của bạn
- **No Backend**: App hoàn toàn client-side, không có server
- **Direct to DigitalOcean**: Tất cả requests đi thẳng tới DigitalOcean API
- **HTTPS Required**: GitHub Pages tự động dùng HTTPS

⚠️ **Lưu ý**: Vì đây là client-side app, credentials có thể bị lộ qua DevTools. Chỉ dùng cho:
- Development/Testing
- Internal team tools
- Non-sensitive data

Không nên dùng cho production với sensitive data!

## 🛠️ Technology Stack

- **React 18** - UI framework
- **AWS SDK** - S3-compatible API
- **CSS3** - Styling với gradients và animations
- **LocalStorage** - Lưu credentials

## 📁 Project Structure

```
digitalocean-spaces-manager/
├── public/
│   └── index.html
├── src/
│   ├── services/
│   │   └── spacesService.js    # DigitalOcean Spaces API wrapper
│   ├── App.js                   # Main component
│   ├── App.css                  # Styles
│   ├── index.js                 # Entry point
│   └── index.css
├── package.json
└── README.md
```

## 🎯 Features Roadmap

- [x] Basic file upload/delete
- [x] Folder management
- [x] Copy URLs
- [x] Progress tracking
- [ ] Batch upload
- [ ] File preview (images)
- [ ] Search files
- [ ] File metadata editing
- [ ] Drag & drop folders
- [ ] Multi-select operations

## 🐛 Troubleshooting

### ❌ Lỗi 404 Sau Khi Deploy (JS/CSS không load)

```
Failed to load resource: the server responded with a status of 404
main.xxxxx.js
main.xxxxx.css
```

**Có 2 nguyên nhân chính:**

**Nguyên nhân 1: Homepage không khớp với tên repository**

Check `package.json`:
```json
"homepage": "https://YOUR_USERNAME.github.io/REPO_NAME"
```

Tên repository phải **GIỐNG CHÍNH XÁC** với tên trên GitHub!

Ví dụ:
- ❌ Sai: `homepage: "...github.io/my-app"` nhưng repo tên `My_App`
- ✅ Đúng: `homepage: "...github.io/My_App"`

**Fix:**
1. Vào GitHub repository, copy chính xác tên repo
2. Update `homepage` trong `package.json`
3. Rebuild: `npm run deploy`

**Nguyên nhân 2: GitHub Pages dùng Jekyll**

GitHub Pages bỏ qua files bắt đầu với `_`

**Fix:** File `.nojekyll` đã được thêm vào `public/` folder. Nếu vẫn lỗi:

```bash
# Kiểm tra file có trong build không
ls -la build/.nojekyll

# Nếu không có, tạo lại
touch public/.nojekyll
npm run deploy
```

Đợi 1-2 phút để GitHub Pages update, sau đó refresh browser (Ctrl+Shift+R để clear cache).

### ❌ Lỗi CORS

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Nguyên nhân**: CORS chưa được enable trên Space

**Giải pháp**: 
1. Vào DigitalOcean → Space → Settings → CORS
2. Add rule với Origins: `*`, Methods: `GET, PUT, POST, DELETE`
3. Hoặc chạy: `./setup-cors.sh`

### ❌ Upload Failed

```
Upload failed: The request signature we calculated does not match
```

**Nguyên nhân**: Credentials sai hoặc không đúng

**Giải pháp**: 
- Kiểm tra lại Access Key và Secret Key
- Verify Space name và region chính xác
- Re-generate keys nếu cần

### ❌ Connection Failed

```
Failed to connect to Space
```

**Giải pháp**:
1. Kiểm tra Space name (không có spaces, lowercase)
2. Verify region (sgp1, nyc3, sfo3, etc.)
3. Đảm bảo Space tồn tại và accessible
4. Check network/firewall

### ❌ Files Không Hiển Thị

**Giải pháp**:
- Click nút **Refresh** 
- Kiểm tra lại credentials
- Verify Space permissions (Read access)
- Check console để xem error details

### ❌ AWS CLI Errors (khi chạy script)

```
aws: command not found
```

**Giải pháp**: Cài AWS CLI
```bash
# macOS
brew install awscli

# Ubuntu/Debian
sudo apt-get install awscli
```

```
The AWS Access Key Id you provided does not exist
```

**Giải pháp**: Configure AWS CLI credentials
```bash
aws configure --profile digitalocean
```

Xem hướng dẫn chi tiết: [HUONG-DAN-AWS-CLI.md](HUONG-DAN-AWS-CLI.md)

## 📝 License

MIT License - free to use and modify

## 🤝 Contributing

Pull requests are welcome! 

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Contact

Có vấn đề? Tạo issue trên GitHub hoặc contact team.

---

Made with ❤️ for AI-Core DataFlow Team
