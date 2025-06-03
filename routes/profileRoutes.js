const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

// Get all scraped profiles
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profiles' });
  }
});

module.exports = router;