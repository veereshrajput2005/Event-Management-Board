# AWS EC2 Deployment Quick Start

**TL;DR** - Deploy Event Management Board to AWS EC2 in 30 minutes

---

## ⚡ Quick Deployment Steps

### Prerequisites
- ✓ AWS Account with EC2 access
- ✓ t3.micro instance (free tier) running Amazon Linux 2
- ✓ GitHub repository with the code
- ✓ Google Gemini API key
- ✓ MongoDB Atlas account

---

## 🔑 Step 1: Create Admin Key Pair (5 min)

**In AWS Console:**
1. EC2 Dashboard → Key Pairs → Create Key Pair
2. Name: `event-board-key`
3. Type: RSA, Format: PEM (Mac/Linux) or PPK (Windows)
4. Download and save securely

---

## 🔒 Step 2: Create Security Group (3 min)

**In AWS Console:**
1. EC2 Dashboard → Security Groups → Create
2. Name: `event-board-sg`
3. Add inbound rules:
   - SSH (22): 0.0.0.0/0 (lock to your IP for security)
   - HTTP (80): 0.0.0.0/0
   - HTTPS (443): 0.0.0.0/0
   - TCP (4000): 0.0.0.0/0

---

## 🚀 Step 3: Launch EC2 Instance (5 min)

**In AWS Console:**
1. Launch Instances
2. Name: `event-management-board`
3. AMI: Amazon Linux 2
4. Instance type: t3.micro
5. Key pair: event-board-key
6. Security group: event-board-sg
7. Storage: 20 GB gp3
8. **Launch** → Wait for running status
9. Copy Public IPv4 address

---

## 💻 Step 4: SSH to Instance (2 min)

**From your terminal:**

**Windows (PowerShell):**
```powershell
cd C:\path\to\key
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP
```

**Mac/Linux:**
```bash
chmod 600 event-board-key.pem
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP
```

---

## 🛠️ Step 5: Automated Setup (5 min)

**On EC2 instance:**

```bash
# Clone repo  
mkdir ~/apps && cd ~/apps
git clone https://github.com/YOUR_USERNAME/Event-Management-board.git
cd Event-Management-board

# Run deployment script
chmod +x deploy.sh
./deploy.sh
```

Script automatically installs:
- Node.js & npm
- Nginx (reverse proxy)
- PM2 (process manager)
- All dependencies
- Frontend production build
- Backend with PM2

---

## 🗄️ Step 6: Setup MongoDB Atlas (3 min)

**In MongoDB Atlas:**

1. Create cluster (M0 free tier)
2. Create database user (username: `eventboard`)
3. Add IP whitelist: `0.0.0.0/0` (for testing)
4. Get connection string

**Copy string like:**
```
mongodb+srv://eventboard:PASSWORD@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
```

---

## 🔑 Step 7: Update Backend Credentials (2 min)

**On EC2 instance:**

```bash
sudo nano backend/.env
```

Update:
```env
PORT=4000
MONGODB_URI=mongodb+srv://eventboard:PASSWORD@cluster0.mongodb.net/eventdb?retryWrites=true&w=majority
GEMINI_API_KEY=your_api_key_here
NODE_ENV=production
```

Save: `Ctrl+X` → `Y` → `Enter`

Restart:
```bash
pm2 restart event-backend
```

---

## ✅ Step 8: Verify Deployment (2 min)

**Check services running:**
```bash
pm2 list
pm2 logs event-backend
```

**Visit your app:**
```
http://YOUR_PUBLIC_IP
```

**Test backend:**
```
http://YOUR_PUBLIC_IP:4000
```

---

## 📝 Common Commands

```bash
# SSH connection
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP

# View services status
pm2 list
pm2 status

# View logs
pm2 logs event-backend
sudo tail -f /var/log/nginx/error.log

# Restart services
pm2 restart event-backend
sudo systemctl restart nginx

# Update code
cd ~/apps/Event-Management-board
git pull origin main
cd frontend && npm run build && cd ..
pm2 restart event-backend

# Stop/start backend
pm2 stop event-backend
pm2 start event-backend
```

---

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't SSH to instance | Check security group allows port 22 from your IP |
| Backend not accessible | Check security group opens port 4000 |
| "Cannot reach MongoDB" | Verify MONGODB_URI and IP whitelist in Atlas |
| "AI features not working" | Check GEMINI_API_KEY in backend/.env |
| Frontend shows "Cannot reach backend" | Restart backend: `pm2 restart event-backend` |
| Page blank/white screen | Check Nginx logs: `sudo tail -f /var/log/nginx/error.log` |

---

## 💰 Cost

- **t3.micro:** Free for 12 months (AWS free tier)
- **Data transfer:** ~15GB/month free
- **MongoDB Atlas M0:** Free
- **Total:** $0/month (within free tier)

---

## 🎯 Next Steps

After successful deployment:
1. Add custom domain (Route 53)
2. Setup SSL certificate (Let's Encrypt)
3. Configure CloudFront CDN
4. Enable CloudWatch monitoring
5. Setup auto-scaling

---

## 📚 Full Guides

- **AWS_EC2_DEPLOYMENT.md** - Detailed step-by-step guide
- **MONGODB_ATLAS_SETUP.md** - Database configuration guide
- **deploy.sh** - Automated setup script
