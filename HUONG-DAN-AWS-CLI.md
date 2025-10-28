# 🔑 Hướng Dẫn Cấu Hình AWS CLI cho DigitalOcean Spaces

## ❓ Tôi phải nhập thông tin AWS credentials ở đâu?

Bạn phải nhập thông tin này **trong Terminal/Command Line**, KHÔNG phải trong file hay trong app.

## 📋 Các Bước Chi Tiết

### Bước 1: Lấy Credentials từ DigitalOcean

1. Đăng nhập vào https://cloud.digitalocean.com
2. Ở menu bên trái, click **API**
3. Chọn tab **Spaces Keys**
4. Click nút **Generate New Key**
5. Đặt tên cho key (ví dụ: "spaces-manager")
6. **LƯU LẠI** 2 thông tin này:
   - **Access Key** (dạng: `DO00XXXXXXXXXXXXX`)
   - **Secret Key** (dạng: `abcdef123456...`)
   
   ⚠️ **QUAN TRỌNG**: Secret Key chỉ hiện 1 lần duy nhất. Copy và lưu ngay!

### Bước 2: Cài Đặt AWS CLI (nếu chưa có)

**Trên macOS:**
```bash
brew install awscli
```

**Trên Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install awscli
```

**Kiểm tra đã cài đặt thành công:**
```bash
aws --version
```

### Bước 3: Configure AWS CLI

Mở **Terminal** và chạy lệnh:

```bash
aws configure --profile digitalocean
```

Sau đó bạn sẽ được hỏi **4 câu hỏi**. Trả lời như sau:

```
AWS Access Key ID [None]: DO00XXXXXXXXXXXXX
↑ Dán Access Key bạn copy ở Bước 1

AWS Secret Access Key [None]: abcdef123456...
↑ Dán Secret Key bạn copy ở Bước 1

Default region name [None]: sgp1
↑ Nhập region của Space (sgp1, nyc3, sfo3, etc.)

Default output format [None]: 
↑ Nhấn Enter để bỏ qua
```

### Bước 4: Kiểm Tra Cấu Hình

Credentials của bạn được lưu tại:
```
~/.aws/credentials
```

Bạn có thể xem bằng lệnh:
```bash
cat ~/.aws/credentials
```

Sẽ thấy nội dung kiểu như:
```
[digitalocean]
aws_access_key_id = DO00XXXXXXXXXXXXX
aws_secret_access_key = abcdef123456...
```

### Bước 5: Chạy Lại Script

Sau khi configure xong, chạy lại:
```bash
./setup-cors.sh
```

## 🔧 Ví Dụ Thực Tế

```bash
# 1. Configure credentials
$ aws configure --profile digitalocean
AWS Access Key ID [None]: DO00ABC123XYZ456
AWS Secret Access Key [None]: Xy9fK3mN2pQ8rL5vT
Default region name [None]: sgp1
Default output format [None]: 

# 2. Chạy script setup CORS
$ ./setup-cors.sh
Enter your Space name: my-storage
Enter your region (default: sgp1): sgp1

✅ CORS configuration applied successfully!
```

## 🤔 FAQ

**Q: Tôi có thể nhập credentials vào file .env không?**
A: Không được. AWS CLI cần credentials trong `~/.aws/credentials`.

**Q: Tôi đã có AWS credentials cho Amazon S3, có dùng được không?**
A: Không. Bạn phải tạo riêng credentials cho DigitalOcean Spaces.

**Q: Credentials có bị upload lên GitHub không?**
A: Không. Credentials lưu trong `~/.aws/credentials` ở máy bạn, không phải trong project.

**Q: Làm sao xóa/thay đổi credentials?**
A: Chạy lại `aws configure --profile digitalocean` và nhập thông tin mới.

## 🆘 Gặp Lỗi?

**Lỗi: "AWS CLI is not installed"**
- Cài đặt AWS CLI theo Bước 2

**Lỗi: "The AWS Access Key Id you provided does not exist"**
- Kiểm tra lại Access Key và Secret Key
- Đảm bảo đã copy đúng và không có khoảng trắng thừa

**Lỗi: "Access Denied"**
- Key của bạn có thể chưa có quyền
- Vào DigitalOcean → Spaces Keys → đảm bảo key có quyền Read và Write

## 📚 Tài Liệu Tham Khảo

- [DigitalOcean Spaces Documentation](https://docs.digitalocean.com/products/spaces/)
- [AWS CLI Configuration](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

