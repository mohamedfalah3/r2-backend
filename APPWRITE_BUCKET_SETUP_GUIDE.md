# 🪣 Appwrite Storage Bucket Setup Guide

## 🚨 **Issue Found:**
The Appwrite Storage bucket with ID "storage" could not be found. You need to create this bucket in your Appwrite project.

## 📋 **Steps to Fix:**

### **1. Go to Appwrite Console**
1. Open your Appwrite project dashboard
2. Navigate to **Storage** section
3. Click **"Create Bucket"**

### **2. Create the Bucket**
- **Bucket ID:** `storage`
- **Name:** `Storage` (or any descriptive name)
- **File Size Limit:** `100 MB` (or your preferred limit)
- **Allowed File Extensions:** 
  - Images: `jpg`, `jpeg`, `png`, `gif`, `webp`
  - Audio: `mp3`, `m4a`, `aac`, `wav`, `ogg`
  - Documents: `pdf`, `txt`, `doc`, `docx`
- **Encryption:** Enable (recommended)
- **Antivirus:** Enable (recommended)

### **3. Set Permissions**
- **Create:** `users` (allow authenticated users to upload)
- **Read:** `any` (allow public access to files)
- **Update:** `users` (allow authenticated users to update)
- **Delete:** `users` (allow authenticated users to delete)

### **4. Alternative: Use Existing Bucket**
If you already have a bucket, update the environment variable:
```bash
APPWRITE_BUCKET_ID=your-existing-bucket-id
```

## 🧪 **Test After Setup:**

### **Test Connection:**
```bash
curl -X GET "https://r2-backend-1k7p.onrender.com/appwrite/test"
```

### **Expected Response:**
```json
{
  "success": true,
  "message": "Appwrite Storage connection successful"
}
```

## 🔧 **Environment Variables Check:**

Make sure these are set in your Render deployment:
- `APPWRITE_ENDPOINT` - Your Appwrite endpoint
- `APPWRITE_PROJECT_ID` - Your project ID
- `APPWRITE_API_KEY` - Your API key
- `APPWRITE_BUCKET_ID` - Your bucket ID (should be "storage")

## 📱 **Frontend Test:**

After creating the bucket, test uploading a file:
1. Open your React Native app
2. Try uploading a book
3. Check if files are uploaded to Appwrite Storage

## 🎯 **Quick Fix:**

1. **Create bucket in Appwrite Console**
2. **Set bucket ID to "storage"**
3. **Test the connection**
4. **Try uploading a file**

---

**The bucket "storage" needs to be created in your Appwrite project for the storage to work!** 🪣
