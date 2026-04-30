# AWS EC2 - Custom Domain & HTTPS Setup

Guide to add a custom domain and SSL certificate (HTTPS) to your Event Management Board.

---

## 🌐 Step 1: Register Domain

### Option A: AWS Route 53 (Integrated)

1. **Go to AWS Route 53 console**
2. Click **"Domains"** → **"Register domains"**
3. Search for your domain
4. Add to cart and proceed to checkout
5. Enter registrant details
6. Domain will be registered (takes 24-48 hours)

**Cost:** ~$12/year (varies by TLD)

### Option B: External Registrar

Popular registrars:
- GoDaddy (godaddy.com)
- Namecheap (namecheap.com)
- Google Domains (domains.google.com)
- Bluehost (bluehost.com)

1. Register domain with your chosen registrar
2. Get nameservers (if using Route 53)

---

## 🔗 Step 2: Point Domain to EC2

### Using AWS Route 53

1. **In Route 53 console:**
   - Click **"Hosted zones"**
   - Your domain will auto-appear after registration

2. **Create record:**
   - Click **"Create record"**
   - Record name: Leave blank (for root) or enter subdomain
   - Record type: **A**
   - Value: **Your EC2 Public IP**
   - TTL: 300
   - Click **"Create records"**

3. **For www subdomain (optional):**
   - Create another record
   - Name: **www**
   - Type: **CNAME**
   - Value: **your-domain.com**

### Using External Registrar

1. Login to your registrar account
2. Go to DNS settings
3. Create **A record:**
   - Hostname: @ (or blank)
   - Type: A
   - Value: Your EC2 public IP
   - TTL: 3600

4. Create **CNAME record (optional):**
   - Hostname: www
   - Type: CNAME
   - Value: your-domain.com

5. Save changes (takes 15 minutes to several hours to propagate)

**Test DNS propagation:** [whatsmydns.net](https://whatsmydns.net)

---

## 🔐 Step 3: Install SSL Certificate

### Option A: Let's Encrypt (Free, Recommended)

On your EC2 instance:

```bash
# Install Certbot
sudo yum install -y certbot python3-certbot-nginx

# Get certificate (replace with your domain)
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# Enter email address
# Agree to terms
# Choose how to authenticate (standalone is fine)

# Certificate saved to: /etc/letsencrypt/live/your-domain.com/
```

### Option B: AWS Certificate Manager

1. **Go to AWS Certificate Manager console**
2. Click **"Request certificate"**
3. Enter domain: your-domain.com
4. Add: www.your-domain.com
5. Select validation method: **DNS**
6. Validate ownership following prompts
7. Certificate will appear in ~15 minutes

---

## 🔧 Step 4: Update Nginx Configuration

Edit Nginx config:

```bash
sudo nano /etc/nginx/sites-available/event-board
```

Replace with:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name your-domain.com www.your-domain.com;
    
    return 301 https://$server_name$request_uri;
}

# HTTPS Server
server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name your-domain.com www.your-domain.com;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # SSL Configuration (Optional but recommended)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

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
```

Test and restart:

```bash
# Test configuration
sudo nginx -t

# If successful, restart Nginx
sudo systemctl restart nginx
```

---

## 🔄 Step 5: Enable Auto-Renewal

For Let's Encrypt certificates (expire every 90 days):

```bash
# Enable certbot auto-renewal timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run

# View renewal log
sudo tail -f /var/log/letsencrypt/renewal.log
```

---

## 🧪 Step 6: Test HTTPS

```bash
# Test SSL
curl https://your-domain.com

# Check certificate details
openssl s_client -connect your-domain.com:443

# or use online tool:
# https://www.sslchecker.com/
# https://www.ssllabs.com/ssltest/ (requires A grade)
```

---

## 🎯 Step 7: Update Environment Variables

Update frontend environment to use HTTPS:

```bash
# On EC2 instance
sudo nano frontend/.env.production
```

Change to:
```env
VITE_API_URL=https://your-domain.com
```

Rebuild frontend:
```bash
cd ~/apps/Event-Management-board/frontend
npm run build
cd ..
```

Restart Nginx:
```bash
sudo systemctl restart nginx
```

---

## 🔒 Security Headers (Optional)

Add security headers to Nginx config:

```nginx
# In server block, add:
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

---

## 📱 Verify Setup

1. **Visit your domain:**
   ```
   https://your-domain.com
   ```

2. **Check SSL certificate:**
   - Look for green padlock in browser
   - Click padlock → "Certificate" to view details

3. **Test functionality:**
   - Create an event
   - Test AI features
   - Check console for errors

4. **SSL report:**
   - Go to https://www.ssllabs.com/ssltest/
   - Enter your domain
   - Should get A or A+ rating

---

## 🆘 SSL Troubleshooting

### "ERR_CERT_AUTHORITY_INVALID"
- Wait for DNS propagation (~15 min)
- Certbot may need to verify domain ownership
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

### "Mixed content" warning
- Ensure all API calls use HTTPS
- Update `VITE_API_URL` in frontend/.env.production
- Rebuild frontend: `npm run build`

### Certificate not found error
- Verify certificate path exists:
  ```bash
  ls /etc/letsencrypt/live/your-domain.com/
  ```
- Check file permissions:
  ```bash
  sudo ls -la /etc/letsencrypt/live/your-domain.com/
  ```

### "Connection refused" on HTTPS
- Check if port 443 is open in security group
- Verify Nginx is running: `sudo systemctl status nginx`
- Check Nginx config: `sudo nginx -t`

---

## 🔄 Certificate Renewal

### Manual renewal
```bash
sudo certbot renew

# Force renewal (useful before expiry)
sudo certbot renew --force-renewal
```

### Check expiration date
```bash
sudo certbot certificates

# Check with OpenSSL
openssl x509 -enddate -noout -in /etc/letsencrypt/live/your-domain.com/cert.pem
```

### Setup renewal reminders
```bash
# Add to crontab
crontab -e

# Add line:
0 12 * * * /usr/bin/certbot renew --quiet && /bin/systemctl reload nginx
```

---

## 💡 Additional Domain Options

### www vs non-www
- **www version:** www.your-domain.com → your-domain.com (CNAME)
- **Non-www:** your-domain.com → EC2 IP (A record)
- **Both:** Create records for both, redirect one to other

### Subdomains
```bash
# Create A records for subdomains:
api.your-domain.com     → EC2 IP (if hosting API separately)
admin.your-domain.com   → EC2 IP (if hosting admin panel)
blog.your-domain.com    → External service (if using external blog)
```

### DNS Records Summary

| Name | Type | Value | Purpose |
|------|------|-------|---------|
| @ (blank) | A | EC2 IP | Root domain |
| www | CNAME | your-domain.com | WWW subdomain |
| * | A | EC2 IP | Wildcard (all subdomains) |

---

## 📚 Next Steps

1. ✅ Register domain
2. ✅ Point to EC2 IP
3. ✅ Install SSL certificate
4. ✅ Update Nginx config
5. ✅ Test HTTPS access
6. ✅ Monitor certificate expiration
7. Setup email (optional)
8. Setup backups (optional)

---

## 📞 Need Help?

**DNS not working?**
- Wait 24-48 hours for propagation
- Check nameservers in Route 53
- Use `nslookup your-domain.com` to test

**SSL certificate issues?**
- Check domain ownership verification
- View Certbot logs: `sudo tail -f /var/log/letsencrypt/letsencrypt.log`
- Verify Nginx config: `sudo nginx -t`

**HTTPS not working?**
- Ensure port 443 is open in security group
- Check certificate was installed correctly
- Verify correct certificate paths in Nginx config
