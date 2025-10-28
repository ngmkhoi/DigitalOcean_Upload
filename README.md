# 🗄️ DigitalOcean Spaces Manager

Modern web interface để quản lý files trên DigitalOcean Spaces với đầy đủ tính năng: Batch Upload, Search, Multi-Select. Build bằng React, deploy được lên GitHub Pages.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![React](https://img.shields.io/badge/react-18.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

### Core Features
- 📤 **Batch Upload** - Upload nhiều files cùng lúc với progress tracking từng file
- 🔍 **Search** - Tìm kiếm files/folders real-time theo tên
- ☑️ **Multi-Select** - Chọn nhiều items và xóa hàng loạt
- 📁 **Folder Management** - Tạo folders và navigate qua folder structure
- 🔗 **Copy URLs** - Copy CDN URLs một cách nhanh chóng
- 👁️ **Preview Files** - Xem files trong tab mới
- 🗑️ **Batch Delete** - Xóa nhiều files/folders cùng lúc

### UI/UX Features
- 💾 **Auto-save Credentials** - Lưu trong localStorage
- 📊 **Progress Tracking** - Theo dõi tiến trình upload từng file
- 📱 **Responsive Design** - Hoạt động tốt trên mọi thiết bị
- 🎨 **Modern UI** - Gradient design với smooth animations
- 🔒 **Secure** - Credentials chỉ lưu local, không gửi lên server

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

## 🎬 Key Features Demo

### 1. 🔍 Search - Tìm Kiếm Real-time
Gõ vào search box để filter files/folders ngay lập tức. Không cần nhấn Enter!

```
Gõ "image" → Chỉ hiện files có chữ "image"
Gõ "2024"  → Chỉ hiện files có chữ "2024"
```

### 2. ☑️ Multi-Select - Chọn Nhiều & Xóa Hàng Loạt
Click checkbox để chọn nhiều items, sau đó xóa tất cả cùng lúc.

```
✓ file1.jpg
✓ file2.png
✓ folder1
→ Click "Delete Selected" → Xóa cả 3 items
```

### 3. 📤 Batch Upload - Upload Nhiều Files
Upload 10, 20, 50 files cùng lúc với progress tracking từng file.

```
Select 10 files → Upload All → Watch progress bars
→ All files uploaded!
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

### 📤 Batch Upload

**Upload nhiều files cùng lúc:**

1. Click vào upload area hoặc drag & drop
2. **Chọn nhiều files** (Cmd+Click hoặc Shift+Click)
3. Xem danh sách files preview với tên và size
4. Click **✕** để xóa file nào không muốn upload
5. Click **🚀 Upload All (N)** để bắt đầu
6. Theo dõi progress bar từng file
7. Files sẽ xuất hiện trong folder sau khi upload xong

**Tính năng:**
- Upload không giới hạn số lượng files
- Progress tracking riêng cho từng file
- Xóa files khỏi batch trước khi upload
- Notification tổng kết khi hoàn thành

### 🔍 Search

**Tìm kiếm files/folders:**

1. Nhìn vào thanh toolbar giữa màn hình
2. Gõ vào ô **"Search files and folders..."**
3. Kết quả tự động filter real-time
4. Click nút **✕** để clear search

**Tính năng:**
- Tìm kiếm real-time (không cần nhấn Enter)
- Không phân biệt chữ hoa/thường
- Filter cả files và folders
- Hiện "No results found" khi không có kết quả

### ☑️ Multi-Select & Batch Delete

**Chọn và xóa nhiều items:**

1. Click **checkbox** ở góc phải trên của file/folder
2. Chọn nhiều items (mỗi item có checkbox riêng)
3. Xem toolbar xanh hiện ra với số lượng items đã chọn
4. Dùng các nút:
   - **Select All** - Chọn tất cả items trong folder
   - **Clear Selection** - Bỏ chọn tất cả
   - **🗑️ Delete Selected** - Xóa tất cả items đã chọn

**Tính năng:**
- Visual feedback: items được chọn có viền xanh
- Selection counter hiển thị số lượng
- Xác nhận trước khi xóa hàng loạt
- Animation mượt

### Create Folder

1. Click **📁 New Folder**
2. Nhập tên folder
3. Press Enter hoặc click **Create**

### Navigate Folders

- Click vào folder để vào trong
- Click **← Back** để quay lại
- Click **🏠 Root** trong breadcrumb để về root

### Copy URL

1. Click icon 📋 trên file
2. URL sẽ được copy vào clipboard
3. Paste vào nơi cần dùng

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

- **React 18** - UI framework với Hooks
- **AWS SDK** - S3-compatible API cho DigitalOcean Spaces
- **CSS3** - Modern styling với gradients, animations, transitions
- **LocalStorage** - Lưu credentials an toàn

### Key Features Implementation
- **Search**: Real-time filtering với Array.filter()
- **Multi-Select**: Set data structure cho efficient selection
- **Batch Upload**: Promise-based parallel uploads với progress callbacks
- **Responsive**: CSS Grid & Flexbox cho adaptive layouts

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

### ✅ Completed
- [x] Basic file upload/delete
- [x] Folder management
- [x] Copy URLs
- [x] Progress tracking
- [x] **Batch upload** (Upload nhiều files cùng lúc)
- [x] **Search files** (Tìm kiếm real-time)
- [x] **Multi-select operations** (Chọn và xóa hàng loạt)

### 🔮 Future Ideas
- [ ] File preview (images, PDFs)
- [ ] File metadata editing
- [ ] Drag & drop folders
- [ ] Move/Copy files between folders
- [ ] Rename files
- [ ] Download files
- [ ] Public/Private toggle
- [ ] Share links with expiration
- [ ] Dark mode

## 📝 License

MIT License - free to use and modify

## 🤝 Contributing

Pull requests are welcome! 

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

Made with ❤️ for AI-Core DataFlow Team
