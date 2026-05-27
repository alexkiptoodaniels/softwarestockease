# Stock Ease - Vercel Deployment Guide

## Overview
Stock Ease is now configured for serverless deployment on Vercel. This guide walks you through setting up and deploying the application.

## Prerequisites
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
- **GitHub Repository**: The code must be pushed to GitHub
- **PostgreSQL Database**: A PostgreSQL database (can be local or cloud-hosted)
  - Recommended services: Supabase, Railway, Render
- **Node.js 18+** (for local development)

## Project Structure
```
softwarestockease/
├── api/                    # Vercel serverless functions
│   ├── auth.js            # Authentication endpoints
│   └── products.js        # Product management endpoints
├── public/                # Frontend static files
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── inventory.html
│   ├── api.js
│   ├── script.js
│   └── style.css
├── package.json
├── vercel.json           # Vercel configuration
├── .env.local            # Local environment variables (NOT committed)
└── README.md
```

## Step 1: Set Up PostgreSQL Database

### Option A: Local PostgreSQL
```bash
# Create database
createdb stock_ease

# Connect and run SQL
psql stock_ease

# Create tables
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    fname VARCHAR(100) NOT NULL,
    lname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_users_email ON users(email);
```

### Option B: Cloud PostgreSQL
Use one of these services (all offer free tiers):
- **Supabase**: Best for Vercel (same parent company)
  - Go to supabase.com
  - Create project
  - Get connection string from Settings > Database
  
- **Railway.app**: 
  - Create new project
  - Add PostgreSQL plugin
  - Get connection string from Connect tab

- **Render.com**:
  - Create PostgreSQL database
  - Copy external connection string

## Step 2: Set Up Environment Variables

### Local Development (.env.local)
Create `.env.local` in the root directory:
```
DATABASE_URL=postgresql://username:password@localhost:5432/stock_ease
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

### Vercel Deployment
In Vercel dashboard:
1. Go to Settings > Environment Variables
2. Add these variables:
   - `DATABASE_URL` - Your cloud PostgreSQL connection string
   - `JWT_SECRET` - A strong random string (generate with `openssl rand -base64 32`)
   - `NODE_ENV` - Set to `production`

## Step 3: Install Dependencies & Test Locally

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Visit http://localhost:3000
# API endpoints available at http://localhost:3000/api/auth
```

## Step 4: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# You'll be prompted to:
# 1. Connect your GitHub account
# 2. Select your repository
# 3. Add environment variables when prompted
# 4. Deploy!

# For production deployment
vercel --prod
```

### Method 2: GitHub Integration
1. Push code to GitHub
2. Go to vercel.com/new
3. Import your GitHub repository
4. Add environment variables in the configuration
5. Click Deploy

## Step 5: Test the Deployment

### Check that everything is working:
```bash
# Test health endpoint
curl https://your-project.vercel.app/api/auth

# Test signup
curl -X POST https://your-project.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "SecurePass123!"
  }' \
  -G --data-urlencode 'action=signup'

# Test login
curl -X POST https://your-project.vercel.app/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }' \
  -G --data-urlencode 'action=login'
```

## API Endpoints

All endpoints are prefixed with `/api/`

### Authentication
- **POST /auth?action=signup** - Register new user
  ```json
  {
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "SecurePass123!"
  }
  ```

- **POST /auth?action=login** - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "SecurePass123!"
  }
  ```

- **POST /auth?action=logout** - Logout user

### Products (Requires Authentication)
All product endpoints require `Authorization: Bearer <token>` header

- **POST /products** - Create product
  ```json
  {
    "product_name": "Laptop",
    "product_id": "PROD001",
    "category": "Electronics",
    "quantity": 10
  }
  ```

- **GET /products** - Get all user's products

- **PUT /products?id=<id>** - Update product quantity
  ```json
  {
    "quantity": 25
  }
  ```

- **DELETE /products?id=<id>** - Delete product

## Troubleshooting

### "Failed to fetch" errors
- Check that DATABASE_URL is correctly set in Vercel
- Verify database is reachable from Vercel's servers
- Check function logs in Vercel dashboard

### CORS errors
- CORS is enabled for all origins in vercel.json
- Check that Authorization header is properly formatted

### Database connection errors
- Verify DATABASE_URL is correct
- For cloud databases, check IP whitelist settings
- Ensure tables are created

### 401 Unauthorized
- Token might be expired (regenerate by logging in again)
- Check token is sent with `Authorization: Bearer <token>`

## View Logs

In Vercel dashboard:
1. Go to your project
2. Click "Deployments"
3. Click on the latest deployment
4. Go to "Functions" tab to see API logs

Or use Vercel CLI:
```bash
vercel logs
```

## Environment Variables in Vercel

To update environment variables after deployment:
1. Go to project Settings > Environment Variables
2. Click the variable to edit
3. Update value
4. Changes apply to new deployments automatically

## Database Backups

For production systems, set up automated backups:
- **Supabase**: Automatic daily backups included
- **Railway**: Set up in dashboard
- **Render**: Premium feature

## Security Best Practices

1. **Never commit .env files** - They're in .gitignore
2. **Use strong JWT_SECRET** - Generate with `openssl rand -base64 32`
3. **Use HTTPS only** - Vercel provides free HTTPS
4. **Rotate secrets** - Update JWT_SECRET periodically
5. **Database SSL** - Enable SSL for database connections
6. **Rate limiting** - Consider adding in production

## Performance Tips

1. **Database Indexes** - Already created for user email and user_id on products
2. **Connection pooling** - Enabled in API functions
3. **Cache tokens** - Frontend caches auth tokens in localStorage
4. **CDN** - Vercel automatically CDNs static files

## Scaling Considerations

- **Current setup**: Good for 100-10,000 users
- **Database bottleneck**: Consider connection pooling service (PgBouncer)
- **Authentication**: Consider external service for 10,000+ users
- **API rate limiting**: Implement in future versions

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **GitHub Issues**: Report bugs in the repository

## Deployment Checklist

- [ ] PostgreSQL database created and tables initialized
- [ ] DATABASE_URL environment variable set in Vercel
- [ ] JWT_SECRET environment variable set (strong random string)
- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected to GitHub
- [ ] First deployment successful
- [ ] Can sign up and login from live URL
- [ ] Can create/read/update/delete products
- [ ] Frontend and API communicate correctly
