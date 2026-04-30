#!/bin/bash

# Event Management Board - AWS EC2 Automated Deployment
# Run this script on your EC2 instance after cloning the repository

set -e

echo "🚀 Starting Event Management Board Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Step 1: Update system
print_status "Updating system packages..."
sudo yum update -y > /dev/null 2>&1
sudo yum upgrade -y > /dev/null 2>&1

# Step 2: Install Node.js
print_status "Installing Node.js..."
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash - > /dev/null 2>&1
sudo yum install -y nodejs > /dev/null 2>&1

# Step 3: Install Git
print_status "Installing Git..."
sudo yum install -y git > /dev/null 2>&1

# Step 4: Install Nginx
print_status "Installing and starting Nginx..."
sudo yum install -y nginx > /dev/null 2>&1
sudo systemctl start nginx
sudo systemctl enable nginx

# Step 5: Verify installations
print_status "Verifying installations..."
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo "  Git: $(git --version)"
echo "  Nginx: $(nginx -v 2>&1)"

# Step 6: Install PM2 globally
print_status "Installing PM2 (process manager)..."
sudo npm install -g pm2 > /dev/null 2>&1

# Step 7: Install dependencies
print_status "Installing project dependencies..."
cd "$(dirname "$0")"

echo "  Installing root dependencies..."
npm install > /dev/null 2>&1

echo "  Installing backend dependencies..."
cd backend && npm install > /dev/null 2>&1 && cd ..

echo "  Installing frontend dependencies..."
cd frontend && npm install > /dev/null 2>&1 && cd ..

# Step 8: Build frontend
print_status "Building frontend for production..."
cd frontend
npm run build > /dev/null 2>&1
cd ..

# Step 9: Create environment variables template
print_status "Creating environment file templates..."

if [ ! -f backend/.env ]; then
    cat > backend/.env << 'EOF'
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
EOF
    print_warning "backend/.env created - UPDATE WITH YOUR VALUES!"
else
    print_warning "backend/.env already exists - skipping"
fi

if [ ! -f frontend/.env.production ]; then
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "YOUR_PUBLIC_IP")
    cat > frontend/.env.production << EOF
VITE_API_URL=http://$PUBLIC_IP:4000
EOF
    print_warning "frontend/.env.production created with IP: $PUBLIC_IP"
else
    print_warning "frontend/.env.production already exists - skipping"
fi

# Step 10: Setup PM2 for backend
print_status "Setting up PM2 process manager..."
pm2_status=$(pm2 list | grep event-backend || echo "")
if [ -z "$pm2_status" ]; then
    cd backend
    pm2 start index.js --name "event-backend"
    cd ..
else
    print_warning "event-backend already running in PM2"
fi

# Save PM2 startup config
pm2 shutdown
sudo pm2 startup systemd -u ec2-user --hp /home/ec2-user > /dev/null 2>&1
pm2 start backend/index.js --name "event-backend"
pm2 save > /dev/null 2>&1

# Step 11: Configure Nginx
print_status "Configuring Nginx..."

# Get public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo "localhost")

# Create Nginx config
sudo tee /etc/nginx/sites-available/event-board > /dev/null << 'NGINX_CONFIG'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    # Frontend (React/Vite build)
    location / {
        root /home/ec2-user/apps/Event-Management-board/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
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
NGINX_CONFIG

# Enable the site
sudo ln -sf /etc/nginx/sites-available/event-board /etc/nginx/sites-enabled/event-board 2>/dev/null || true

# Remove default config
sudo unlink /etc/nginx/sites-enabled/default 2>/dev/null || true

# Test Nginx config
sudo nginx -t 2>&1 | grep -q "successful" && print_status "Nginx config is valid" || print_error "Nginx config has errors"

# Restart Nginx
sudo systemctl restart nginx

# Step 12: Update backend CORS
print_status "Updating backend CORS settings..."
# The CORS is already broad in the code, so this is just informational

# Print summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}🎉 Deployment Setup Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 IMPORTANT - Complete these steps:"
echo ""
echo "1. Edit backend/.env with your credentials:"
echo "   sudo nano backend/.env"
echo ""
echo "2. Required environment variables:"
echo "   - MONGODB_URI (from MongoDB Atlas)"
echo "   - GEMINI_API_KEY (from Google AI Studio)"
echo ""
echo "3. After updating .env, restart backend:"
echo "   pm2 restart event-backend"
echo ""
echo "🌐 Access your app at:"
echo "   http://$PUBLIC_IP"
echo ""
echo "📊 Backend API endpoint:"
echo "   http://$PUBLIC_IP:4000"
echo ""
echo "📋 Useful commands:"
echo "   pm2 list              - View running processes"
echo "   pm2 logs event-backend - View backend logs"
echo "   pm2 restart event-backend - Restart backend"
echo "   pm2 stop event-backend    - Stop backend"
echo ""
echo "🔧 View logs:"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   pm2 logs event-backend"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
