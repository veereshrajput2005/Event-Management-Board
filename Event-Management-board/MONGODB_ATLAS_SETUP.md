# MongoDB Atlas Setup for Event Management Board

Complete guide to set up MongoDB Atlas cloud database for your Event Management Board.

## Step 1: Create MongoDB Atlas Account

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Click **"Try Free"** or **"Sign Up"**
3. Create account with:
   - Email
   - Password
   - Agree to terms
4. Verify your email

## Step 2: Create Cluster

1. Click **"Create"** on the dashboard
2. **Select Plan:**
   - Choose **M0 (Free tier)** 
   - Suitable for development/testing
   - Upgradeable later

3. **Cloud Provider & Region:**
   - Provider: AWS (recommended)
   - Region: Pick closest to your users
     - US East (N. Virginia) if deploying to US EC2
     - EU West (Ireland) if deploying to EU

4. **Cluster Tier:**
   - Keep default settings for free tier
   - Storage: 512 MB (free tier)

5. Click **"Create Deployment"**
6. Wait for cluster to initialize (~5-10 minutes)

## Step 3: Create Database User

1. In MongoDB Atlas, go to **"Security"** → **"Database Access"**

2. Click **"Add New Database User"**

3. **Create Username & Password:**
   - Username: `eventboard` (or your preferred name)
   - Password: Generate strong password or create custom
   - Click **"Generate secure password"** if available
   - **Save this password!**

4. **Database User Privileges:**
   - Select **"Built-in Role"** → **"Atlas admin"**
   - (For production, use custom roles with specific permissions)

5. Click **"Add User"**

## Step 4: Configure Network Access

1. Go to **"Security"** → **"Network Access"**

2. Click **"Add IP Address"**

3. **For development:**
   - Select **"Allow Access from Anywhere"**
   - Click confirm
   - IP: `0.0.0.0/0`
   - ⚠️ Less secure, fine for development/free tier

4. **For production EC2:**
   - Get your EC2 public IP from AWS console
   - Add that specific IP only
   - More secure approach

5. Click **"Confirm"**

## Step 5: Get Connection String

1. Go to **"Deployment"** → **"Database"** (or "Clusters")

2. Click **"Connect"** on your cluster

3. **Choose Connection Method:**
   - Select **"Drivers"** (for Node.js)

4. **Get Connection String:**
   Copy the connection string that looks like:
   ```
   mongodb+srv://eventboard:PASSWORD@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
   ```

5. **Replace placeholders:**
   - `eventboard` → Your database username
   - `PASSWORD` → Your database password
   - `cluster` → Your actual cluster name
   - `eventdb` → Database name (can be anything)

## Step 6: Add to Backend Environment

1. On your EC2 instance, edit backend/.env:
   ```bash
   sudo nano backend/.env
   ```

2. Add or update:
   ```env
   MONGODB_URI=mongodb+srv://eventboard:YOUR_PASSWORD@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
   ```

3. Save (Ctrl+X, Y, Enter)

4. Restart backend:
   ```bash
   pm2 restart event-backend
   ```

## Step 7: Test Connection

1. Check PM2 logs:
   ```bash
   pm2 logs event-backend
   ```

2. Look for:
   ```
   ✓ Connected to MongoDB
   ```

3. If error:
   - Check password contains special characters `@` → should be URL encoded as `%40`
   - Verify network access whitelist allows your IP
   - Check database name and username are correct
   - Test connection locally first: `node backend/index.js`

## MongoDB Atlas Features

### View Data
1. Go to **"Database"** → Click **"Connect"** → **"Data Access"**
2. Or use MongoDB Compass (GUI tool)
3. Download Compass: [mongodb.com/products/compass](https://mongodb.com/products/compass)
4. Paste connection string into Compass to view/manage data

### Backup & Restore
1. Go to **"Backup"** tab
2. Automatic daily backups included (free tier)
3. Manual snapshots available

### Monitoring
1. Go to **"Monitoring"**
2. View:
   - Database performance
   - Network activity
   - Storage usage

### Upgrade Cluster
1. Go to **"Database"** → **"Modify"**
2. Change tier (M0 → M1, M2, etc.)
3. Upgrades are seamless, no downtime

## Troubleshooting

### "Authentication failed"
- ✓ Check username/password in connection string
- ✓ Verify special characters are URL encoded
- ✓ Make sure database user exists

### "Connection timeout"
- ✓ Check network access whitelist includes your EC2 IP
- ✓ Add `0.0.0.0/0` temporarily for testing
- ✓ Test connection string in Compass first

### "No database selected"
- ✓ Connection string should have `/eventdb` at the end
- ✓ Database will autocreate if it doesn't exist

### "Connection refused"
- ✓ Cluster must be active (check status in Atlas)
- ✓ Wait for cluster initialization to complete
- ✓ Restart backend after adding credentials

## Connection String Formats

**With specific database:**
```
mongodb+srv://username:password@cluster.mongodb.net/eventdb?retryWrites=true&w=majority
```

**Without specific database (auto-select):**
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

**Local development (localhost):**
```
mongodb://localhost:27017/eventdb
```

## Security Best Practices

1. **Never commit credentials** to Git
2. **Use `.env` files** (not in version control)
3. **Rotate passwords** periodically
4. **Use specific IPs** for network access (production)
5. **Create separate users** for different environments
6. **Enable encryption at rest** (paid tier)
7. **Use VPC peering** for production (outbound connections)

## Free Tier Limits

- **Storage:** 512 MB
- **Connections:** 3 simultaneous
- **Backup:** Daily (7 days retention)
- **Data transfer:** Varies by region

## Upgrade Path

| Plan | Storage | Cost | Best For |
|------|---------|------|----------|
| M0 | 512 MB | Free | Development |
| M1 | 10 GB | $57/month | Small production |
| M2 | 50 GB | $114/month | Growing production |
| M3+ | 200+ GB | Varies | Large scale |

---

**Next Steps:**
1. Create MongoDB Atlas cluster
2. Add database user
3. Configure IP whitelist (0.0.0.0/0 for testing)
4. Get connection string
5. Add to `backend/.env` on EC2
6. Restart backend and test
