# 🏗️ Stock Ease Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         VERCEL DEPLOYMENT                       │
│                      (https://your-url.vercel.app)              │
└─────────────────────────────────────────────────────────────────┘
                                  │
                ┌─────────────────┼─────────────────┐
                │                 │                 │
         ┌──────▼────────┐  ┌────▼─────────┐  ┌───▼───────────┐
         │   FRONTEND    │  │   API ROUTES │  │   STATIC CDN  │
         │   (Vercel)    │  │  (Functions) │  │   (Vercel)    │
         └──────┬────────┘  └────┬─────────┘  └───┬───────────┘
                │                │                │
         ┌──────────────────┐    │           (Cache/Serve)
         │ HTML, CSS, JS    │    │
         │ - index.html     │    │
         │ - login.html     │    │
         │ - signup.html    │    │
         │ - inventory.html │    │
         │ - api.js         │    │
         │ - script.js      │    │
         │ - style.css      │    │
         └──────────────────┘    │
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
       ┌────▼─────────┐   ┌─────▼──────────┐  ┌────▼──────────┐
       │  /api/auth   │   │ /api/products  │  │  Environment  │
       │  (auth.js)   │   │ (products.js)  │  │  Variables    │
       └────┬─────────┘   └─────┬──────────┘  └────┬──────────┘
            │                    │                  │
       ┌────────────────────┐    │          ┌──────▼─────────┐
       │  JWT Operations   │    │          │ DATABASE_URL   │
       │ - Signup (POST)   │    │          │ JWT_SECRET     │
       │ - Login (POST)    │    │          │ NODE_ENV       │
       │ - Logout (POST)   │    │          └────────────────┘
       │                  │    │
       │ Password Hashing │    │
       │ - bcryptjs      │    │
       └────────────────────┘   │
                                │
                    ┌──────────────────────┐
                    │   PostgreSQL DB     │
                    │   (Cloud Hosted)    │
                    │                     │
                    │  - Users Table      │
                    │  - Products Table   │
                    │  - Indexes          │
                    └──────────────────────┘
```

## Data Flow

### Signup Flow
```
User Form (browser)
    ↓
api.js signup() function
    ↓
POST /api/auth?action=signup
    ↓
Vercel Function: api/auth.js
    ├─ Validate input
    ├─ Hash password (bcrypt)
    ├─ Insert into users table
    └─ Generate JWT token
    ↓
Response: { token, user }
    ↓
localStorage.setItem('authToken', token)
    ↓
Redirect to dashboard
```

### Login Flow
```
User Form (browser)
    ↓
api.js login() function
    ↓
POST /api/auth?action=login
    ↓
Vercel Function: api/auth.js
    ├─ Validate input
    ├─ Query database for user
    ├─ Verify password (bcrypt)
    └─ Generate JWT token
    ↓
Response: { token, user }
    ↓
localStorage.setItem('authToken', token)
    ↓
API calls now include Authorization header
```

### Product Operations Flow
```
Frontend Action (Create/Read/Update/Delete)
    ↓
api.js function
    ├─ setAuthToken() → Authorization: Bearer <token>
    └─ apiCall() → /api/products
    ↓
Vercel Function: api/products.js
    ├─ Extract token from Authorization header
    ├─ Verify token (JWT)
    ├─ Get userId from decoded token
    └─ Execute operation with user isolation
    ↓
Response: { success, data }
    ↓
Update UI with results
```

## File Organization

```
softwarestockease/
│
├── 📁 api/                          ← Vercel Serverless Functions
│   ├── auth.js                      (Signup, Login, Logout)
│   └── products.js                  (CRUD operations)
│
├── 📁 public/ or root/              ← Static Frontend Files
│   ├── index.html                   (Home page)
│   ├── login.html                   (Login form)
│   ├── signup.html                  (Signup form)
│   ├── inventory.html               (Products page)
│   ├── api.js                       (API client functions)
│   ├── script.js                    (Frontend logic)
│   └── style.css                    (Styling)
│
├── 📄 package.json                  (Dependencies & scripts)
├── 📄 vercel.json                   (Routing & config)
├── 📄 .env.example                  (Environment template)
├── 📄 .env.local                    (Local secrets - NOT committed)
├── 📄 .gitignore                    (Git exclusions)
│
├── 📚 Documentation/
│   ├── README.md                    (Project overview)
│   ├── DEPLOYMENT.md                (Detailed setup guide)
│   ├── QUICK_DEPLOY.md              (5-minute quickstart)
│   ├── SETUP_SUMMARY.md             (What was done)
│   └── ARCHITECTURE.md              (This file)
│
└── 📄 server.js (optional)          (For local Express dev)
```

## Technology Stack

```
Frontend Layer
├─ HTML5                    (Structure)
├─ CSS3                     (Styling)
└─ Vanilla JavaScript       (Logic)
    ├─ localStorage API     (Session storage)
    ├─ Fetch API            (HTTP requests)
    └─ DOM manipulation

Backend Layer (Serverless)
├─ Node.js Runtime          (JavaScript execution)
├─ Vercel Functions         (Serverless platform)
└─ Dependencies:
    ├─ pg                   (PostgreSQL driver)
    ├─ bcryptjs            (Password hashing)
    ├─ jsonwebtoken        (JWT tokens)
    └─ dotenv              (Environment config)

Database Layer
├─ PostgreSQL              (Relational DB)
└─ Hosting Options:
    ├─ Supabase            (Recommended)
    ├─ Railway
    ├─ Render
    └─ Local

Deployment Platform
└─ Vercel
    ├─ Static hosting (CDN)
    ├─ Serverless functions
    ├─ Environment variables
    ├─ Automatic HTTPS
    └─ Git integration
```

## Security Model

```
┌─────────────────────────────────────────────────┐
│         SECURITY LAYERS                         │
└─────────────────────────────────────────────────┘

Layer 1: Transport Security
├─ HTTPS (Vercel automatic)
└─ TLS 1.2+

Layer 2: Authentication
├─ Bcrypt password hashing
│  └─ Salt rounds: 10 (industry standard)
└─ JWT tokens
   └─ Expiration: 7 days

Layer 3: Authorization
├─ Token verification on each request
├─ User isolation (user_id filtering)
└─ CORS headers validation

Layer 4: Input Validation
├─ Email format validation
├─ Password strength checks
├─ Phone number format
└─ SQL injection prevention (parameterized queries)

Layer 5: Secret Management
├─ Environment variables (never in code)
├─ JWT_SECRET in Vercel dashboard
└─ DATABASE_URL encrypted
```

## API Endpoint Architecture

```
POST /api/auth?action=signup
├─ Input: fname, lname, email, phone, password
├─ Processing:
│  ├─ Validate all fields
│  ├─ Check email uniqueness
│  ├─ Hash password with bcrypt
│  └─ Create user record
└─ Output: { token, user }

POST /api/auth?action=login
├─ Input: email, password
├─ Processing:
│  ├─ Find user by email
│  ├─ Verify password
│  └─ Generate JWT token
└─ Output: { token, user }

POST /api/products [Requires Token]
├─ Input: product_name, product_id, category, quantity
├─ Processing:
│  ├─ Verify token
│  ├─ Validate input
│  └─ Insert product with user_id
└─ Output: { product }

GET /api/products [Requires Token]
├─ Processing:
│  ├─ Verify token
│  └─ Query products WHERE user_id = <userId>
└─ Output: { products: [...] }

PUT /api/products?id=<id> [Requires Token]
├─ Input: quantity
├─ Processing:
│  ├─ Verify token
│  └─ Update product (with user ownership check)
└─ Output: { product }

DELETE /api/products?id=<id> [Requires Token]
├─ Processing:
│  ├─ Verify token
│  └─ Delete product (with user ownership check)
└─ Output: { success }
```

## Database Schema

```
┌──────────────────────────────┐
│        USERS TABLE           │
├──────────────────────────────┤
│ id (PK, SERIAL)              │
│ fname (VARCHAR 100)          │
│ lname (VARCHAR 100)          │
│ email (VARCHAR 255, UNIQUE)  │
│ phone (VARCHAR 20)           │
│ password_hash (VARCHAR 255)  │
│ created_at (TIMESTAMP)       │
│                              │
│ INDEX: email (fast lookup)   │
└──────────────────────────────┘
         │
         │ (1:N)
         │
┌──────────────────────────────┐
│      PRODUCTS TABLE          │
├──────────────────────────────┤
│ id (PK, SERIAL)              │
│ user_id (FK → users.id)      │
│ product_name (VARCHAR 255)   │
│ product_id (VARCHAR 100)     │
│ category (VARCHAR 50)        │
│ quantity (INTEGER)           │
│ created_at (TIMESTAMP)       │
│ updated_at (TIMESTAMP)       │
│                              │
│ INDEX: user_id (fast filter) │
│ INDEX: product_id (unique)   │
└──────────────────────────────┘

Relationships:
- CASCADE DELETE: If user deleted, all their products deleted
- User Isolation: Products filtered by user_id in queries
- Unique Constraint: Each product_id is globally unique
```

## Request/Response Examples

### Signup Request
```http
POST /api/auth?action=signup
Content-Type: application/json

{
  "fname": "John",
  "lname": "Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "SecurePass123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fname": "John",
    "lname": "Doe",
    "email": "john@example.com"
  }
}
```

### Create Product Request
```http
POST /api/products
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "product_name": "Laptop",
  "product_id": "PROD001",
  "category": "Electronics",
  "quantity": 10
}

Response:
{
  "success": true,
  "product": {
    "id": 1,
    "user_id": 1,
    "product_name": "Laptop",
    "product_id": "PROD001",
    "category": "Electronics",
    "quantity": 10,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z"
  }
}
```

## Environment

### Development
```
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/stock_ease
JWT_SECRET=dev_secret_key
API_URL=http://localhost:3000/api
```

### Production (Vercel)
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@cloud-db:5432/stock_ease
JWT_SECRET=production_secret_key_generated
API_URL=/api (same domain, relative)
```

## Performance Considerations

```
Caching
├─ Frontend static files
│  └─ Vercel CDN (globally distributed)
├─ Browser caching
│  └─ Configured via Vercel headers
└─ Token caching
   └─ localStorage (client-side)

Database Performance
├─ Indexes on:
│  ├─ users.email (login queries)
│  └─ products.user_id (product filtering)
├─ Connection pooling
│  └─ Enabled in Vercel Functions
└─ Query optimization
   └─ Direct SQL, minimal ORM overhead

API Performance
├─ Serverless cold starts
│  └─ ~1-2 seconds (Vercel optimized)
├─ Response times
│  └─ 100-500ms typical
└─ Scalability
   └─ Auto-scales with demand
```

---

**Last Updated**: 2024
**Deployment Target**: Vercel + PostgreSQL
**Status**: Production Ready