# 🚀 Quick Start Deployment Guide

## 5-Minute Setup for Vercel

### Step 1: Set Up Database (2 min)
Choose one option:

**Option A - Cloud (Recommended)**
- Go to [Supabase.com](https://supabase.com) (free, 500MB)
- Create new project
- Run SQL from DEPLOYMENT.md to create tables
- Copy connection string

**Option B - Local PostgreSQL**
```bash
createdb stock_ease
# Run SQL creation script from DEPLOYMENT.md
```

### Step 2: Deploy to Vercel (3 min)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

When prompted, add these environment variables:
- `DATABASE_URL` = your PostgreSQL connection string
- `JWT_SECRET` = random string (copy from DEPLOYMENT.md security section)

### Done! 🎉
Your app is live at: `https://your-project-name.vercel.app`

---

## What's Configured for Vercel

✅ **Backend API Functions** (`/api` folder)
- `/api/auth.js` - Signup, login
- `/api/products.js` - Product CRUD

✅ **Static Frontend** (HTML, CSS, JS files)
- Auto-deployed to Vercel's CDN

✅ **Environment Variables**
- DATABASE_URL, JWT_SECRET

✅ **CORS Headers**
- Frontend can call API endpoints

✅ **Dynamic API URLs**
- Local dev: `http://localhost:3000/api`
- Production: `/api` (same domain)

---

## File Structure
```
root/
├── api/               ← Vercel Functions (Backend)
│   ├── auth.js
│   └── products.js
├── public/            ← Static Files (Frontend)
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── inventory.html
│   ├── api.js
│   ├── script.js
│   └── style.css
├── package.json
├── vercel.json        ← Vercel config (routing, env)
└── .env.local         ← Local dev secrets
```

---

## Troubleshooting

**"Failed to fetch" error**
- Check DATABASE_URL in Vercel dashboard
- Verify database tables exist
- Check API logs in Vercel dashboard

**CORS errors**
- Already configured in vercel.json
- Clear browser cache and retry

**Login not working**
- JWT_SECRET must be set in Vercel
- Token is stored in localStorage

---

## Next Steps

1. Deploy to Vercel using instructions above
2. Test at `https://your-url.vercel.app`
3. Try signup/login
4. Try creating products
5. Share your live app!

---

## Additional Resources

- Full setup: See `DEPLOYMENT.md`
- Vercel docs: https://vercel.com/docs
- PostgreSQL: Choose Supabase or Railway for easy setup