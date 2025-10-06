# Backend Deployment Fix Guide

## Issue
The backend is crashing with npm error: `npm error signal SIGTERM` and `npm error command failed`.

## Root Cause
Missing or incorrect environment variables in the deployment platform (Render.com).

## Solution

### 1. Required Environment Variables
Set these environment variables in your Render.com dashboard:

```bash
# Appwrite Configuration (REQUIRED)
APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=68ab553b003351139481
APPWRITE_API_KEY=your_appwrite_api_key_here
APPWRITE_BUCKET_ID=68e12c7d000533b0403d

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=*

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=200
```

### 2. How to Set Environment Variables in Render.com

1. Go to your Render.com dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add each environment variable:
   - Key: `APPWRITE_ENDPOINT`
   - Value: `https://fra.cloud.appwrite.io/v1`
   - Click "Add"

5. Repeat for all required variables

### 3. Critical Variables to Set

**APPWRITE_API_KEY** - This is the most critical one. Get it from:
1. Go to your Appwrite console
2. Go to Settings > API Keys
3. Create a new API key with these permissions:
   - Storage: Read, Write, Delete
   - Database: Read, Write, Delete
4. Copy the API key and set it as `APPWRITE_API_KEY`

### 4. Test the Fix

After setting the environment variables:

1. **Redeploy** your service in Render.com
2. **Wait** for the deployment to complete
3. **Test** the health endpoint: `https://r2-backend-1k7p.onrender.com/health`

### 5. Expected Results

If the fix works, you should see:
```json
{
  "status": "OK",
  "timestamp": "2025-10-06T19:40:00.000Z",
  "service": "Appwrite Storage Service",
  "version": "2.0.0"
}
```

### 6. Troubleshooting

If it still fails:

1. **Check logs** in Render.com dashboard
2. **Verify** all environment variables are set correctly
3. **Test locally** by running `node test-server.js`
4. **Check** Appwrite API key permissions

### 7. Local Testing

Run this command to test locally:
```bash
cd r2-backend
node test-server.js
```

This will check if all modules can be imported and environment variables are set.

## Quick Fix Commands

```bash
# Test server startup locally
cd r2-backend
node test-server.js

# If local test passes, the issue is environment variables in deployment
# Set the environment variables in Render.com dashboard
# Redeploy the service
```

## Contact

If you need help with the Appwrite API key setup, check the Appwrite documentation or contact support.
