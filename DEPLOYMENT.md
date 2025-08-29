# R2 Backend Deployment Guide

This guide covers deploying the R2 Signed URL Backend to various cloud platforms.

## 🚀 Quick Deploy Options

### 1. Deploy to Render (Recommended)

**Steps:**
1. Fork this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure the service:
   - **Name**: `r2-backend` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or paid for better performance)

6. Add Environment Variables:
   ```
   R2_ACCESS_KEY=your_r2_access_key
   R2_SECRET_KEY=your_r2_secret_key
   R2_ACCOUNT_ID=your_cloudflare_account_id
   R2_BUCKET=your_bucket_name
   NODE_ENV=production
   PORT=10000
   ```

7. Click "Create Web Service"
8. Your service will be available at: `https://r2-backend-1k7p.onrender.com`

### 2. Deploy to Railway

**Steps:**
1. Fork this repository
2. Go to [Railway Dashboard](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your forked repository
5. Add Environment Variables in the Railway dashboard
6. Deploy automatically

### 3. Deploy to Vercel

**Steps:**
1. Fork this repository
2. Go to [Vercel Dashboard](https://vercel.com/)
3. Click "New Project" → "Import Git Repository"
4. Select your repository
5. Configure:
   - **Framework Preset**: Node.js
   - **Build Command**: `npm install`
   - **Output Directory**: `.`
6. Add Environment Variables
7. Deploy

### 4. Deploy to Heroku

**Steps:**
1. Install Heroku CLI
2. Fork this repository
3. Clone locally:
   ```bash
   git clone https://github.com/yourusername/r2-backend.git
   cd r2-backend
   ```
4. Create Heroku app:
   ```bash
   heroku create your-app-name
   ```
5. Add environment variables:
   ```bash
   heroku config:set R2_ACCESS_KEY=your_key
   heroku config:set R2_SECRET_KEY=your_secret
   heroku config:set R2_ACCOUNT_ID=your_account_id
   heroku config:set R2_BUCKET=your_bucket
   heroku config:set NODE_ENV=production
   ```
6. Deploy:
   ```bash
   git push heroku main
   ```

## 🔧 Environment Variables

### Required Variables

```env
# Cloudflare R2 Configuration
R2_ACCESS_KEY=your_r2_access_key_here
R2_SECRET_KEY=your_r2_secret_key_here
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_BUCKET=your_bucket_name

# Server Configuration
PORT=3000
NODE_ENV=production
```

### Optional Variables

```env
# CORS Configuration
CORS_ORIGIN=*

# Cache Configuration
CACHE_TTL_SECONDS=3600
SIGNED_URL_EXPIRY_SECONDS=7200
MAX_CACHE_KEYS=5000

# Redis (for production caching)
REDIS_URL=redis://your-redis-url

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📋 Prerequisites

### 1. Cloudflare R2 Setup

1. **Create R2 Bucket:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **R2 Object Storage**
   - Click "Create bucket"
   - Choose a unique name

2. **Get API Credentials:**
   - Go to **Manage R2 API tokens**
   - Click "Create API token"
   - Select **Custom token**
   - Set permissions:
     - **Object Read & Write**
     - **Bucket**: Your specific bucket
   - Copy the Access Key ID and Secret Access Key

3. **Get Account ID:**
   - Found in the right sidebar of your Cloudflare dashboard

### 2. GitHub Repository

1. **Fork this repository** to your GitHub account
2. **Update package.json** with your repository URL
3. **Commit and push** your changes

## 🔒 Security Considerations

### Production Checklist

- [ ] Use HTTPS only
- [ ] Set proper CORS origins (not `*` in production)
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Use Redis for caching (optional but recommended)

### CORS Configuration

For production, replace `CORS_ORIGIN=*` with your specific domains:

```env
CORS_ORIGIN=https://your-app.com,https://your-mobile-app.com
```

## 📊 Monitoring & Health Checks

### Health Check Endpoint

Monitor your service:
```bash
curl https://r2-backend-1k7p.onrender.com/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "R2 Signed URL Service",
  "version": "1.0.0"
}
```

### Cache Statistics

Check cache performance:
```bash
curl https://r2-backend-1k7p.onrender.com/cache-stats
```

## 🐛 Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check R2 credentials
   - Verify bucket permissions
   - Ensure Account ID is correct

2. **CORS Errors**
   - Verify CORS_ORIGIN setting
   - Check if your domain is allowed

3. **File Not Found**
   - Verify bucket name
   - Check file path format
   - Ensure file exists in bucket

4. **Rate Limiting**
   - Check rate limit settings
   - Monitor request frequency

### Debug Mode

Set `NODE_ENV=development` for detailed error messages.

### Logs

Check your hosting platform's logs for detailed error information.

## 🔄 Updates & Maintenance

### Updating the Service

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Update dependencies:**
   ```bash
   npm install
   ```

3. **Test locally:**
   ```bash
   npm run dev
   ```

4. **Deploy to production**

### Backup Strategy

- **Environment Variables**: Store securely (password manager)
- **R2 Data**: Use R2's built-in redundancy
- **Code**: GitHub provides version control

## 📈 Performance Optimization

### Recommended Settings

```env
# For high-traffic applications
CACHE_TTL_SECONDS=7200
MAX_CACHE_KEYS=10000
REDIS_URL=redis://your-redis-url

# For audio streaming
SIGNED_URL_EXPIRY_SECONDS=14400
```

### Scaling Considerations

- **Horizontal Scaling**: Deploy multiple instances behind a load balancer
- **Caching**: Use Redis for shared cache across instances
- **CDN**: Consider using Cloudflare CDN for static assets

## 📞 Support

For issues and questions:
1. Check the [main README.md](./README.md)
2. Review the troubleshooting section
3. Open an issue on GitHub
4. Check the deployment platform's documentation

---

**Happy Deploying! 🚀**
