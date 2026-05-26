# Stock Ease Backend Setup Guide

## Backend Architecture: Node.js + Express + PostgreSQL

### Prerequisites
- Node.js (v16+)
- PostgreSQL installed and running
- npm or yarn

### Step 1: Create Backend Directory
```bash
mkdir backend
cd backend
npm init -y
```

### Step 2: Install Dependencies
```bash
npm install express pg bcryptjs jsonwebtoken dotenv cors body-parser
npm install --save-dev nodemon
```

### Step 3: Create .env file
```
DATABASE_URL=postgresql://username:password@localhost:5432/stock_ease
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

### Step 4: Create PostgreSQL Database and Tables

```sql
-- Create database
CREATE DATABASE stock_ease;

-- Connect to database
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

-- Create index for faster queries
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_users_email ON users(email);
```

### Step 5: Create server.js file

See the included server.js file in this backend folder.

### Step 6: Create Routes

Create folders and files:
- routes/auth.js - for signup, login, logout
- routes/products.js - for product CRUD operations
- middleware/auth.js - for JWT verification

### Step 7: Run the Backend
```bash
npm run dev
```

Server will run on http://localhost:5000

### Frontend Integration

Update your JavaScript to call the backend APIs:

**Signup:**
```javascript
POST /api/auth/signup
{
    fname: "John",
    lname: "Doe",
    email: "john@example.com",
    phone: "712345678",
    password: "SecurePassword123!"
}
```

**Login:**
```javascript
POST /api/auth/login
{
    email: "john@example.com",
    password: "SecurePassword123!"
}
// Returns: { token: "jwt_token_here" }
```

**Add Product:**
```javascript
POST /api/products
Headers: { Authorization: "Bearer jwt_token" }
{
    product_name: "Laptop",
    product_id: "PROD001",
    category: "Electronics",
    quantity: 10
}
```

**Get Products:**
```javascript
GET /api/products
Headers: { Authorization: "Bearer jwt_token" }
```

**Update Product Quantity:**
```javascript
PUT /api/products/:productId
Headers: { Authorization: "Bearer jwt_token" }
{
    quantity: 25
}
```

**Delete Product:**
```javascript
DELETE /api/products/:productId
Headers: { Authorization: "Bearer jwt_token" }
```

### Next Steps

1. Create the backend server files
2. Set up PostgreSQL database
3. Update frontend to use API endpoints instead of localStorage
4. Deploy backend to a service (Heroku, Railway, Render)
5. Deploy frontend to Vercel
6. Update API endpoints to match your deployed backend URL

Would you like me to create the complete server.js and route files?
