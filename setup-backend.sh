#!/bin/bash

# Stock Ease Backend Setup Script

echo "📦 Creating backend directory structure..."

mkdir -p backend/routes
mkdir -p backend/middleware

cd backend

echo "📝 Creating package.json..."
cat > package.json << 'EOF'
{
  "name": "stock-ease-backend",
  "version": "1.0.0",
  "description": "Stock Ease Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["stock", "inventory", "management"],
  "author": "",
  "license": "ISC",
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
EOF

echo "📝 Creating .env file..."
cat > .env << 'EOF'
DATABASE_URL=postgresql://postgres:password@localhost:5432/stock_ease
JWT_SECRET=your_jwt_secret_key_here_change_in_production
PORT=5000
NODE_ENV=development
EOF

echo "✅ Backend structure created!"
echo ""
echo "📋 Next steps:"
echo "1. Navigate to backend folder: cd backend"
echo "2. Install dependencies: npm install"
echo "3. Set up PostgreSQL database using the SQL commands in BACKEND_SETUP.md"
echo "4. Update .env with your database credentials"
echo "5. Create route files (routes/auth.js, routes/products.js, middleware/auth.js)"
echo "6. Create server.js"
echo "7. Run: npm run dev"
