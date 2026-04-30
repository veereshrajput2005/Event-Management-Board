# 🚀 AWS EC2 Deployment Guide

Complete guide to deploy Event Management Board on AWS EC2 (Amazon Linux 2, t3.micro).

## Prerequisites

- ✓ AWS Account with EC2 access
- ✓ Google Gemini API key
- ✓ MongoDB Atlas account & connection string
- ✓ Git repository (GitHub recommended)

---

## Step 1: Launch EC2 Instance

### 1.1 Create EC2 Instance

1. Go to [AWS Console](https://console.aws.amazon.com/ec2)
2. Click **"Launch Instances"**
3. **Name & Tags:**
   - Name: `event-management-board`

4. **Application and OS Images:**
   - Select **Amazon Linux 2**
   - Instance type: `t3.micro` (Free tier eligible)

5. **Key Pair:**
   - Create new: `event-board-key`
   - Type: RSA
   - Format: `.pem` (for Mac/Linux) or `.ppk` (for Windows PuTTY)
   - **⚠️ Download and save securely**

6. **Network Settings:**
   - VPC: Default
   - Auto-assign public IP: **Enable**
   - Security Group: **Create new** → name: `event-board-sg`
   
7. **Security Group Inbound Rules:**
   Add these rules:
   - SSH (22): Source `0.0.0.0/0` (from your IP for security)
   - HTTP (80): Source `0.0.0.0/0`
   - HTTPS (443): Source `0.0.0.0/0`
   - Custom TCP (4000): Source `0.0.0.0/0` (backend API)

8. **Storage:**
   - Volume size: `20 GB` (default, fine for free tier)
   - Volume type: `gp3`

9. Click **"Launch Instance"**
10. You'll get a **Public IPv4 address** - save this!

### 1.2 Connect to EC2 Instance

**On Windows with PowerShell:**
```powershell
# Navigate to key location
cd C:\path\to\keyfile
# Connect to EC2
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP
```

**On Mac/Linux:**
```bash
chmod 600 event-board-key.pem
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP
```

---

## Step 2: Setup Server Environment

Run these commands on your EC2 instance:

```bash
# Update system
sudo yum update -y
sudo yum upgrade -y

# Install Node.js (v20 LTS)
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Install Git
sudo yum install -y git

# Install Nginx (reverse proxy)
sudo yum install -y nginx

# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify installations
node --version
npm --version
git --version
nginx -v
```

---

## Step 3: Clone Project & Setup

On your EC2 instance:

```bash
# Create app directory
mkdir ~/apps
cd ~/apps

# Clone your GitHub repository
git clone https://github.com/YOUR_USERNAME/Event-Management-board.git
cd Event-Management-board

# Install dependencies
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

---

## Step 4: Setup Environment Variables

### Backend `.env` file:

```bash
sudo nano backend/.env
```

Add:
```env
PORT=4000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=production
```

Save with `Ctrl+X`, then `Y`, then `Enter`

### Create `.env` for frontend build:

```bash
sudo nano frontend/.env.production
```

Add:
```env
VITE_API_URL=http://YOUR_PUBLIC_IP:4000
```

---

## Step 5: Build Frontend

```bash
cd ~/apps/Event-Management-board/frontend
npm run build
```

This creates a `dist` folder with optimized production files.

---

## Step 6: Setup PM2 (Process Manager)

Install PM2 to keep backend running:

```bash
sudo npm install -g pm2

# Navigate to backend
cd ~/apps/Event-Management-board/backend

# Start backend with PM2
pm2 start index.js --name "event-backend"

# Save PM2 startup
pm2 startup
pm2 save

# Verify it's running
pm2 list
```

---

## Step 7: Configure Nginx (Reverse Proxy)

Create Nginx config:

```bash
sudo nano /etc/nginx/sites-available/event-board
```

Paste this:
```nginx
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

    # Direct backend access on port 4000
    location ~ ^/socket.io {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```

Enable the site:
```bash
sudo ln -sf /etc/nginx/sites-available/event-board /etc/nginx/sites-enabled/event-board

# Remove default config
sudo unlink /etc/nginx/sites-enabled/default

# Test Nginx config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Step 8: Update Backend CORS

Update the backend to accept your EC2 IP:

```bash
sudo nano ~/apps/Event-Management-board/backend/index.js
```

Find the CORS section and update:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://YOUR_PUBLIC_IP',           // Your EC2 public IP
    'http://YOUR_DOMAIN_NAME.com'      // If you have a domain
  ]
}));
```

Restart backend:
```bash
pm2 restart event-backend
```

---

## Step 9: Test Deployment

1. **Get your EC2 Public IP:**
   - Go to AWS EC2 Dashboard
   - Find your instance → Note the public IP

2. **Visit your app:**
   ```
   http://YOUR_PUBLIC_IP
   ```

3. **Test Backend Connection:**
   ```
   http://YOUR_PUBLIC_IP:4000
   ```

4. **Test AI Features:**
   - Create an event
   - Click "✨ Generate with AI"

---

## Step 10: Setup SSL Certificate (HTTPS)

Use Let's Encrypt with Certbot:

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain if you have one)
sudo certbot certonly --nginx -d your-domain.com

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

Update Nginx config to redirect HTTP to HTTPS (if using domain).

---

## Useful Commands

```bash
# SSH into instance
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP

# Pull latest code
cd ~/apps/Event-Management-board && git pull origin main

# Rebuild frontend
cd frontend && npm run build && cd ..

# View backend logs
pm2 logs event-backend

# Monitor instance
pm2 monit

# Restart backend
pm2 restart event-backend

# Update MongoDB URI (if changing)
sudo nano backend/.env
pm2 restart event-backend

# Check Nginx status
sudo systemctl status nginx

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Free tier storage check
df -h
```

---

## Troubleshooting

### "Cannot connect to backend"
- ✓ Check security group allows port 4000
- ✓ Verify PM2 is running: `pm2 list`
- ✓ Check backend logs: `pm2 logs event-backend`
- ✓ Verify MongoDB connection: `MONGODB_URI` in `.env`

### "Frontend not loading"
- ✓ Check Nginx status: `sudo systemctl status nginx`
- ✓ Verify build exists: `ls frontend/dist/`
- ✓ Check Nginx config: `sudo nginx -t`

### "AI features not working"
- ✓ Verify `GEMINI_API_KEY` in `backend/.env`
- ✓ Check PM2 logs: `pm2 logs event-backend`
- ✓ Test API: `curl http://YOUR_PUBLIC_IP:4000`

### "MongoDB connection fails"
- ✓ Verify connection string in `.env`
- ✓ Check MongoDB Atlas IP whitelist
- ✓ Add `0.0.0.0/0` for testing (restrict later)

---

## Cost Estimate (AWS Free Tier)

- **EC2 (t3.micro):** Free for 12 months
- **Data transfer:** ~15 GB/month free
- **MongoDB Atlas:** Free tier available
- **Total:** ~$0/month (within free tier limits)

---

## Next Steps

1. Add custom domain (Route 53)
2. Setup CloudFront CDN for faster delivery
3. Add RDS for backup database
4. Setup CloudWatch alarms
5. Add SSL certificate for HTTPS
