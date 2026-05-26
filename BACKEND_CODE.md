# BACKEND SETUP - Complete Code Files

## Step 1: Create folder structure
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

## Step 2: package.json

```json
{
  "name": "stock-ease-backend",
  "version": "1.0.0",
  "description": "Stock Ease Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.1.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## Step 3: .env

```
DATABASE_URL=postgresql://postgres:password@localhost:5432/stock_ease
JWT_SECRET=your_super_secret_jwt_key_change_in_production_2024
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Step 4: server.js

```javascript
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/stock_ease'
});

pool.connect((err, client, release) => {
    if (err) {
        console.error('❌ Error connecting to database:', err.stack);
    } else {
        console.log('✅ Connected to PostgreSQL');
        release();
    }
});

// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api/auth', authRoutes(pool));
app.use('/api/products', productRoutes(pool));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server running', timestamp: new Date() });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error', message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

---

## Step 5: routes/auth.js

```javascript
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function(pool) {
    const router = express.Router();
    const JWT_SECRET = process.env.JWT_SECRET || 'secret';

    // SIGNUP
    router.post('/signup', async (req, res) => {
        try {
            const { fname, lname, email, phone, password } = req.body;

            if (!fname || !lname || !email || !phone || !password) {
                return res.status(400).json({ error: 'All fields required' });
            }

            const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (userExists.rows.length > 0) {
                return res.status(400).json({ error: 'User already exists' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            const result = await pool.query(
                'INSERT INTO users (fname, lname, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, fname, lname, email',
                [fname, lname, email, phone, passwordHash]
            );

            const user = result.rows[0];
            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

            res.status(201).json({
                message: 'Signup successful',
                user: { id: user.id, fname: user.fname, lname: user.lname, email: user.email },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // LOGIN
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password required' });
            }

            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = result.rows[0];
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

            res.json({
                message: 'Login successful',
                user: { id: user.id, fname: user.fname, lname: user.lname, email: user.email },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // VERIFY TOKEN
    router.post('/verify', (req, res) => {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ error: 'Token required' });
            }

            const decoded = jwt.verify(token, JWT_SECRET);
            res.json({ valid: true, user: decoded });
        } catch (error) {
            res.status(401).json({ error: 'Invalid token', valid: false });
        }
    });

    return router;
};
```

---

## Step 6: routes/products.js

```javascript
const express = require('express');
const auth = require('../middleware/auth');

module.exports = function(pool) {
    const router = express.Router();

    // CREATE PRODUCT
    router.post('/', auth(pool), async (req, res) => {
        try {
            const { product_name, product_id, category, quantity } = req.body;
            const userId = req.user.id;

            if (!product_name || !product_id || !category) {
                return res.status(400).json({ error: 'Missing required fields' });
            }

            const exists = await pool.query('SELECT * FROM products WHERE product_id = $1', [product_id]);
            if (exists.rows.length > 0) {
                return res.status(400).json({ error: 'Product ID already exists' });
            }

            const result = await pool.query(
                'INSERT INTO products (user_id, product_name, product_id, category, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [userId, product_name, product_id, category, quantity || 0]
            );

            res.status(201).json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // GET ALL PRODUCTS
    router.get('/', auth(pool), async (req, res) => {
        try {
            const userId = req.user.id;
            const result = await pool.query('SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // UPDATE PRODUCT
    router.put('/:id', auth(pool), async (req, res) => {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const userId = req.user.id;

            const result = await pool.query(
                'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                [quantity, id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    // DELETE PRODUCT
    router.delete('/:id', auth(pool), async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const result = await pool.query('DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json({ message: 'Product deleted' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
};
```

---

## Step 7: middleware/auth.js

```javascript
const jwt = require('jsonwebtoken');

module.exports = function(pool) {
    return function(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];

            if (!token) {
                return res.status(401).json({ error: 'Token required' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};
```

---

## Setup Instructions

1. Create the folder structure above
2. Copy each file into its corresponding location
3. Run: `npm install`
4. Set up PostgreSQL database (see BACKEND_SETUP.md for SQL)
5. Update .env with your database credentials
6. Run: `npm run dev`

Server will start on http://localhost:5000
