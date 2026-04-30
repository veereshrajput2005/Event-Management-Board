# 🚀 Event Management Board - AWS EC2 Deployment Overview

**Complete deployment package for production deployment on AWS EC2**

---

## 📚 Documentation Files Included

### Quick References
1. **AWS_QUICK_START.md** ⭐ **START HERE**
   - 30-minute deployment walkthrough
   - Perfect for first-time deployment
   - Condensed version of detailed guides

2. **EC2_COMMANDS_REFERENCE.md** 📋
   - All common commands you'll need
   - SSH, PM2, Nginx, Git commands
   - Keep this open while working on EC2

### Detailed Guides
3. **AWS_EC2_DEPLOYMENT.md** 📖
   - Complete step-by-step deployment
   - In-depth explanations for each step
   - Troubleshooting section

4. **MONGODB_ATLAS_SETUP.md** 🗄️
   - MongoDB Atlas cloud database setup
   - Connection string configuration
   - Security and optimization

5. **DOMAIN_AND_SSL_SETUP.md** 🔐
   - Custom domain registration
   - SSL/HTTPS certificate setup
   - Nginx configuration for production

### Automation
6. **deploy.sh** 🔧
   - Automated deployment script
   - Installs all dependencies
   - Configures services automatically
   - **Run this on your EC2 instance!**

---

## ⚡ Quick Deployment Path

```
AWS Account Setup
    ↓
EC2 Instance Launch
    ↓
SSH Connection
    ↓
Clone Repository
    ↓
Run deploy.sh Script
    ↓
Setup MongoDB Atlas
    ↓
Configure Environment Variables
    ↓
Test Application
    ↓
(Optional) Add Custom Domain
    ↓
(Optional) Setup SSL Certificate
```

---

## 🎯 What You'll Have After Deployment

✅ **Live Web Application**
- Frontend: React + Vite (production build)
- Backend: Node.js + Express (running with PM2)
- Database: MongoDB Atlas (cloud)
- Web Server: Nginx (reverse proxy)

✅ **Infrastructure**
- AWS EC2 instance (t3.micro - free tier)
- Automatic process management (PM2)
- Reverse proxy setup (Nginx)
- SSL-ready configuration

✅ **Production Ready**
- All dependencies installed
- Database connected
- API authentication ready
- AI features configured
- Monitoring tools included

---

## 📋 Prerequisites Checklist

Before starting deployment, ensure you have:

- [ ] AWS account with EC2 access
- [ ] ~5 GB storage free
- [ ] Google Gemini API key from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- [ ] MongoDB Atlas account from [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- [ ] GitHub repository with your code
- [ ] Terminal/SSH client installed
- [ ] Domain name (optional, for custom domain)

---

## 🚀 Quick Start (30 minutes)

### 1. Follow AWS_QUICK_START.md

This is your fastest path to deployment:
- Launch EC2 instance
- SSH into instance
- Run automated deployment
- Configure credentials
- Test application

### 2. Key Steps Summary

```bash
# Step 1: SSH to instance
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP

# Step 2: Clone and deploy
git clone https://github.com/YOUR_USERNAME/Event-Management-board.git
cd Event-Management-board
chmod +x deploy.sh
./deploy.sh

# Step 3: Configure environment
sudo nano backend/.env
# Add MONGODB_URI and GEMINI_API_KEY

# Step 4: Restart backend
pm2 restart event-backend

# Step 5: Visit your app
# Open browser: http://YOUR_PUBLIC_IP
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────┐
│         Your Domain (HTTPS)             │
│       (Optional - yourdomain.com)       │
└────────────────┬────────────────────────┘
                 │
         ┌───────▼────────┐
         │  AWS Route 53  │
         │  (DNS)         │
         └───────┬────────┘
                 │
    ┌────────────▼────────────┐
    │   AWS EC2 Instance      │
    │  (t3.micro, 20GB SSD)   │
    │  Amazon Linux 2         │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │   Nginx (Port 80/443)   │
    │   Reverse Proxy         │
    └───┬──────────────────┬──┘
        │                  │
    ┌───▼────────┐    ┌───▼──────────┐
    │ React Build│    │ Node.js API  │
    │ (Port 80)  │    │ (Port 4000)  │
    │ Vite Dist  │    │ Express      │
    └────────────┘    │ PM2 Managed  │
                      └───┬──────────┘
                          │
              ┌───────────▼──────────┐
              │  MongoDB Atlas       │
              │  (Cloud Database)    │
              │  Cluster M0          │
              └──────────────────────┘

              And Google Gemini API
              for AI Features
```

---

## 💰 Cost Breakdown

### AWS Free Tier (First 12 months)
- **EC2 t3.micro:** FREE
- **Data transfer:** ~15GB/month FREE
- **Elastic IP:** FREE (with EC2)
- **Total:** ~**$0/month** ✅

### Paid Services (Optional)
- **MongoDB Atlas:** FREE tier (512MB storage)
- **Google Gemini API:** Pay-as-you-go (~$0.00001-0.00003 per request)
- **Custom Domain:** $12-15/year
- **SSL Certificate:** FREE with Let's Encrypt

### Estimated Monthly Cost
**Total: $0 - $5/month** (within free tier limits + minimal API calls)

---

## 🔍 Status Monitoring

### Check if services are running:

```bash
# SSH into instance
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP

# Check backend
pm2 list

# Check Nginx
sudo systemctl status nginx

# Check logs
pm2 logs event-backend

# View frontend
curl http://localhost
```

---

## 🔧 Common Deployments Tasks

### Deploy Code Updates

```bash
cd ~/apps/Event-Management-board

# Pull latest code
git pull origin main

# Rebuild frontend
cd frontend && npm run build && cd ..

# Restart backend
pm2 restart event-backend

# Reload Nginx
sudo systemctl reload nginx
```

### Update Environment Variables

```bash
# Edit credentials
sudo nano backend/.env

# Restart to apply changes
pm2 restart event-backend
```

### View Application Logs

```bash
# Backend logs (real-time)
pm2 logs event-backend

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🧪 Verification Steps

After deployment, verify everything works:

1. **Visit application:**
   ```
   http://YOUR_PUBLIC_IP
   ```

2. **Check backend connectivity:**
   ```
   http://YOUR_PUBLIC_IP:4000
   ```

3. **Test API:**
   ```bash
   curl -X GET http://YOUR_PUBLIC_IP:4000
   ```

4. **Check database:**
   ```bash
   pm2 logs event-backend | grep MongoDB
   # Should see: ✓ Connected to MongoDB
   ```

5. **Test AI features:**
   - Create event in app
   - Click "✨ Generate with AI"
   - Should generate description

---

## 🚨 Troubleshooting Quick Guide

| Issue | Quick Fix |
|-------|-----------|
| Can't SSH | Check security group allows port 22 from your IP |
| Backend not responding | `pm2 restart event-backend` |
| Frontend blank | `sudo systemctl restart nginx` |
| DB connection fails | Check `MONGODB_URI` and IP whitelist |
| AI not working | Verify `GEMINI_API_KEY` in `.env` |
| Port already in use | Check `pm2 list` for duplicate processes |

**For detailed troubleshooting, see AWS_EC2_DEPLOYMENT.md**

---

## 📚 Next Steps for Production

### Immediate (Critical)
1. ✅ Deploy to EC2
2. ✅ Configure environment variables
3. ✅ Test all features
4. ✅ Verify logs look healthy

### Short-term (Recommended)
1. Add custom domain (DOMAIN_AND_SSL_SETUP.md)
2. Setup HTTPS/SSL certificate
3. Configure backups
4. Monitor error logs

### Medium-term (Enhancement)
1. Setup CloudWatch monitoring
2. Configure auto-scaling
3. Add CDN (CloudFront)
4. Setup email notifications

### Long-term (Scaling)
1. Migrate to larger instance
2. Setup load balancing
3. Implement caching
4. Database optimization

---

## 📞 Support & Resources

### Documentation References
- AWS Docs: https://docs.aws.amazon.com/ec2/
- Nginx: https://nginx.org/en/docs/
- MongoDB Atlas: https://docs.atlas.mongodb.com/
- PM2: https://pm2.keymetrics.io/docs/

### Included Guides (In-Depth)
1. **AWS_EC2_DEPLOYMENT.md** - Detailed walkthrough
2. **EC2_COMMANDS_REFERENCE.md** - All commands
3. **MONGODB_ATLAS_SETUP.md** - Database setup
4. **DOMAIN_AND_SSL_SETUP.md** - Domain & HTTPS
5. **AWS_QUICK_START.md** - Quick reference

### Debugging Commands
```bash
# View all running processes
pm2 list

# Show real-time CPU/memory
pm2 monit

# Stream logs (real-time)
pm2 logs event-backend --stream

# Check disk space
df -h

# View system info
uname -a
```

---

## 📖 How to Use These Files

1. **Start with:** AWS_QUICK_START.md
2. **Reference while deploying:** EC2_COMMANDS_REFERENCE.md
3. **For detailed steps:** AWS_EC2_DEPLOYMENT.md
4. **For database:** MONGODB_ATLAS_SETUP.md
5. **For custom domain:** DOMAIN_AND_SSL_SETUP.md
6. **For automation:** deploy.sh

---

## ✅ Deployment Readiness Checklist

Before going live:

- [ ] AWS EC2 instance launched and running
- [ ] SSH access verified
- [ ] Dependencies installed via deploy.sh
- [ ] Backend environment variables configured
- [ ] MongoDB Atlas connection verified
- [ ] Google Gemini API key added
- [ ] Frontend accessible at http://YOUR_PUBLIC_IP
- [ ] Backend responsive at http://YOUR_PUBLIC_IP:4000
- [ ] AI features tested and working
- [ ] Database operations verified
- [ ] Error logs reviewed and clean

---

## 🎯 You're Ready to Deploy!

Everything you need is included in this package. Follow the **AWS_QUICK_START.md** to get your application live in 30 minutes.

**Questions?** Review the relevant guide or check the troubleshooting sections.

**Have database issues?** See MONGODB_ATLAS_SETUP.md

**Need SSL/Domain?** See DOMAIN_AND_SSL_SETUP.md

**Forgot a command?** Check EC2_COMMANDS_REFERENCE.md

---

**Last Updated:** April 30, 2026
**Project:** Event Management Board with AI Features
**Deployment Target:** AWS EC2 (Amazon Linux 2)
