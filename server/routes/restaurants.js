const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const authMiddleware = require('../middleware/auth');

router.get('/', async(req, res) => {
    try {
        const { search, cuisine } = req.query;
        let query = {};
        if (search) query.name = { $regex: search, $options: 'i' };
        if (cuisine) query.cuisine = { $regex: cuisine, $options: 'i' };
        const restaurants = await Restaurant.find(query);
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.get('/:id', async(req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        const menuItems = await MenuItem.find({ restaurant: req.params.id, isAvailable: true });
        res.json({ restaurant, menuItems });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/', async(req, res) => {
    try {
        const restaurant = await Restaurant.create({...req.body });
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.post('/:id/menu', async(req, res) => {
    try {
        const menuItem = await MenuItem.create({...req.body, restaurant: req.params.id });
        res.status(201).json(menuItem);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.json({ message: 'Restaurant deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});
router.patch('/:id', async(req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.patch('/:id/menu/:itemId', async(req, res) => {
    try {
        const item = await MenuItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;