const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = function(pool) {
    const router = express.Router();

    // SIGNUP
    router.post('/signup', async (req, res) => {
        try {
            const { fname, lname, email, phone, password } = req.body;

            // Validate input
            if (!fname || !lname || !email || !phone || !password) {
                return res.status(400).json({ error: 'All fields are required' });
            }

            // Check if user already exists
            const userCheck = await pool.query(
                'SELECT id FROM users WHERE email = $1',
                [email]
            );

            if (userCheck.rows.length > 0) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user
            const result = await pool.query(
                'INSERT INTO users (fname, lname, email, phone, password_hash) VALUES ($1, $2, $3, $4, $5) RETURNING id, fname, lname, email',
                [fname, lname, email, phone, hashedPassword]
            );

            const user = result.rows[0];

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
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
            res.status(500).json({ error: 'Signup failed', message: error.message });
        }
    });

    // LOGIN
    router.post('/login', async (req, res) => {
        try {
            const { email, password } = req.body;

            // Validate input
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Find user
            const result = await pool.query(
                'SELECT id, fname, lname, email, password_hash FROM users WHERE email = $1',
                [email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const user = result.rows[0];

            // Verify password
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.json({
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
            res.status(500).json({ error: 'Login failed', message: error.message });
        }
    });

    // LOGOUT (optional - can be handled on client side)
    router.post('/logout', (req, res) => {
        res.json({ success: true, message: 'Logged out successfully' });
    });

    return router;
};
