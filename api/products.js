import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

let pool;

function getPool() {
    if (!pool) {
        pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    return pool;
}

function corsHeaders(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function extractToken(authHeader) {
    if (!authHeader) return null;
    const token = authHeader.split(' ')[1];
    return token;
}

function verifyToken(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
}

async function handleCreateProduct(req, res, userId, pool) {
    try {
        const { product_name, product_id, category, quantity } = req.body;

        if (!product_name || !product_id || !category) {
            return res.status(400).json({ error: 'product_name, product_id, and category are required' });
        }

        const result = await pool.query(
            'INSERT INTO products (user_id, product_name, product_id, category, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, product_name, product_id, category, quantity || 0]
        );

        return res.status(201).json({
            success: true,
            product: result.rows[0]
        });
    } catch (error) {
        console.error('Create product error:', error);
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Product with this ID already exists' });
        }
        return res.status(500).json({ error: 'Failed to create product', message: error.message });
    }
}

async function handleGetProducts(req, res, userId, pool) {
    try {
        const result = await pool.query(
            'SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return res.json({
            success: true,
            products: result.rows
        });
    } catch (error) {
        console.error('Get products error:', error);
        return res.status(500).json({ error: 'Failed to fetch products', message: error.message });
    }
}

async function handleUpdateProduct(req, res, userId, pool, productId) {
    try {
        const { quantity } = req.body;

        if (quantity === undefined) {
            return res.status(400).json({ error: 'quantity is required' });
        }

        const result = await pool.query(
            'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
            [quantity, productId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        return res.json({
            success: true,
            product: result.rows[0]
        });
    } catch (error) {
        console.error('Update product error:', error);
        return res.status(500).json({ error: 'Failed to update product', message: error.message });
    }
}

async function handleDeleteProduct(req, res, userId, pool, productId) {
    try {
        const result = await pool.query(
            'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
            [productId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized' });
        }

        return res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Delete product error:', error);
        return res.status(500).json({ error: 'Failed to delete product', message: error.message });
    }
}

export default async function handler(req, res) {
    corsHeaders(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const authHeader = req.headers.authorization;
    const token = extractToken(authHeader);
    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'No authorization token provided' });
    }

    const userId = decoded.id;
    const pool = getPool();

    try {
        if (req.method === 'POST') {
            return await handleCreateProduct(req, res, userId, pool);
        } else if (req.method === 'GET') {
            return await handleGetProducts(req, res, userId, pool);
        } else if (req.method === 'PUT') {
            const { id } = req.query;
            return await handleUpdateProduct(req, res, userId, pool, id);
        } else if (req.method === 'DELETE') {
            const { id } = req.query;
            return await handleDeleteProduct(req, res, userId, pool, id);
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
