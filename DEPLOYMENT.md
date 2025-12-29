# Company Blacklist System - Railway Deployment Guide

## 🚀 Deployment მზადაა!

### GitHub Repository
✅ https://github.com/gog1l-4/company-blacklist-system

---

## 📤 Step 1: Push to GitHub

```bash
cd c:\companyblacklistV3
git add .
git commit -m "feat: Initial commit - Company Blacklist MVP with duplicate detection"
git branch -M main
git remote add origin https://github.com/gog1l-4/company-blacklist-system.git
git push -u origin main
```

---

## 🚂 Step 2: Deploy Backend on Railway

### 2.1 Create Railway Project
1. Go to **https://railway.app**
2. Sign in with GitHub
3. Click **"New Project"**
4. Select **"Deploy from GitHub repo"**
5. Choose **`gog1l-4/company-blacklist-system`**

### 2.2 Configure Backend Service
**Service Settings:**
- **Name:** `blacklist-backend`
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

### 2.3 Set Environment Variables
Click **"Variables"** tab and add:

```
PORT=3001
NODE_ENV=production
JWT_SECRET=<paste-generated-key-below>
JWT_EXPIRATION=7d
DATABASE_PATH=./database.sqlite
FRONTEND_URL=https://placeholder-will-update-later.railway.app
```

**Generate JWT Secret (run in terminal):**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Deploy
- Click **"Deploy"**
- Wait for build (2-3 minutes)
- Copy backend URL (e.g., `https://blacklist-backend-xxx.up.railway.app`)

---

## 🎨 Step 3: Deploy Frontend on Railway

### 3.1 Add Frontend Service
In same Railway project:
1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select **`gog1l-4/company-blacklist-system`** again

### 3.2 Configure Frontend Service
**Service Settings:**
- **Name:** `blacklist-frontend`
- **Root Directory:** `frontend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npx serve -s build -l $PORT`

### 3.3 Set Environment Variables
```
REACT_APP_API_URL=<backend-url>/api
```
**Example:**
```
REACT_APP_API_URL=https://blacklist-backend-xxx.up.railway.app/api
```

### 3.4 Deploy
- Click **"Deploy"**
- Wait for build (3-4 minutes)
- Copy frontend URL (e.g., `https://blacklist-frontend-xxx.up.railway.app`)

---

## 🔄 Step 4: Update CORS

### 4.1 Update Backend Environment
1. Go to backend service in Railway
2. Click **"Variables"**
3. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=<frontend-railway-url>
   ```
4. Click **"Redeploy"**

---

## ✅ Step 5: Verify Deployment

### Test Checklist
- [ ] Visit frontend URL - loads successfully
- [ ] Register new user
- [ ] Login (or wait for admin approval)
- [ ] Add company with file upload
- [ ] Search functionality works
- [ ] Admin panel accessible

### Default Admin Credentials
```
Tax ID: 000000000
Password: admin123
```
⚠️ **IMPORTANT:** Change admin password immediately after first login!

---

## �️ Database & Storage Notes

### SQLite Database
- ✅ Automatically persists on Railway
- ✅ Survives deployments
- ✅ No additional configuration needed

### File Uploads
- ✅ Stored in Railway volume
- ✅ Persists between deployments
- Path: `backend/uploads/`

---

## 💰 Cost Estimate

**Railway Free Tier:**
- $5 credit/month (trial)
- ~500 hours runtime
- Enough for MVP testing

**After trial:**
- ~$5-10/month for both services
- PostgreSQL migration: +$5/month (optional)

---

## 🔧 Post-Deployment Tasks

### Security
- [ ] Change default admin password
- [ ] Update JWT_SECRET to strong random key
- [ ] Review CORS settings

### Optional Enhancements
- [ ] Add custom domain
- [ ] Setup email notifications
- [ ] Migrate to PostgreSQL
- [ ] Add error tracking (Sentry)
- [ ] Setup monitoring

---

## 🐛 Troubleshooting

### Backend won't start
- Check logs in Railway dashboard
- Verify all environment variables set
- Ensure build completed successfully

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS configuration in backend
- Ensure backend is running

### Database not persisting
- Railway automatically handles SQLite persistence
- Check Railway volumes in dashboard

### File uploads failing
- Ensure backend has write permissions
- Check Railway volume configuration
- Verify MAX_FILE_SIZE setting

---

## 📚 Useful Links

- **GitHub Repo:** https://github.com/gog1l-4/company-blacklist-system
- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app

---

## 🎉 Success!

თქვენი Company Blacklist System ახლა live-ია Railway-ზე!

**Next Steps:**
1. Test all features thoroughly
2. Invite beta users
3. Gather feedback
4. Iterate and improve
