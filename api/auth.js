import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
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

async function handleSignup(req, res, pool) {
    try {
        const { fname, lname, email, phone, password } = req.body;

        if (!fname || !lname || !email || !phone || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const userCheck = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await pool.query(
            'INSERT INTO users (fname, lname, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, fname, lname, email',
            [fname, lname, email, phone, hashedPassword]
        );

        const user = result.rows[0];

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Signup failed', message: error.message });
    }
}

async function handleLogin(req, res, pool) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await pool.query(
            'SELECT id, fname, lname, email, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({
            success: true,
            token,
            user: {
                id: user.id,
                fname: user.fname,
                lname: user.lname,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Login failed', message: error.message });
    }
}

export default async function handler(req, res) {
    corsHeaders(req, res);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const pool = getPool();
    const { action } = req.query;

    try {
        if (req.method === 'POST') {
            if (action === 'signup') {
                return await handleSignup(req, res, pool);
            } else if (action === 'login') {
                return await handleLogin(req, res, pool);
            } else if (action === 'logout') {
                return res.json({ success: true, message: 'Logged out successfully' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });
    } catch (error) {
        console.error('API error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
