const express = require('express');
const authMiddleware = require('../middleware/auth');

module.exports = function(pool) {
    const router = express.Router();

    // Apply auth middleware to all product routes
    router.use(authMiddleware);

    // CREATE PRODUCT
    router.post('/', async (req, res) => {
        try {
            const { product_name, product_id, category, quantity } = req.body;
            const userId = req.userId;

            // Validate input
            if (!product_name || !product_id || !category) {
                return res.status(400).json({ error: 'product_name, product_id, and category are required' });
            }

            const result = await pool.query(
                'INSERT INTO products (user_id, product_name, product_id, category, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [userId, product_name, product_id, category, quantity || 0]
            );

            res.status(201).json({
                success: true,
                product: result.rows[0]
            });
        } catch (error) {
            console.error('Create product error:', error);
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Product with this ID already exists' });
            }
            res.status(500).json({ error: 'Failed to create product', message: error.message });
        }
    });

    // GET ALL PRODUCTS FOR USER
    router.get('/', async (req, res) => {
        try {
            const userId = req.userId;

            const result = await pool.query(
                'SELECT * FROM products WHERE user_id = $1 ORDER BY created_at DESC',
                [userId]
            );

            res.json({
                success: true,
                products: result.rows
            });
        } catch (error) {
            console.error('Get products error:', error);
            res.status(500).json({ error: 'Failed to fetch products', message: error.message });
        }
    });

    // UPDATE PRODUCT
    router.put('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const userId = req.userId;

            if (quantity === undefined) {
                return res.status(400).json({ error: 'quantity is required' });
            }

            const result = await pool.query(
                'UPDATE products SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_id = $3 RETURNING *',
                [quantity, id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found or unauthorized' });
            }

            res.json({
                success: true,
                product: result.rows[0]
            });
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({ error: 'Failed to update product', message: error.message });
        }
    });

    // DELETE PRODUCT
    router.delete('/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const userId = req.userId;

            const result = await pool.query(
                'DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING id',
                [id, userId]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Product not found or unauthorized' });
            }

            res.json({
                success: true,
                message: 'Product deleted successfully'
            });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({ error: 'Failed to delete product', message: error.message });
        }
    });

    return router;
};
