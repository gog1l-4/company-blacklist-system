# Railway Deployment - Quick Fix Guide

## ✅ შექმნილია Railway config ფაილები!

### Created Files:
1. `backend/railway.json` - Railway service config
2. `frontend/railway.json` - Railway service config
3. `backend/nixpacks.toml` - Build config
4. `frontend/nixpacks.toml` - Build config

---

## 🚀 Railway Deployment - Step by Step

### Step 1: Push კონფიგურაცია GitHub-ზე (გასაკეთებელია)
```bash
git add .
git commit -m "feat: Add Railway configuration files"
git push
```

### Step 2: Railway-ზე Backend Service შექმნა

1. **Go to Railway.app** → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. **Select:** `gog1l-4/company-blacklist-system`

#### Backend Configuration:
- **Service Name:** `blacklist-backend`
- **Root Directory:** `backend` (‼️ მნიშვნელოვანია!)
- Railway ავტომატურად წაიკითხავს `railway.json` და `nixpacks.toml`

#### Environment Variables:
```
PORT=3001
NODE_ENV=production
JWT_SECRET=<generate-with-command-below>
JWT_EXPIRATION=7d
DATABASE_PATH=./database.sqlite
FRONTEND_URL=https://placeholder.railway.app
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Deploy:
- Click **Deploy**
- Wait 2-3 minutes
- **Copy Backend URL** (e.g., `https://blacklist-backend-production.up.railway.app`)

---

### Step 3: Railway-ზე Frontend Service შექმნა

1. **Same Railway Project** → **New Service**
2. **Deploy from GitHub repo** → `gog1l-4/company-blacklist-system`

#### Frontend Configuration:
- **Service Name:** `blacklist-frontend`
- **Root Directory:** `frontend` (‼️ მნიშვნელოვანია!)
- Railway ავტომატურად წაიკითხავს `railway.json` და `nixpacks.toml`

#### Environment Variables:
```
REACT_APP_API_URL=<backend-url>/api
```
**Example:**
```
REACT_APP_API_URL=https://blacklist-backend-production.up.railway.app/api
```

#### Deploy:
- Click **Deploy**
- Wait 3-4 minutes
- **Copy Frontend URL** (e.g., `https://blacklist-frontend-production.up.railway.app`)

---

### Step 4: Update CORS

1. Go to **Backend Service** in Railway
2. **Variables** → Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://blacklist-frontend-production.up.railway.app
   ```
3. **Redeploy** backend

---

## 🔍 Troubleshooting

### Build ისევ ვერ იმუშავებს?

**Railway Dashboard-ში:**
1. Service Settings → **Root Directory**
2. Manually set:
   - Backend: `backend`
   - Frontend: `frontend`
3. Redeploy

### Backend port error?
Railway ავტომატურად აყენებს `$PORT` - არ საჭიროებს hardcoded port-ს

### Database არ ქმნის?
Railway ავტომატურად ქმნის persistent volume SQLite-სთვის

---

## ✅ Success Checklist

- [ ] Railway config files pushed to GitHub
- [ ] Backend service created with root directory `backend`
- [ ] Frontend service created with root directory `frontend`
- [ ] Environment variables configured
- [ ] CORS updated
- [ ] Both services deployed successfully
- [ ] Frontend accessible
- [ ] API working

---

## 📱 Default Admin Login

```
Tax ID: 000000000
Password: admin123
```

**⚠️ Change immediately after first login!**

---

## 🎉 Deploy-ის შემდეგ

1. Open frontend URL
2. Register test user
3. Login as admin → Approve user
4. Test all features
5. Update admin password

---

**GitHub Repo:** https://github.com/gog1l-4/company-blacklist-system
**Railway:** https://railway.app/dashboard
