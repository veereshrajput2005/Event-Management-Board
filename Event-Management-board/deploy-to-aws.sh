#!/bin/bash

# Event Management Board - Complete AWS EC2 Deployment Script
# This script installs and deploys everything on your EC2 instance
# Just run: chmod +x deploy-to-aws.sh && ./deploy-to-aws.sh

set -e

echo "================================================"
echo "🚀 Event Management Board - AWS EC2 Deployment"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Update system
echo -e "${GREEN}[1/10]${NC} Updating system packages..."
sudo yum update -y > /dev/null 2>&1
sudo yum upgrade -y > /dev/null 2>&1

# Step 2: Install Node.js
echo -e "${GREEN}[2/10]${NC} Installing Node.js v20..."
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash - > /dev/null 2>&1
sudo yum install -y nodejs > /dev/null 2>&1

# Step 3: Install Git
echo -e "${GREEN}[3/10]${NC} Installing Git..."
sudo yum install -y git > /dev/null 2>&1

# Step 4: Install Nginx
echo -e "${GREEN}[4/10]${NC} Installing and starting Nginx..."
sudo yum install -y nginx > /dev/null 2>&1
sudo systemctl start nginx
sudo systemctl enable nginx

# Step 5: Install PM2
echo -e "${GREEN}[5/10]${NC} Installing PM2 (process manager)..."
sudo npm install -g pm2 > /dev/null 2>&1

# Step 6: Clone repository
echo -e "${GREEN}[6/10]${NC} Cloning repository..."
cd ~
mkdir -p apps
cd apps
if [ -d "Event-Management-board" ]; then
    cd Event-Management-board
    git pull origin main > /dev/null 2>&1
else
    git clone https://github.com/veereshrajput/Event-Management-board.git > /dev/null 2>&1
    cd Event-Management-board
fi

# Step 7: Install dependencies
echo -e "${GREEN}[7/10]${NC} Installing dependencies..."
npm install > /dev/null 2>&1
cd backend && npm install > /dev/null 2>&1 && cd ..
cd frontend && npm install > /dev/null 2>&1 && cd ..

# Step 8: Build frontend
echo -e "${GREEN}[8/10]${NC} Building frontend for production..."
cd frontend
npm run build > /dev/null 2>&1
cd ..

# Step 9: Create .env file
echo -e "${GREEN}[9/10]${NC} Setting up environment variables..."
cat > backend/.env << 'EOF'
GEMINI_API_KEY="AIzaSyC-q0JwFDg3SFsQXTFvsE0wdiN2GnlVTQ8"
MONGODB_URI="mongodb+srv://veereshrajput2005_db_user:-3RWP9GDX-72g%3Ak@cluster0.onjedqt.mongodb.net/?appName=Cluster0"
PORT=4000
NODE_ENV=production
EOF

# Step 10: Setup PM2
echo -e "${GREEN}[10/10]${NC} Starting backend with PM2..."
cd backend
pm2 start index.js --name "event-backend" || pm2 restart event-backend
cd ..

# Setup PM2 startup
pm2 startup systemd -u ec2-user --hp /home/ec2-user > /dev/null 2>&1
pm2 save > /dev/null 2>&1

# Configure Nginx
echo -e "${YELLOW}Setting up Nginx...${NC}"
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

sudo tee /etc/nginx/sites-available/event-board > /dev/null << 'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    location / {
        root /home/ec2-user/apps/Event-Management-board/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/event-board /etc/nginx/sites-enabled/event-board 2>/dev/null || true
sudo unlink /etc/nginx/sites-enabled/default 2>/dev/null || true
sudo nginx -t > /dev/null 2>&1
sudo systemctl restart nginx

# Print summary
echo ""
echo "================================================"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "🌐 Your app is live at:"
echo "   http://$PUBLIC_IP"
echo ""
echo "📊 Backend API:"
echo "   http://$PUBLIC_IP:4000"
echo ""
echo "📋 Useful commands:"
echo "   pm2 list                    - View running processes"
echo "   pm2 logs event-backend      - View backend logs"
echo "   pm2 restart event-backend   - Restart backend"
echo ""
echo "🔍 To view logs:"
echo "   pm2 logs event-backend -f"
echo "   sudo tail -f /var/log/nginx/error.log"
echo ""
echo "================================================"
