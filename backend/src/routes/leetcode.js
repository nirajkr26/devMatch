import express from 'express';
import axios from 'axios';

const router = express.Router();

/**
 * Proxy route for LeetCode GraphQL API to avoid CORS issues on the frontend.
 */
router.post('/leetcode', async (req, res, next) => {
    try {
        const response = await axios.post('https://leetcode.com/graphql', req.body, {
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('LeetCode Proxy Error:', error.message);
        res.status(error.response?.status || 500).json({
            message: 'Error fetching data from LeetCode',
            error: error.message
        });
    }
});

export default router;
