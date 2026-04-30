# AWS EC2 Deployment Commands Reference

Quick reference for common commands during development and deployment.

---

## 🔐 SSH Connection

```bash
# Connect to EC2 instance
ssh -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP

# With verbose output (troubleshooting)
ssh -v -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP

# SCP - Copy files from local to EC2
scp -i event-board-key.pem /path/to/local/file ec2-user@YOUR_PUBLIC_IP:/home/ec2-user/

# SCP - Copy files from EC2 to local
scp -i event-board-key.pem ec2-user@YOUR_PUBLIC_IP:/home/ec2-user/file /path/to/local/
```

---

## 📦 Backend Management (PM2)

```bash
# List running processes
pm2 list

# View process status
pm2 status

# View real-time monitoring
pm2 monit

# View logs
pm2 logs event-backend

# View logs for specific process (last 100 lines)
pm2 logs event-backend --lines 100

# Clear logs
pm2 flush

# Save snapshot of running processes
pm2 save

# Start process
pm2 start backend/index.js --name "event-backend"

# Stop process
pm2 stop event-backend

# Restart process
pm2 restart event-backend

# Kill process
pm2 kill event-backend

# Delete process from PM2
pm2 delete event-backend

# Startup on system reboot
pm2 startup systemd -u ec2-user --hp /home/ec2-user
pm2 save
```

---

## 🌐 Nginx Management

```bash
# Check Nginx status
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx (graceful reload)
sudo systemctl restart nginx

# Reload Nginx (without stopping connections)
sudo systemctl reload nginx

# Enable auto-start on reboot
sudo systemctl enable nginx

# Test Nginx configuration
sudo nginx -t

# View Nginx error logs
sudo tail -f /var/log/nginx/error.log

# View Nginx access logs
sudo tail -f /var/log/nginx/access.log

# View last 50 error log lines
sudo tail -50 /var/log/nginx/error.log

# View Nginx config
sudo nano /etc/nginx/sites-available/event-board

# Reload Nginx after config changes
sudo nginx -t && sudo systemctl reload nginx
```

---

## 📝 File Editing

```bash
# Edit backend environment variables
sudo nano backend/.env

# Edit Nginx configuration
sudo nano /etc/nginx/sites-available/event-board

# Edit with vi
sudo vi backend/.env

# View file contents
cat backend/.env

# View file with line numbers
cat -n backend/.env

# Search in file
grep "MONGODB_URI" backend/.env

# Edit and preserve backups
sudo cp backend/.env backend/.env.bak
sudo nano backend/.env
```

---

## 📁 File Management

```bash
# List files
ls -la ~/apps/Event-Management-board/

# Change directory
cd ~/apps/Event-Management-board

# Print current directory
pwd

# Create directory
mkdir new-folder

# Remove directory
rm -rf directory-name

# Copy file
cp source-file destination-file

# Move/rename file
mv old-name new-name

# Check file size
du -sh file-name

# Disk usage
df -h

# Directory tree
tree ~/apps/Event-Management-board/
```

---

## 🔄 Git Operations

```bash
# Check git status
git status

# Pull latest code
git pull origin main

# Add all changes
git add .

# Commit changes
git commit -m "Update message"

# Push to repository
git push origin main

# View git history
git log --oneline

# Check current branch
git branch

# Switch branch
git checkout branch-name

# Fetch remote changes
git fetch origin
```

---

## 🏗️ Build & Deploy

```bash
# Navigate to project
cd ~/apps/Event-Management-board

# Build frontend
cd frontend && npm run build && cd ..

# Check build output
ls -la frontend/dist/

# Install dependencies
npm install

# Install specific module
npm install package-name

# Update dependencies
npm update

# Clean installs
rm -rf node_modules package-lock.json
npm install
```

---

## 🧪 Testing & Verification

```bash
# Test connection to backend
curl http://localhost:4000

# Test with EC2 public IP
curl http://YOUR_PUBLIC_IP:4000

# Test MongoDB connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/eventdb"

# Check if ports are open
netstat -tlnp

# Check port 4000
netstat -tlnp | grep 4000

# Test Nginx
curl http://localhost

# Check running processes
ps aux | grep node

# Monitor CPU and memory
top

# View system info
uname -a
```

---

## 🔧 System Management

```bash
# Check disk space
df -h

# Check inode usage
df -i

# List all processes
ps aux

# Kill process by ID
kill -9 PID

# Find process by name
ps aux | grep "node"

# Reboot instance
sudo reboot

# Shutdown instance
sudo shutdown -h now

# Check available memory
free -m

# View system logs
journalctl -u nginx
journalctl -u event-backend

# Update system
sudo yum update -y
sudo yum upgrade -y
```

---

## 🔐 Security

```bash
# Change file permissions
chmod 644 backend/.env
chmod 755 deploy.sh
chmod 600 event-board-key.pem

# Change ownership
sudo chown ec2-user backend/.env

# View file permissions
ls -l backend/.env

# Create SSH key
ssh-keygen -t rsa -b 4096 -f ~/.ssh/event-board

# View public IP
curl http://169.254.169.254/latest/meta-data/public-ipv4

# Check open ports
sudo ss -tlnp
```

---

## 📊 Monitoring & Logs

```bash
# Real-time backend logs
pm2 logs event-backend --lines 50 --stream

# Filter logs
pm2 logs event-backend | grep "error"

# Save logs to file
pm2 logs event-backend > backend-logs.txt

# Tail with follow
tail -f /var/log/nginx/access.log

# Count lines
wc -l /var/log/nginx/access.log

# Search logs
grep "ERROR" /var/log/nginx/error.log

# View last X lines
tail -100 /var/log/nginx/error.log
```

---

## 🚨 Emergency Recovery

```bash
# Restart all services
pm2 restart all
sudo systemctl restart nginx

# Force restart backend
pm2 kill
pm2 start backend/index.js --name "event-backend"

# Clear all PM2 processes
pm2 flush
pm2 kill

# Restart from scratch
pm2 start backend/index.js --name "event-backend"
sudo systemctl restart nginx

# Emergency: Manual kill process
ps aux | grep node
kill -9 PID

# Check database connection
nc -zv YOUR_MONGODB_HOST 27017
```

---

## 💡 Useful Tips

```bash
# Combine commands
cd ~/apps/Event-Management-board && git pull && cd frontend && npm run build && cd ../.. && pm2 restart event-backend

# Execute command without SSH session hanging
ssh -i key.pem user@ip "command" &

# Run command in background
pm2 start "npm run dev" --name "myprocess"

# Redirect output to file
pm2 start index.js >> output.log 2>&1

# Schedule tasks
crontab -e  # Edit cron jobs

# View environment variables
env

# Set temporary environment variable
export MONGODB_URI="..."
```

---

## 📱 Smartphone Configuration

**Access from phone:**
- SSH: Use apps like Termius, JuiceSSH (Android) or Prompt 3 (iOS)
- Web: Direct browser to `http://YOUR_PUBLIC_IP`
- Connect via SSH tunneling for secure access from anywhere

---

## 🆘 Quick Troubleshooting

```bash
# Check if backend is running
pm2 list | grep event-backend

# Restart if not running
pm2 start backend/index.js --name "event-backend"

# Check if Nginx is running
sudo systemctl status nginx

# Restart Nginx if problems
sudo systemctl restart nginx

# View MongoDB connection in logs
pm2 logs event-backend | grep MongoDB

# Check all environment variables
sudo nano backend/.env

# Verify port is listening
netstat -tlnp | grep 4000
```

---

## 📞 Quick Support

**No connection to backend?**
- `pm2 restart event-backend`
- `sudo systemctl restart nginx`
- Check security groups allow port 4000

**Frontend not loading?**
- `sudo systemctl restart nginx`
- `pm2 logs event-backend`
- Check `VITE_API_URL` environment variable

**AI features not working?**
- Check `GEMINI_API_KEY` in `backend/.env`
- `pm2 restart event-backend`
- Check API quota in Google Cloud Console

**Database not connecting?**
- Verify `MONGODB_URI` in `backend/.env`
- Check MongoDB Atlas IP whitelist
- Verify username and password
