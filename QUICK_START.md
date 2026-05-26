# 🚀 Stock Ease Backend Setup - Quick Start

## Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running
- A code editor

---

## STEP 1: Set Up PostgreSQL Database

### Windows/Mac/Linux:
1. Open PostgreSQL command line or pgAdmin
2. Copy and paste the SQL below:

```sql
-- Create database
CREATE DATABASE stock_ease;

-- Connect to the database
\c stock_ease

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    product_id VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL,
    quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_users_email ON users(email);
```

---

## STEP 2: Create Backend Folder Structure

In your project root (same level as index.html), create:

```
backend/
├── routes/
│   ├── auth.js
│   └── products.js
├── middleware/
│   └── auth.js
├── package.json
├── .env
└── server.js
```

---

## STEP 3: Copy Backend Files

See the code in **BACKEND_CODE.md** file and copy each file to its location.

Files to create:
1. `backend/server.js`
2. `backend/package.json`
3. `backend/.env`
4. `backend/routes/auth.js`
5. `backend/routes/products.js`
6. `backend/middleware/auth.js`

---

## STEP 4: Install Dependencies

```bash
cd backend
npm install
```

---

## STEP 5: Configure .env

Update `backend/.env` with your database credentials:

```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/stock_ease
JWT_SECRET=your_super_secret_key_change_in_production_12345
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Replace:
- `your_password` - Your PostgreSQL password
- `your_super_secret_key_change_in_production_12345` - A random long string (use a password generator)

---

## STEP 6: Start the Backend

```bash
npm run dev
```

You should see:
```
✅ Connected to PostgreSQL
🚀 Server running on http://localhost:5000
```

---

## STEP 7: Test the Backend

Open Postman or use curl to test:

### Test Signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phone": "712345678",
    "password": "SecurePass123!"
  }'
```

Should return:
```json
{
  "message": "Signup successful",
  "user": {
    "id": 1,
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

---

## STEP 8: Test Frontend

1. Open `http://localhost:3000` (or wherever your frontend is)
2. Try signing up with a new account
3. Login with your credentials
4. Go to inventory and add products
5. All data should persist in PostgreSQL!

---

## Deployment

### Deploy Backend to Render.com (Free)

1. Push your backend code to GitHub
2. Go to https://render.com
3. Click "New +" → "Web Service"
4. Connect your GitHub repo
5. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
6. Add Environment Variables from your .env
7. Deploy!

### Deploy Frontend to Vercel

1. Your frontend files are already here (index.html, style.css, script.js, etc.)
2. Go to https://vercel.com
3. Import your repository
4. Update `API_URL` in `api.js` to your Render backend URL
5. Deploy!

---

## Common Issues

### "Cannot find module 'express'"
- Run: `npm install`

### "Database connection error"
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Make sure database is created

### "Invalid token"
- Make sure you're sending the token in the header
- Token format: `Authorization: Bearer <token>`

### "Email already exists"
- That email is already registered
- Use a different email

---

## API Endpoints Reference

All requests (except signup/login) need:
```
Header: Authorization: Bearer <token>
```

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login | Login user |
| POST | /api/products | Create product |
| GET | /api/products | Get all user's products |
| PUT | /api/products/:id | Update product quantity |
| DELETE | /api/products/:id | Delete product |

---

## Next Steps

1. ✅ Database setup
2. ✅ Backend files created
3. ✅ Frontend connected to API
4. ⬜ Deploy to production
5. ⬜ Add more features (reports, analytics, etc.)

**Need help?** Check error messages in browser console (F12) and backend terminal.

Happy coding! 🎉
