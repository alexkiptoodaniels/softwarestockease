# 📦 Stock Ease - Inventory Management System

A modern, full-stack inventory management application built with vanilla JavaScript, Express/Vercel Functions, and PostgreSQL. Perfect for small businesses to track product inventory with user authentication.

## ✨ Features

- **User Authentication**: Secure signup/login with JWT tokens
- **Inventory Management**: Add, edit, delete, and track product stock
- **Responsive Design**: Beautiful dark/light mode UI
- **Cloud Ready**: Built for Vercel serverless deployment
- **Real-time Validation**: Client-side form validation with instant feedback
- **Password Security**: Bcrypt hashing with strong password requirements

## 🏗️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Responsive design with flexbox/grid
- Dark mode toggle
- LocalStorage for session management

**Backend:**
- Node.js Vercel Functions (Serverless)
- Express.js (for local development)
- PostgreSQL database
- JWT for authentication
- Bcrypt for password hashing

**Deployment:**
- Vercel (Frontend + Serverless API)
- Supabase/Railway/Render (PostgreSQL)

## 🚀 Quick Start

### Local Development

```bash
# 1. Clone and install
git clone <your-repo>
cd softwarestockease
npm install

# 2. Set up PostgreSQL
createdb stock_ease
# Run SQL from DEPLOYMENT.md

# 3. Create .env.local
cp .env.example .env.local
# Edit with your database details

# 4. Start development server
npm run dev

# 5. Open http://localhost:3000
```

### Deploy to Vercel

See `QUICK_DEPLOY.md` for 5-minute setup, or `DEPLOYMENT.md` for detailed instructions.

```bash
vercel --prod
```

## 📁 Project Structure

```
softwarestockease/
├── api/                      # Vercel serverless functions
│   ├── auth.js              # Authentication endpoints
│   └── products.js          # Product management endpoints
│
├── public/ or root/          # Frontend files
│   ├── index.html           # Home page
│   ├── login.html           # Login page
│   ├── signup.html          # Signup page
│   ├── inventory.html       # Products inventory page
│   ├── api.js              # API client functions
│   ├── script.js           # Frontend logic
│   └── style.css           # Styling
│
├── package.json             # Dependencies & scripts
├── vercel.json             # Vercel configuration
├── .env.example            # Environment template
├── .env.local              # Local secrets (not committed)
│
├── DEPLOYMENT.md           # Detailed deployment guide
├── QUICK_DEPLOY.md        # 5-minute quick start
└── README.md              # This file
```

## 🔐 Authentication Flow

1. **Signup**: User provides fname, lname, email, phone, password
2. **Backend**: 
   - Validates input
   - Hashes password with bcrypt
   - Creates user in database
   - Returns JWT token
3. **Frontend**: 
   - Stores token in localStorage
   - Sets Authorization header for future requests
4. **API Access**: Token verified on all protected endpoints

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*etc.)

## 📡 API Endpoints

### Authentication (No Token Required)

**POST /api/auth?action=signup**
```javascript
{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass123!"
}
```
Returns: `{ token, user: { id, fname, lname, email } }`

**POST /api/auth?action=login**
```javascript
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```
Returns: `{ token, user: { id, fname, lname, email } }`

### Products (Token Required)
All requests need: `Authorization: Bearer <token>`

**POST /api/products** - Create product
```javascript
{
  "product_name": "Laptop",
  "product_id": "PROD001",
  "category": "Electronics",
  "quantity": 10
}
```

**GET /api/products** - Get all user's products
Returns: `{ products: [...] }`

**PUT /api/products?id=<id>** - Update quantity
```javascript
{ "quantity": 25 }
```

**DELETE /api/products?id=<id>** - Delete product

## 🎨 UI/UX Features

- **Dark Mode Toggle**: Persists preference to localStorage
- **Form Validation**: Real-time feedback with visual indicators
- **Error Messages**: Clear, user-friendly error alerts
- **Loading States**: Button feedback during API calls
- **Responsive Layout**: Mobile, tablet, desktop compatible
- **Animated Inputs**: Label animations on focus/input

## 🔧 Environment Variables

**Required for production:**
```
DATABASE_URL=postgresql://user:password@host:5432/stock_ease
JWT_SECRET=your_secret_key_here
NODE_ENV=production
```

**For local development:**
- Copy `.env.example` to `.env.local`
- Update with your local PostgreSQL credentials

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fname VARCHAR(100) NOT NULL,
  lname VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_name VARCHAR(255) NOT NULL,
  product_id VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(50) NOT NULL,
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🐛 Debugging

### Check API Status
```bash
# From browser console or curl
fetch('/api/auth?action=login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'Test123!' })
})
.then(r => r.json())
.then(console.log)
```

### View Vercel Logs
```bash
vercel logs
```

### Local Development
- Check browser console for client-side errors
- Check terminal for server errors (npm run dev)
- Check network tab for API response codes

## 📋 Checklist for Going Live

- [ ] Database created and tables initialized
- [ ] PostgreSQL connection string working
- [ ] JWT_SECRET set in Vercel (strong random string)
- [ ] All environment variables configured
- [ ] Tested signup/login locally
- [ ] Tested product CRUD operations
- [ ] Deployed to Vercel
- [ ] Tested all features on live URL
- [ ] Set up monitoring/logging (optional)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

For deployment issues, see:
- `DEPLOYMENT.md` - Comprehensive setup guide
- `QUICK_DEPLOY.md` - 5-minute quick start
- Vercel docs: https://vercel.com/docs
- PostgreSQL docs: https://www.postgresql.org/docs/

---

Built with ❤️ for efficient inventory management