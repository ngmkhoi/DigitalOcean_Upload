#!/bin/bash

# DigitalOcean Spaces CORS Setup Script
# This script helps you configure CORS for your Space

echo "============================================"
echo "   DigitalOcean Spaces CORS Setup"
echo "============================================"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "Please install it first:"
    echo "  - Mac: brew install awscli"
    echo "  - Ubuntu: sudo apt-get install awscli"
    echo "  - Manual: https://aws.amazon.com/cli/"
    exit 1
fi

echo "✅ AWS CLI found"
echo ""

# Get user input
read -p "Enter your Space name: " SPACE_NAME
read -p "Enter your region (default: sgp1): " REGION
REGION=${REGION:-sgp1}

echo ""
echo "Setting up CORS for Space: $SPACE_NAME"
echo "Region: $REGION"
echo ""

# Create CORS configuration
cat > /tmp/cors-config.json <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

echo "📝 CORS Configuration:"
cat /tmp/cors-config.json
echo ""

read -p "Apply this configuration? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ]; then
    echo "❌ Cancelled"
    exit 0
fi

# Apply CORS
echo ""
echo "🔧 Applying CORS configuration..."

aws s3api put-bucket-cors \
    --bucket "$SPACE_NAME" \
    --endpoint-url "https://${REGION}.digitaloceanspaces.com" \
    --cors-configuration file:///tmp/cors-config.json

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ CORS configuration applied successfully!"
    echo ""
    echo "You can now:"
    echo "  1. Upload files from your browser"
    echo "  2. Access files via CDN URLs"
    echo ""
    echo "Your Space URL: https://${SPACE_NAME}.${REGION}.digitaloceanspaces.com"
    echo "Your CDN URL: https://${SPACE_NAME}.${REGION}.cdn.digitaloceanspaces.com"
else
    echo ""
    echo "❌ Failed to apply CORS configuration"
    echo ""
    echo "🔑 Có thể bạn chưa cấu hình AWS CLI credentials."
    echo ""
    echo "📝 Hướng dẫn cấu hình (chạy lệnh sau trong terminal):"
    echo ""
    echo "  aws configure --profile digitalocean"
    echo ""
    echo "Sau đó nhập các thông tin khi được hỏi:"
    echo "  AWS Access Key ID: [Nhập DO_ACCESS_KEY của bạn]"
    echo "  AWS Secret Access Key: [Nhập DO_SECRET_KEY của bạn]"
    echo "  Default region name: ${REGION}"
    echo "  Default output format: [Enter để bỏ qua]"
    echo ""
    echo "📍 Lấy credentials ở đâu?"
    echo "  1. Vào https://cloud.digitalocean.com"
    echo "  2. API → Spaces Keys"
    echo "  3. Generate New Key hoặc dùng key có sẵn"
    echo ""
    echo "Sau khi configure xong, chạy lại script này!"
fi

# Cleanup
rm -f /tmp/cors-config.json

echo ""
echo "============================================"
