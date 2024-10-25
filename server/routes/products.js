import express from 'express';
import { getProducts } from '../database.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      minPrice: req.query.minPrice ? parseFloat(req.query.minPrice) : 0,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice) : 0,
      retailers: req.query.retailers?.split(',').filter(Boolean),
      rating: req.query.rating ? parseFloat(req.query.rating) : 0
    };

    const products = await getProducts(filters);
    
    // Ensure we always return an array
    res.json(products || []);
    
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products',
      message: error.message 
    });
  }
});

export default router;